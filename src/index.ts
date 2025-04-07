#!/usr/bin/env node

import { proxy as StdioProxy } from "./stdio";

const main = async () => {
  // based on args, decide which proxy to use
  const proxyType = process.argv[2];
  try {
    if (proxyType === "stdio") {
      await StdioProxy();
    } else {
      console.error(`Unknown proxy type: ${proxyType}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error in proxy:", error);
  }
};

main();
