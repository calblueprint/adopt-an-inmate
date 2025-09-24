# \[Insert Project Name\]

[//]: # "Delete this section when done!"

## PL TODOs

- Update the GitHub PR template located in `.github/pull_request_template.md` to suit your project
- Update this README (Ctrl-F "insert" and replace it with the relevant project-specific info)
- Discuss which styling library to use with your devs and run the relevant script to update this repo
- Update this README to remove the todos

Setup scripts (only run once):
```sh
# setup styled components
pnpm setup:styled-components

# setup tailwind
pnpm setup:tailwind

# delete setup scripts
pnpm delete-setup
```

---
[//]: # "When done, delete the section above up to and including this comment!"

This project is being built by a team at [Blueprint](https://calblueprint.org), a student organization at the University of California, Berkeley building software pro bono for nonprofits.

## Getting Started

### Prerequisites

Check your installation of `node` and `pnpm`:

```bash
node -v
pnpm -v
```

We strongly recommend using a Node version manager like [nvm](https://github.com/nvm-sh/nvm) (for Mac) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows) to install Node.js. If you don't plan on switching between different Node versions, you can alternatively get a [prebuilt installer](https://nodejs.org/en/download/prebuilt-installer) from the Node.js website for an easier approach. Make sure to get Node version 20 and up, the latest LTS version should be sufficient.

After installing Node, you most likely have npm installed as well (check by running `npm -v`). If you have npm installed, simply run `npm install -g pnpm` to install pnpm. If your command line does not recognize npm as a command, refer to [this article](https://www.geeksforgeeks.org/how-to-resolve-npm-command-not-found-error-in-node-js/) to troubleshoot.

Additional resources:
- [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Installing pnpm without npm](https://pnpm.io/installation)

### Installation

1. Clone the repo & install dependencies

   1. Clone this repo
      - using SSH (recommended)
        ```bash
        git clone git@github.com:calblueprint/[insert-project-repo.git]
        ```
      - using HTTPS
        ```bash
        git clone https://github.com/calblueprint/[insert-project-repo.git]
        ```
   2. Enter the cloned directory
      ```bash
      cd [insert-project-name]
      ```
   3. Install project dependencies. This command installs all packages from [`package.json`](package.json).
      ```bash
      pnpm install
      ```

2. Set up secrets:
   1. In the project's root directory (`[insert-project-name]/`), create a new file named `.env.local`
   2. Copy the credentials from [Blueprint's internal Notion](https://www.notion.so/calblueprint/Environment-Setup-6fb1e251cdca4393b9dd47a3436abc11?pvs=4#9c2ff603f7a44348835c97e96d521d2d) (access is required) and paste them into the `.env.local` file.

**Helpful resources**

- [GitHub: Cloning a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository)
- [GitHub: Generating SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

### Development environment

- **[VSCode](https://code.visualstudio.com/) (recommended)**
  1. Open the `[insert-project-name]` project in VSCode.
  2. Install recommended workspace VSCode extensions. You should see a pop-up on the bottom right to "install the recommended extensions for this repository".

### Running the app

In the project directory, run:

```shell
pnpm dev
```

Then, navigate to http://localhost:3000 to launch the web application.
