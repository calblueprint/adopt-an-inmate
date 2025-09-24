/**
 * This script follows the specified config file
 * to setup the project.
 * 
 * Procedure:
 * 1. Parse specified config file
 * 2. Install relevant dependencies
 * 3. Copy relevant setup files that are safe
 * 4. If user did not specify manual setup, overwrite files for setup
 */

const fs = require('fs');
const path = require('path')
const readline = require('readline');
const { exit } = require('process');
const { exec: childProcessExec } = require('child_process');
const { promisify } = require('util');

const exec = promisify(childProcessExec);
const execAndPrint = async (cmd) => {
  const { stdout, stderr } = await exec(cmd);
  if (stderr)
    throw new Error(stderr);
  else
    console.log(stdout);
}

// check arguments
if (process.argv.length !== 3) {
  console.error("Usage: node setup.js [config.json]");
  exit(1);
}

// parse config file
const configName = process.argv[2];
const configJson = require(path.resolve(__dirname, `${configName}.json`));
const dependencies = configJson.dependencies || [];
const devDependencies = configJson.devDependencies || [];

// parse directories and setup files
const setupDir = path.join(__dirname, "_", configJson.name);
const baseDir = path.resolve(__dirname, "..");

if (!fs.existsSync(setupDir)) {
  console.error(`${configJson.name}: setup folder not found.`)
  exit(1);
}

const setupDirContent = fs.readdirSync(setupDir, { recursive: true, withFileTypes: true });
const setupFiles = setupDirContent.filter(c => c.isFile()).map(c => path.relative(setupDir, path.resolve(c.parentPath, c.name)));

const existsMap = setupFiles.reduce((acc, f) => {
  acc[f] = fs.existsSync(path.join(baseDir, f));
  return acc;
}, {});

const overwrites = setupFiles.filter(f => existsMap[f]);
const files = setupFiles.filter(f => !existsMap[f]);

// configure i/o
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (prompt) => {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer)
    })
  })
}

async function main() {
  // await confirmation
  console.log("This script will overwrite:");
  overwrites.forEach(w => console.log(`- ${w}`));
  console.log("\nType (m) if you want to manually update them instead.\n");

  if (dependencies.length > 0) {
    console.log("Dependencies to install:");
    dependencies.forEach(d => console.log(`- ${d}`));
    console.log("");
  }

  if (devDependencies.length > 0) {
    console.log("Dev Dependencies to install:");
    devDependencies.forEach(d => console.log(`- ${d}`));
    console.log("");
  }

  let manual = false;
  let answer = await ask("Do you want to continue? (y/n/m): ");
  while (true) {
    const answerLowered = answer.toLowerCase();

    if (answerLowered === 'y') {
      break;
    } else if (answerLowered === 'n') {
      exit(0);
    } else if (answerLowered === 'm') {
      manual = true;
      break;
    }

    answer = await ask("(y/n/m): ");
  }

  // install packages
  if (dependencies.length > 0) {
    await execAndPrint(`pnpm install ${dependencies.join(" ")}`);
  }

  if (devDependencies.length > 0) {
    await execAndPrint(`pnpm install -D ${devDependencies.join(" ")}`);
  }

  // copy files
  const copyFile = (file) => {
    fs.copyFileSync(path.join(setupDir, file), path.join(baseDir, file));
    console.log(`Wrote to ${file}.`);
  }

  files.forEach(f => copyFile(f));

  if (overwrites.length > 0 && !manual) {
    overwrites.forEach(f => copyFile(f));
  }

  console.log("\nSetup complete.");

  // reminder for manual setup
  if (overwrites.length > 0 && manual) {
    console.log("\nEnsure you update:");
    overwrites.forEach(f => console.log(`- ${f}`));
  }

  // prompt for delete
  let deleteAnswer = await ask("\nDelete setup scripts? (y/n): ");
  while (true) {
    const deleteAnswerLowered = deleteAnswer.toLowerCase();
    if (deleteAnswerLowered === 'y') {
      break;
    } else if (deleteAnswerLowered === 'n') {
      console.log("\nIf you want to delete setup scripts, run:\npnpm delete-setup");
      exit(0);
    } else {
      deleteAnswer = await ask("(y/n): ");
    }
  }

  // run delete script
  await execAndPrint("pnpm delete-setup");

  return;
}

main().then(() => {
  exit(0);
});
