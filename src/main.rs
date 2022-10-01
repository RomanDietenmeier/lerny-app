use eframe::{
    egui::{self, FontData, FontDefinitions, TextStyle},
    epaint::{FontFamily, FontId},
};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

fn main() {
    let mut options = eframe::NativeOptions::default();
    options.maximized = true;

    eframe::run_native(
        "Lerny App",
        options,
        Box::new(|_cc| Box::new(MyApp::new(_cc))),
    );
}

#[derive(Default)]
struct MyApp {
    searchbar_text: String, // clicked: bool,
}

// impl Default for MyApp {
//     fn default() -> Self {
//         Self { clicked: false }
//     }
// }

impl MyApp {
    fn new(cc: &eframe::CreationContext<'_>) -> Self {
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

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &egui::Context, frame: &mut eframe::Frame) {
        egui::TopBottomPanel::top("project_container").show(ctx, |ui| {
            let project_container_size = ui.available_size();

            egui::SidePanel::left("project_selection").show_inside(ui, |ui| {
                ui.set_width(project_container_size.x / 2.0);
                ui.add_sized(
                    ui.available_size(),
                    egui::TextEdit::singleline(&mut self.searchbar_text),
                );
            });
            egui::SidePanel::right("project_preview").show_inside(ui, |ui| {
                ui.set_width(project_container_size.x / 2.0);
                ui.add_sized(ui.available_size(), egui::Label::new("PREVIEW"));
            });
        });

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading(
                "Hello World!\nis Web? ".to_string().to_owned()
                    + &frame.is_web().to_string().to_owned()
                    + "\n",
            );
            ui.monospace(
                "Hello World!\nis Web? ".to_string().to_owned()
                    + &frame.is_web().to_string().to_owned()
                    + "\n",
            );
            ui.small(
                "Hello World!\nis Web? ".to_string().to_owned()
                    + &frame.is_web().to_string().to_owned()
                    + "\n",
            );
            ui.label(
                "Hello World!\nis Web? ".to_string().to_owned()
                    + &frame.is_web().to_string().to_owned()
                    + "\n",
            );
            if ui
                .button(
                    "Hello World!\nis Web? ".to_string().to_owned()
                        + &frame.is_web().to_string().to_owned()
                        + "\n",
                )
                .clicked()
            {
                print!("CLICK\n");
            }
        });
    }
}
