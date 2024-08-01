const complexityPlugin = require('eslint-plugin-complexity');

module.exports = {
    plugins: {
        complexity: complexityPlugin
    },
    ignores: [
        ".vscode/**/*", 
        "Archive/**/*", 
        "node_modules/**/*", 
        "tests/**/*"
    ],
    "rules": {
        "complexity": [ "warn", { "max": 0 } ]
    }, 
};