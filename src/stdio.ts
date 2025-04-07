import * as readline from 'readline'
import { EventSource } from "eventsource"
import { log } from './utils'

// interface RPCRequest {
//   jsonrpc: '2.0'
//   id: number | string
//   method: string
//   params?: any
// }

// interface RPCResponse {
//   jsonrpc: '2.0'
//   id: number | string | null
//   result?: any
//   error?: { code: number; message: string }
// }

const maxRetries = 3;
const retryDelay = 500; // 0.5 second

export const proxy = async () => {
  log(`Current process: ${process.pid}, ${process.cwd()}, ${process.platform}`)

  function createFullUrl(urlOrPath: string, baseUrl: string): string {
    try {
      new URL(urlOrPath); // Check if it's already a valid URL
      return urlOrPath;   // If yes, return as is
    } catch {
      // If not a valid URL, treat as path and join with base URL
      const base = new URL(baseUrl);
      // Extract origin (protocol + hostname + port) from base URL
      const origin = base.origin;
      // Combine base path with new path, ensuring proper slash handling
      const normalizedPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
      return new URL(normalizedPath, origin).toString();
    }
  }

  let messageEndpoint: String | null = null
  const baseUrl = process.env.MCP_SERVER_URL || "http://localhost:4000/sse"

  log("Base URL: " + baseUrl)

  await new Promise((resolve) => setTimeout(resolve, 2000));

  let sseConnection = new EventSource(baseUrl);
  sseConnection.onopen = () => {
    log("SSE connection opened");
  }
  sseConnection.addEventListener("endpoint", (event) => {
    log("Messaging Endpoint: " + event.data);
    messageEndpoint = createFullUrl(event.data, baseUrl);
  });
  sseConnection.onmessage = (event) => {
    log("Received message: " + event.data);
    process.stdout.write(event.data + '\n')
  };
  sseConnection.onerror = (error) => {
    log({ error });
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  rl.on('line', async (line: string) => {
    // Log to file and console
    log(line)

    let retryCount = 0;
    while (messageEndpoint === null) {
      log("No message endpoint found. Waiting request.")

      // wait for 0.5 second
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      log("Checking again: " + messageEndpoint)

      retryCount++;
      if (retryCount >= maxRetries) {
        log("Max retries reached. Exiting. Line: " + line)
        return
      }
    }

    const fetchResult = await fetch(messageEndpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: line
    })


    const response = await fetchResult.text()
    let parsedLine = line
    let parsedResponse = response

    try {
      parsedLine = JSON.parse(line)
    } catch {
      // do nothing
    }

    try {
      parsedResponse = JSON.parse(response)
    } catch {
      // do nothing
    }
    log({ line: parsedLine, response: parsedResponse })
  })
}
