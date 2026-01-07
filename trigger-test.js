
const fs = require('fs');
const path = require('path');
fs.appendFileSync('C:/dev/glootie-gc/trigger.log', 'Triggered at ' + new Date().toISOString() + '\n');
console.log(JSON.stringify({ decision: 'allow' }));
