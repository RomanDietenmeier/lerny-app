use eframe::{
    egui::{self, FontData, FontDefinitions, TextStyle},
    epaint::{text::LayoutJob, Color32, FontFamily, FontId, Stroke},
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

#[derive(Clone, Copy, Hash, PartialEq)]
enum SyntectTheme {
    Base16EightiesDark,
    Base16MochaDark,
    Base16OceanDark,
    Base16OceanLight,
    InspiredGitHub,
    SolarizedDark,
    SolarizedLight,
}

impl SyntectTheme {
    fn all() -> impl ExactSizeIterator<Item = Self> {
        [
            Self::Base16EightiesDark,
            Self::Base16MochaDark,
            Self::Base16OceanDark,
            Self::Base16OceanLight,
            Self::InspiredGitHub,
            Self::SolarizedDark,
            Self::SolarizedLight,
        ]
        .iter()
        .copied()
    }

    fn name(&self) -> &'static str {
        match self {
            Self::Base16EightiesDark => "Base16 Eighties (dark)",
            Self::Base16MochaDark => "Base16 Mocha (dark)",
            Self::Base16OceanDark => "Base16 Ocean (dark)",
            Self::Base16OceanLight => "Base16 Ocean (light)",
            Self::InspiredGitHub => "InspiredGitHub (light)",
            Self::SolarizedDark => "Solarized (dark)",
            Self::SolarizedLight => "Solarized (light)",
        }
    }

    fn syntect_key_name(&self) -> &'static str {
        match self {
            Self::Base16EightiesDark => "base16-eighties.dark",
            Self::Base16MochaDark => "base16-mocha.dark",
            Self::Base16OceanDark => "base16-ocean.dark",
            Self::Base16OceanLight => "base16-ocean.light",
            Self::InspiredGitHub => "InspiredGitHub",
            Self::SolarizedDark => "Solarized (dark)",
            Self::SolarizedLight => "Solarized (light)",
        }
    }

    pub fn is_dark(&self) -> bool {
        match self {
            Self::Base16EightiesDark
            | Self::Base16MochaDark
            | Self::Base16OceanDark
            | Self::SolarizedDark => true,

            Self::Base16OceanLight | Self::InspiredGitHub | Self::SolarizedLight => false,
        }
    }
}

#[derive(Clone, Hash, PartialEq)]
pub struct CodeTheme {
    dark_mode: bool,
    syntect_theme: SyntectTheme,
}

impl CodeTheme {
    pub fn dark() -> Self {
        Self {
            dark_mode: true,
            syntect_theme: SyntectTheme::Base16MochaDark,
        }
    }

    pub fn light() -> Self {
        Self {
            dark_mode: false,
            syntect_theme: SyntectTheme::SolarizedLight,
        }
    }

    pub fn from_memory(ctx: &egui::Context) -> Self {
        if ctx.style().visuals.dark_mode {
            ctx.data()
                .get_persisted(egui::Id::new("dark"))
                .unwrap_or_else(CodeTheme::dark)
        } else {
            ctx.data()
                .get_persisted(egui::Id::new("light"))
                .unwrap_or_else(CodeTheme::light)
        }
    }
}

struct Highlighter {
    ps: syntect::parsing::SyntaxSet,
    ts: syntect::highlighting::ThemeSet,
}

impl Default for Highlighter {
    fn default() -> Self {
        Self {
            ps: syntect::parsing::SyntaxSet::load_defaults_newlines(),
            ts: syntect::highlighting::ThemeSet::load_defaults(),
        }
    }
}

fn as_byte_range(whole: &str, range: &str) -> std::ops::Range<usize> {
    let whole_start = whole.as_ptr() as usize;
    let range_start = range.as_ptr() as usize;
    assert!(whole_start <= range_start);
    assert!(range_start + range.len() <= whole_start + whole.len());
    let offset = range_start - whole_start;
    offset..(offset + range.len())
}

impl Highlighter {
    #[allow(clippy::unused_self, clippy::unnecessary_wraps)]
    fn highlight(&self, theme: &CodeTheme, code: &str, lang: &str) -> LayoutJob {
        self.highlight_impl(theme, code, lang).unwrap_or_else(|| {
            // Fallback:
            LayoutJob::simple(
                code.into(),
                egui::FontId::monospace(12.0),
                if theme.dark_mode {
                    egui::Color32::LIGHT_GRAY
                } else {
                    egui::Color32::DARK_GRAY
                },
                f32::INFINITY,
            )
        })
    }

    fn highlight_impl(&self, theme: &CodeTheme, text: &str, language: &str) -> Option<LayoutJob> {
        use syntect::easy::HighlightLines;
        use syntect::highlighting::FontStyle;
        use syntect::util::LinesWithEndings;

        let syntax = self
            .ps
            .find_syntax_by_name(language)
            .or_else(|| self.ps.find_syntax_by_extension(language))?;

        let theme = theme.syntect_theme.syntect_key_name();
        let mut h = HighlightLines::new(syntax, &self.ts.themes[theme]);

        use egui::text::{LayoutSection, TextFormat};

        let mut job = LayoutJob {
            text: text.into(),
            ..Default::default()
        };

        for line in LinesWithEndings::from(text) {
            for (style, range) in h.highlight_line(line, &self.ps).ok()? {
                let fg = style.foreground;
                let text_color = egui::Color32::from_rgb(fg.r, fg.g, fg.b);
                let italics = style.font_style.contains(FontStyle::ITALIC);
                let underline = style.font_style.contains(FontStyle::ITALIC);
                let underline = if underline {
                    egui::Stroke::new(1.0, text_color)
                } else {
                    egui::Stroke::none()
                };
                job.sections.push(LayoutSection {
                    leading_space: 0.0,
                    byte_range: as_byte_range(text, range),
                    format: TextFormat {
                        font_id: egui::FontId::monospace(12.0),
                        color: text_color,
                        italics,
                        underline,
                        ..Default::default()
                    },
                });
            }
        }

        Some(job)
    }
}
/// Memoized Code highlighting
pub fn highlight(ctx: &egui::Context, theme: &CodeTheme, code: &str, language: &str) -> LayoutJob {
    impl egui::util::cache::ComputerMut<(&CodeTheme, &str, &str), LayoutJob> for Highlighter {
        fn compute(&mut self, (theme, code, lang): (&CodeTheme, &str, &str)) -> LayoutJob {
            self.highlight(theme, code, lang)
        }
    }

    type HighlightCache = egui::util::cache::FrameCache<LayoutJob, Highlighter>;

    let mut memory = ctx.memory();
    let highlight_cache = memory.caches.cache::<HighlightCache>();
    highlight_cache.get((theme, code, language))
}

// #[derive(Default)]
struct MyApp {
    searchbar_text: String,
    no_stroke_frame: egui::Frame,
    code: String,
}

impl Default for MyApp {
    fn default() -> Self {
        Self {
            searchbar_text: String::default(),
            no_stroke_frame: egui::Frame::none().stroke(Stroke {
                width: 0.0,
                color: Color32::TRANSPARENT,
            }),
            code: "".into(),
        }
    }
}

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
            let mut theme = CodeTheme::from_memory(ui.ctx());
            let mut layouter = |ui: &egui::Ui, string: &str, wrap_width: f32| {
                let mut layout_job = highlight(ui.ctx(), &theme, string, "rs");
                layout_job.wrap.max_width = wrap_width;
                ui.fonts().layout_job(layout_job)
            };

            ui.add(
                egui::TextEdit::multiline(&mut self.code)
                    .code_editor()
                    .desired_width(f32::INFINITY)
                    .lock_focus(true)
                    .layouter(&mut layouter),
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
