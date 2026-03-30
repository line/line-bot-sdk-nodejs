#!/usr/bin/env node
import { main } from "./line-bot-client-generator/main.mjs";

const rootDir = process.argv[2] ?? process.cwd();
main(rootDir);
