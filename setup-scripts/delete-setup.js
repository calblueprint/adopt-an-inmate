/**
 * This script removes setup scripts from package.json
 * and deletes the setup-scripts folder.
 * 
 * Still leaves mention of setup-scripts in .prettierignore, eslint.config.mjs, and tsconfig.json.
 * Make sure to remove those if you want to delete all traces.
 * But that's less important.
 */

const path = require('path');
const fs = require('fs');

// delete package.json scripts
const packageJsonPath = path.resolve(__dirname, "../package.json");
const pkgData = require(packageJsonPath);

const scriptsToRemove = ['setup:styled-components', 'setup:tailwind', 'delete-setup'];

scriptsToRemove.forEach((script) => {
  delete pkgData.scripts[script]
});

fs.writeFileSync(packageJsonPath, JSON.stringify(pkgData, null, 2))

console.log("If you want to remove all traces of setup-scripts, ensure you remove its mention in:\n- .prettierignore\n- eslint.config.mjs\n- tsconfig.json");

// delete setup-scripts folder
fs.rmSync(__dirname, { recursive: true, force: true });
