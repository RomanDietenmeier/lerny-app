# LERNY-APP

![Learn Project Example](./read-me-contents/TitlePage.png 'Lerny Title Page')<br>
![Learn Project Example](./read-me-contents/LearnProjectPreview.png 'Learn Project')
![Learn Project Editor](./read-me-contents/LearnProjectEdit.png 'Learn Project Editor')<br>
With the Lerny App you can create interactive Tutorials.<br>
You can explain everything in Markdown, write run & test code.<br>
And you can export your Learn Projects to share them with other.<br>

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
