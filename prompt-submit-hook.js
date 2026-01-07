#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pluginRoot = __dirname;
const projectDir = process.cwd();

try {
  let outputs = [];

  // 1. Read ./agents/apex.md
  const startMdPath = path.join(pluginRoot, 'agents', 'apex.md');
  if (fs.existsSync(startMdPath)) {
      const startMdContent = fs.readFileSync(startMdPath, 'utf-8');
      outputs.push(startMdContent);
  }

  // 2. Run mcp-thorns (npx)
  try {
    const thornOutput = execSync(`npx -y mcp-thorns@latest`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: projectDir,
      timeout: 180000,
      killSignal: 'SIGTERM'
    });
    outputs.push(`=== mcp-thorns ===\n${thornOutput}`);
  } catch (e) {
    if (e.killed && e.signal === 'SIGTERM') {
      outputs.push(`=== mcp-thorns ===\nSkipped (3min timeout)`);
    } else {
      outputs.push(`=== mcp-thorns ===\nSkipped (error: ${e.message.split('\n')[0]})`);
    }
  }

  const additionalContext = outputs.join('\n\n');

  // Gemini CLI expects 'additionalContext' in the root or 'hookSpecificOutput' depending on version. 
  // Sticking to root for now as it worked, but CC uses hookSpecificOutput.
  // I will output both to be safe/compatible.
  
  const result = {
    decision: 'allow', // Gemini specific
    additionalContext, // Gemini specific
    hookSpecificOutput: { // CC specific structure, might be adopted by Gemini later
      hookEventName: 'SessionStart',
      additionalContext
    }
  };

  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.log(JSON.stringify({ 
    decision: 'allow',
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `Error executing hook: ${error.message}`
    }
  }, null, 2));
}