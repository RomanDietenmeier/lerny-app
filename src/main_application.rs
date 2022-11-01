pub mod main_application_helper;

use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Seek, Write},
    path::Path,
};

use eframe::{
    egui::{self},
    epaint::{Color32, Stroke},
};

use cfg_if::cfg_if;

cfg_if! {
    if #[cfg(target_os = "linux")] {
        use libc::pid_t;
    }
}

use crate::code_editor::syntect_layouter::get_layouter;
use crate::main_application::main_application_helper::new_main_application;

use self::main_application_helper::capture_c_output;

cfg_if! {
    if #[cfg(target_os = "windows")] {
        pub struct MainApplication {
            searchbar_text: String,
            no_stroke_frame: egui::Frame,
            code: String,
            code_file: File,
            code_running_process_id: usize,
        }
    }else{
        pub struct MainApplication {
            searchbar_text: String,
            no_stroke_frame: egui::Frame,
            code: String,
            code_file: File,
            code_running_process_id: pid_t,
        }
    }
}

impl Default for MainApplication {
    fn default() -> Self {
        match fs::metadata("./tmp") {
            Ok(metadata) => {
                if !metadata.is_dir() {
                    panic!("Pls remove the existing data in your directory!");
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
        capture_c_output(self);
    }

    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        new_main_application(cc)
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
