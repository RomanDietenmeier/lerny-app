# LERNY-APP

![Learn Page Example](./ReadMeContents/Lerny%20App%20example%20Learn%20Page%20showcase.jpg 'Learn Page')

# Dependencies

- check if you have the required Dependencies of [node-pty](https://www.npmjs.com/package/node-pty)
- "xdg-utils" are needed on Linux to open external Links in LearnPages

# Possible install errors:

- contpty.node was compiled against a different Node.js version
  - do: `./node_modules/.bin/electron-rebuild`

# Build from source:

- clone Project
- open Terminal in Project
- npm i (Node v16.14.2 is required)
- ./node_modules/.bin/electron-rebuild
- npm run build
- then you can find your finished build in the "out" directory
