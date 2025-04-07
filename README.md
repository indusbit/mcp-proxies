# MCP Proxies

A TypeScript library that provides proxy implementations for communication between transport layers of MCP.

Currently supports stdio proxy with Server-Sent Events (SSE) for bidirectional communication.

## Usage

### Command Line

After cloning the repository, install dependencies:

```bash
npm install
```

To start the stdio proxy, set the `MCP_SERVER_URL` environment variable to the base URL of the SSE server:

```bash
MCP_SERVER_URL=http://localhost:3000/sse npx . stdio
```

You can also set the `MCP_LOG_FILE` environment variable to a path to a log file for debugging:

```bash
MCP_SERVER_URL=http://localhost:3000/sse MCP_LOG_FILE=./logs/stdio.log npx stdio
```

When settign the `MCP_LOG_FILE` environment variable in an MCP client (like claude), don't forget to provide it a full path.

## Proxy Types

### stdio

The stdio proxy establishes a bidirectional communication channel between standard input/output and a server using Server-Sent Events (SSE):

1. Connects to an SSE endpoint specified by `MCP_SERVER_URL` (defaults to "http://localhost:4000/sse")
2. Receives a messaging endpoint from the server via an "endpoint" event
3. Forwards messages from stdin to the server via HTTP POST requests
4. Forwards messages from the server to stdout

## Configuration

The following environment variables can be used to configure the proxies:

- `MCP_SERVER_URL`: The base URL for the SSE connection (default: "http://localhost:4000/sse")
- `MCP_LOG_FILE`: Path to a log file for debugging (if not set, logging is disabled)

## Development

### Building

```bash
npm run build
```

## License

MIT
