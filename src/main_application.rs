use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Seek, Write},
    path::Path,
    process::{Command, ExitStatus, Stdio},
    str,
};

use console::Term;
use eframe::{
    egui::{self, FontData, FontDefinitions, TextStyle},
    epaint::{Color32, FontFamily, FontId, Stroke},
};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;
use sysinfo::{Pid, ProcessExt, ProcessStatus, System, SystemExt};

use crate::code_editor::syntect_layouter::get_layouter;

pub struct MainApplication {
    searchbar_text: String,
    no_stroke_frame: egui::Frame,
    code: String,
    code_file: File,
    code_running_process_id: usize,
}

impl Default for MainApplication {
    fn default() -> Self {
        match fs::metadata("./tmp") {
            Ok(metadata) => {
                if !metadata.is_dir() {
                    fs::create_dir("./tmp").expect("could not create TMP folder");
                }
            }
            Err(_) => {
                println!(
                    "could not get info about the TMP folder\ntrying to create the folder anyway"
                );
                fs::create_dir("./tmp").expect("could not create TMP folder");
            }
        }
        let code_file_path = Path::new("./tmp/code.c");
        let mut code_file = match OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(code_file_path)
        {
            Err(why) => panic!("couldn't create: {}", why),
            Ok(file) => file,
        };

        let mut code_file_content = String::new();
        match code_file.read_to_string(&mut code_file_content) {
            Err(why) => panic!("couldn't read: {}", why),
            Ok(_) => {}
        }
        Self {
            searchbar_text: String::default(),
            no_stroke_frame: egui::Frame::none().stroke(Stroke {
                width: 0.0,
                color: Color32::TRANSPARENT,
            }),
            code: code_file_content,
            code_file,
            code_running_process_id: 0,
        }
    }
}

impl MainApplication {
    fn capture_c_output(&mut self) {
        if self.code_running_process_id != 0 {
            if let Some(process) =
                System::new_all().process(Pid::from(self.code_running_process_id))
            {
                if process.status() == ProcessStatus::Run {
                    return;
                }
            }
        }
        Term::stdout()
            .clear_screen()
            .expect("Could not clear Console");

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
            let child = if cfg!(target_os = "windows") {
                Command::new(".\\tmp\\code.exe")
                    .stdin(Stdio::inherit())
                    .stdout(Stdio::inherit())
                    .stderr(Stdio::inherit())
                    .spawn()
                    .expect("failed to execute process")
            } else {
                Command::new("./tmp/code.exe")
                    .stdin(Stdio::inherit())
                    .stdout(Stdio::inherit())
                    .stderr(Stdio::inherit())
                    .spawn()
                    .expect("failed to execute process")
            };

            self.code_running_process_id = child.id() as usize;
        }
    }

    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
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
            FontData::from_static(include_bytes!("../resources/fonts/consolas/CONSOLA.TTF")),
        );
        fonts.font_data.insert(
            Roboto::Roboto100Thin.value().to_owned(),
            FontData::from_static(include_bytes!("../resources/fonts/roboto/Roboto-Thin.ttf")),
        );
        fonts.font_data.insert(
            Roboto::Roboto300Light.value().to_owned(),
            FontData::from_static(include_bytes!("../resources/fonts/roboto/Roboto-Light.ttf")),
        );
        fonts.font_data.insert(
            Roboto::Roboto400Regular.value().to_owned(),
            FontData::from_static(include_bytes!(
                "../resources/fonts/roboto/Roboto-Regular.ttf"
            )),
        );
        fonts.font_data.insert(
            Roboto::Roboto500Medium.value().to_owned(),
            FontData::from_static(include_bytes!(
                "../resources/fonts/roboto/Roboto-Medium.ttf"
            )),
        );
        fonts.font_data.insert(
            Roboto::Roboto700Bold.value().to_owned(),
            FontData::from_static(include_bytes!("../resources/fonts/roboto/Roboto-Bold.ttf")),
        );
        fonts.font_data.insert(
            Roboto::Roboto900Black.value().to_owned(),
            FontData::from_static(include_bytes!("../resources/fonts/roboto/Roboto-Black.ttf")),
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
        Self::default()
    }
}

impl eframe::App for MainApplication {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::TopBottomPanel::top("project_container")
            .frame(self.no_stroke_frame.fill(ctx.style().visuals.window_fill()))
            .show(ctx, |ui| {
                let project_container_size = ui.available_size();

                egui::SidePanel::left("project_selection")
                    .frame(self.no_stroke_frame.fill(ctx.style().visuals.window_fill()))
                    .show_inside(ui, |ui| {
                        ui.set_width(project_container_size.x / 2.0);
                        ui.add_sized(
                            ui.available_size(),
                            egui::TextEdit::singleline(&mut self.searchbar_text)
                                .frame(true)
                                .hint_text("search..."),
                        );
                    });
                egui::SidePanel::right("project_preview")
                    .frame(self.no_stroke_frame.fill(ctx.style().visuals.window_fill()))
                    .show_inside(ui, |ui| {
                        ui.set_width(project_container_size.x / 2.0);
                        ui.add_sized(ui.available_size(), egui::Label::new("PREVIEW"));
                    });
            });

        egui::CentralPanel::default().show(ctx, |ui| {
            let code_response = ui.add(
                egui::TextEdit::multiline(&mut self.code)
                    .font(egui::TextStyle::Monospace)
                    .desired_rows(10)
                    .code_editor()
                    .desired_width(f32::INFINITY)
                    .lock_focus(true)
                    .layouter(&mut get_layouter("c")),
            );

            if code_response.changed() {
                match self.code_file.set_len(self.code.len().try_into().unwrap()) {
                    Ok(_) => {}
                    Err(why) => panic!("could not truncatef the file: {}", why),
                };
                match self.code_file.seek(std::io::SeekFrom::Start(0)) {
                    Ok(_) => match self.code_file.write_all(self.code.as_bytes()) {
                        Err(why) => panic!("couldn't write to: {}", why),
                        Ok(_) => {}
                    },
                    Err(why) => panic!("could not seekt to the start of the file: {}", why),
                }
            }

            if ui.button("RUN ▶️").clicked() {
                self.capture_c_output();
            }
        });
    }
}
