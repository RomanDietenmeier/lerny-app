use std::process::{Command, ExitStatus, Stdio};

use console::Term;
use eframe::{
    egui::{self, FontData, FontDefinitions, TextStyle},
    epaint::{FontFamily, FontId},
};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

use crate::global_singleton::GLOBAL_SINGLETON;

use super::MainApplication;

pub fn capture_c_output() {
    match GLOBAL_SINGLETON.lock() {
        Err(err) => {
            println!("could not get GLOBAL_SINGLETON: {}", err);
            return;
        }
        Ok(mut singleton) => {
            if singleton.child_process.kill_process() {
                return;
            }
        }
    }

    Term::stdout()
        .clear_screen()
        .expect("Could not clear Console");

    std::thread::spawn(|| {
        let child = if cfg!(target_os = "windows") {
            Command::new("gcc")
                .args([".\\tmp\\code.c", "-Wall", "-o", ".\\tmp\\code.exe"])
                .stdin(Stdio::inherit())
                .stdout(Stdio::inherit())
                .stderr(Stdio::inherit())
                .output()
                .expect("failed to execute process")
        } else {
            Command::new("gcc")
                .args(["./tmp/code.c", "-Wall", "-o", "./tmp/code.exe"])
                .stdin(Stdio::inherit())
                .stdout(Stdio::inherit())
                .stderr(Stdio::inherit())
                .output()
                .expect("failed to execute process")
        };
        if ExitStatus::code(&child.status) == Some(0) {
            let mut child = if cfg!(target_os = "windows") {
                Command::new(".\\tmp\\code.exe")
                    .spawn()
                    .expect("failed to execute process")
            } else {
                Command::new("./tmp/code.exe")
                    .spawn()
                    .expect("failed to execute process")
            };

            match GLOBAL_SINGLETON.lock() {
                Err(err) => {
                    println!("could not get GLOBAL_SINGLETON: {}", err);
                    match child.kill() {
                        Err(err) => {
                            panic!("Could not kill child process: {}", err);
                        }
                        Ok(_) => {}
                    }
                    return;
                }
                Ok(mut singleton) => {
                    singleton.child_process.child_process = Some(child);
                }
            }
        }
    });
}

pub fn new_main_application(cc: &eframe::CreationContext<'_>) -> MainApplication {
    // Customize egui here with cc.egui_ctx.set_fonts and cc.egui_ctx.set_visuals.
    // Restore app state using cc.storage (requires the "persistence" feature).
    // Use the cc.gl (a glow::Context) to create graphics shaders and buffers that you can use
    // for e.g. egui::PaintCallback.

    #[derive(EnumIter)]
    enum Roboto {
        Roboto100Thin,
        Roboto300Light,
        Roboto400Regular,
        Roboto500Medium,
        Roboto700Bold,
        Roboto900Black,
    }

    impl Roboto {
        fn value(&self) -> &str {
            match *self {
                Roboto::Roboto100Thin => "Roboto-Thin-100",
                Roboto::Roboto300Light => "Roboto-Light-300",
                Roboto::Roboto400Regular => "Roboto-Regular-400",
                Roboto::Roboto500Medium => "Roboto-Medium-500",
                Roboto::Roboto700Bold => "Roboto-Bold-700",
                Roboto::Roboto900Black => "Roboto-Black-900",
            }
        }
    }

    let mut fonts = FontDefinitions::default();

    fonts.font_data.insert(
        "ConsolasRegular".to_owned(),
        FontData::from_static(include_bytes!("../../resources/fonts/consolas/CONSOLA.TTF")),
    );
    fonts.font_data.insert(
        Roboto::Roboto100Thin.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Thin.ttf"
        )),
    );
    fonts.font_data.insert(
        Roboto::Roboto300Light.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Light.ttf"
        )),
    );
    fonts.font_data.insert(
        Roboto::Roboto400Regular.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Regular.ttf"
        )),
    );
    fonts.font_data.insert(
        Roboto::Roboto500Medium.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Medium.ttf"
        )),
    );
    fonts.font_data.insert(
        Roboto::Roboto700Bold.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Bold.ttf"
        )),
    );
    fonts.font_data.insert(
        Roboto::Roboto900Black.value().to_owned(),
        FontData::from_static(include_bytes!(
            "../../resources/fonts/roboto/Roboto-Black.ttf"
        )),
    );

    for font in Roboto::iter() {
        fonts.families.insert(
            eframe::epaint::FontFamily::Name(font.value().into()),
            vec![font.value().to_owned()],
        );
    }
    fonts.families.insert(
        eframe::epaint::FontFamily::Name("ConsolasRegular".into()),
        vec!["ConsolasRegular".to_owned()],
    );

    cc.egui_ctx.set_fonts(fonts);

    let visuals = egui::Visuals::light();

    cc.egui_ctx.set_visuals(visuals);

    let mut style: egui::Style = (*cc.egui_ctx.style()).clone();

    let font_body = FontId {
        size: 24.0,
        family: FontFamily::Name(Roboto::Roboto400Regular.value().into()), //family: FontFamily::Name("Linux Libertine G".into())
    };
    let font_heading = FontId {
        size: 24.0,
        family: FontFamily::Name(Roboto::Roboto700Bold.value().into()), //family: FontFamily::Name("Linux Libertine G".into())
    };
    let font_button = FontId {
        size: 24.0,
        family: FontFamily::Name(Roboto::Roboto900Black.value().into()), //family: FontFamily::Name("Linux Libertine G".into())
    };
    let font_small = FontId {
        size: 24.0,
        family: FontFamily::Name(Roboto::Roboto300Light.value().into()), //family: FontFamily::Name("Linux Libertine G".into())
    };
    let font_monospace = FontId {
        size: 24.0,
        family: FontFamily::Name("ConsolasRegular".into()), //family: FontFamily::Name("Linux Libertine G".into())
    };

    style
        .text_styles
        .insert(TextStyle::Monospace, font_monospace);
    style.text_styles.insert(TextStyle::Small, font_small);
    style.text_styles.insert(TextStyle::Body, font_body);
    style.text_styles.insert(TextStyle::Button, font_button);
    style.text_styles.insert(TextStyle::Heading, font_heading);
    cc.egui_ctx.set_style(style);
    MainApplication::default()
}
