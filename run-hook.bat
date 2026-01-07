@echo off
echo Starting hook at %date% %time% >> C:\dev\glootie-gc\hook-debug.log
node C:\dev\glootie-gc\pre-tool-use-hook.js
