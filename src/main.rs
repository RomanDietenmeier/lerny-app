pub mod code_editor;
pub mod my_app;
use my_app::MyApp;

fn main() {
    let mut options = eframe::NativeOptions::default();
    options.maximized = true;

    eframe::run_native(
        "Lerny App",
        options,
        Box::new(|_cc| Box::new(MyApp::new(_cc))),
    );
}
