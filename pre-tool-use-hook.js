#!/usr/bin/env node

const fs = require('fs');

const run = () => {
  try {
    const input = fs.readFileSync(0, 'utf-8');
    if (!input) return { decision: 'allow' };
    
    const data = JSON.parse(input);
    const tool_name = data.tool_name || '';
    const tool_input = data.tool_input || {};

    // Normalize tool name
    const cleanToolName = tool_name.includes(':') ? tool_name.split(':').pop() : tool_name;

    if (cleanToolName === 'run_shell_command') {
      return {
        decision: 'deny',
        reason: 'The native run_shell_command is disabled. You MUST use mcp__glootie__execute for all shell commands, scripts, and code execution to ensure environment consistency.'
      };
    }

    // Block native search tools in favor of MCP tools or direct execution
    if (['glob', 'search_file_content'].includes(cleanToolName)) {
      return {
        decision: 'deny',
        reason: 'Use glootie code execution (run_shell_command) or code-search MCP tool instead.'
      };
    }

    // Block exploration agents if they duplicate code-search functionality
    if (cleanToolName === 'delegate_to_agent') {
       const agentName = tool_input.agent_name || '';
       if (agentName.toLowerCase().includes('explore') || agentName === 'codebase_investigator') {
         return {
           decision: 'deny',
           reason: 'Use mcp__glootie__execute for code execution. For codebase exploration, use mcp code-search.'
         };
       }
    }

    return { decision: 'allow' };
  } catch (error) {
    return { decision: 'allow' };
  }
};

try {
  const result = run();
  console.log(JSON.stringify(result));
} catch (error) {
  console.log(JSON.stringify({ decision: 'allow' }));
}
