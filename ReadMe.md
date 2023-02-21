# LERNY-APP

![Learn Page Example](./read-me-contents/Lerny%20App%20example%20Learn%20Page%20showcase.jpg 'Learn Page')

# Set up Development Environment
- [Windows Setup Video](https://youtu.be/fH2xYBm0YYg)
- clone project
- use node version v16.14.2
  - nvm install 16.14.2
  - nvm use 16.14.2
- check "node-pty" dependencies:
  - [node-pty](https://www.npmjs.com/package/node-pty)
    <br>
    For example on Windows:
    - make sure python3 is installed
    - install the [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk) features for "Desktop C++ Apps"
    - npm install --global --production windows-build-tools
- npm i
- npm run start

## Hints and possible Problems

### "contpty.node" was compiled against a different Node.js version

- do: `./node_modules/.bin/electron-rebuild`

### External Links on Linux

- "xdg-utils" are needed to be installed to open external Links in LearnPages

# Build from source:

- setup Development Environment
- npm run build
