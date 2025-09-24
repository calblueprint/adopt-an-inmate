## Overview

The files in this folder are solely meant to further setup Blueprint projects, typically to provide recommended setup for styling frameworks like Tailwind and styled-components.

```sh
# setup tailwind
pnpm setup:tailwind

# setup styled components
pnpm setup:styled-components
```

Once done, feel free to delete this script folder and the relevant scripts in package.json. An easy command to use is:
```sh
pnpm delete-setup
```

Note: this does NOT remove all traces of setup. `.prettierignore`, `eslint.config.mjs`, and `tsconfig.json` will still list the `setup-scripts` folder in their "ignored" lists. The user is reminded of this after execution of the `delete-setup` script.

## Maintaining Setups

For anyone looking to update the scripts for the future, here's what you need to know:
- The setup script (`setup.js`) takes as argument the name of the setup configuration file (JSON), without the JSON extension (e.g. `node setup.js tailwind`)
- Config files specify:
  - `name` - specifies which folder to look for inside the `_` directory for its setup files
  - `dependencies` - list of dependencies to install
  - `devDependencies` - list of dev dependencies to install

Relevant setup files should be placed inside the `setup-scripts/_/[name]` directory. The setup script will copy all files in this directory, placing it under the subfolder(s) of the same name (e.g. `_/tailwind/lib/utils.ts` will be placed in `@/lib/utils.ts`).

Currently, the setup script is hardcoded to use `pnpm` as the installer. If interested, one can expand the script to include other package managers (e.g. Bun, yarn, npm).

### Modifying Setups

Vocab: a "setup" (n.) refers to a specific set of dependencies and files (e.g. tailwind).

To modify dependencies or dev dependencies required by a setup, simply update the config file for the relevant setup.

To modify its files, simply add/modify/delete its related files in the `_/[name]` directory.

### Adding New Setups

To add a new setup, you can copy one of the existing config (JSON) files to get started.

Here's what you need to change:
- Rename its `name` property in the JSON file to whatever you want
- Update the (dev) dependencies as necessary
- Create a folder in `setup-scripts/_`, name it the same name as you put in the JSON file
- Add the necessary setup files to be copied when a user runs the setup script
- Add a script in `package.json` (i.e. `"setup:[name]": "node ./setup-scripts/setup [config-name]`)
  - The config name is the name of the JSON file, which can be different from the name specified in the contents of the JSON file (although that is not recommended).
- In `delete-setup.js`, add the name of the script you created into the `scriptsToRemove` list.
