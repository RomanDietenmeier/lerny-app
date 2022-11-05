<div align="center">

# LERNY-APP 📖👨🏼‍💻👩🏿‍💻

![a snapshot picture of the application](./SnapshotImage.jpg "SnapShot 08.October.2022")

</div>

## Description
Lerny-App will be an App to teach noobs programming.<br>
The App should have the following features:

ToDo:
- CodeEditor
- CodeSnippet Testing
- Support for Learning-Pages like in Jupyter Notebooks
- Share Learning-Pages
- Learning Projects
- Gamification

## Development
How to run and test the app:

### <b>watchexec</b>
Watchexec recompiles and reruns the programm on every file change.
```powershell
watchexec -r 'cargo run'
```
watchexec can be installed as follows:
```powershell
cargo install watchexec-cli
```
[Click to read more about watchexec](https://crates.io/crates/watchexec-cli)
### <b>bacon</b>
Bacon recompiles the programm on every file change.
```powershell
bacon
```
bacon can be installed as follows:
```powershell
cargo install bacon
```

# Current ToDo's
- show that your app is running in main app
- - like changing the run button into an loading spinner, ...
- ✓ make that compiling is non blocking! 
- - currently compiling blocks the main thread
- start / stop button is currently always trying to stop the child, even when the child is done
- - on Linux
