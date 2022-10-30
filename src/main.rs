pub mod code_editor;
pub mod main_application;

use main_application::MainApplication;

fn main() {
    eframe::run_native(
        "Lerny App",
        eframe::NativeOptions::default(),
        Box::new(|_cc| Box::new(MainApplication::new(_cc))),
    );
}
