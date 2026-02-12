import { parse } from "@babel/parser";
import { createHash } from "node:crypto";

export function calculateASTHash(code) {
  const ast = parse(code, {
    sourceType: "unambiguous",
    plugins: ["jsx", "typescript"],
  });

  cleanAST(ast);

  // 決定論的なJSON文字列に変換
  const astJson = JSON.stringify(ast, (key, value) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((s, k) => ((s[k] = value[k]), s), {});
    }
    return value;
  });

  return createHash("sha1").update(astJson).digest("hex");
}

function cleanAST(node) {
  if (!node || typeof node !== "object") return;
  const ignoreProps = [
    "loc",
    "start",
    "end",
    "extra",
    "leadingComments",
    "trailingComments",
    "innerComments",
    "comments",
    "tokens",
  ];
  ignoreProps.forEach((prop) => delete node[prop]);
  for (const key in node) {
    if (Array.isArray(node[key])) {
      node[key].forEach(cleanAST);
    } else {
      cleanAST(node[key]);
    }
  }
}
