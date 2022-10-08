pub mod code_editor;
pub mod main_application;
use main_application::MainApplication;

fn main() {
    let mut options = eframe::NativeOptions::default();
    options.maximized = true;

    eframe::run_native(
        "Lerny App",
        options,
        Box::new(|_cc| Box::new(MainApplication::new(_cc))),
    );
}
