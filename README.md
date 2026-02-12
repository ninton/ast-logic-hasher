# ast-logic-hasher

Ensure code logic remains unchanged during refactoring (Prettier, ESLint, etc.) by comparing AST hashes.

## Why this?
When you format legacy code, `git diff` often becomes huge and noisy. This tool generates a SHA-1 hash of the code's **logic structure** (AST), ignoring formatting, comments, and metadata. If the hash remains the same, your refactoring hasn't changed the program's behavior.

## Usage

### Direct use with npx

```bash
# Direct use with npx
cat old.js | npx ast-logic-hasher > before.txt
cat new.js | npx ast-logic-hasher > after.txt
diff before.txt after.txt
```

### Bulk verification (Recursive)
Perfect for verifying a large refactor across a whole project:

```bash
# 1. Before refactoring
find ./src -name "*.js" | sort | xargs -I {} sh -c 'echo -n "{}: "; cat {} | npx ast-logic-hasher' > before.txt

# ... do your refactoring (prettier, eslint --fix, etc.) ...

# 2. After refactoring
find ./src -name "*.js" | sort | xargs -I {} sh -c 'echo -n "{}: "; cat {} | npx ast-logic-hasher' > after.txt

# 3. Compare
diff before.txt after.txt
```

exmaple before.txt
```plaintext
./src/auth.js: d6fc3e9bc82506ecb2b8b8c28f85080570d639ae
./src/utils/api.js: 6b432b9eeaf3f3fd2ee1850fc40faf645f2199e0
./src/xxx/c.js: f013360319ad047c62c2411f9b505662d9f43e9f
```

## Features

- Logic Only: Ignores comments, location data, and formatting.
- Modern JS Support: Supports JSX and TypeScript syntax out of the box.
- Deterministic: Object keys in AST are sorted before hashing to ensure consistency.

## Requirements

- Node.js >= 20.0.0
