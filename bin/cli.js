#!/usr/bin/env node
import { stdin } from "node:process";
import { calculateASTHash } from "../index.js";

let code = "";
for await (const chunk of stdin) {
  code += chunk;
}

if (!code.trim()) {
  process.exit(0);
}

try {
  console.log(calculateASTHash(code));
} catch (err) {
  console.error("Parse Error:", err.message);
  process.exit(1);
}
