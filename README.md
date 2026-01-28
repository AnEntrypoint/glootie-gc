# gm for Gemini CLI

## Installation

Copy to your Gemini extensions directory:

```bash
cp -r . ~/.gemini/extensions/gm
```

Or clone directly:

```bash
git clone https://github.com/AnEntrypoint/glootie-gc ~/.gemini/extensions/gm
```

## Environment

Set GEMINI_PROJECT_DIR to your project directory in your shell profile.

## Features

- MCP tools for code execution and search
- State machine agent policy (gm)
- Stop hook verification loop
- Git enforcement on session end
- AST analysis via thorns at session start

The extension activates automatically on session start.
