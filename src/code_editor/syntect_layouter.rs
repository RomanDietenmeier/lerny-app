use std::sync::Arc;

use eframe::{
    egui,
    epaint::{text::LayoutJob, Galley},
};

#[derive(Clone, Copy, Hash, PartialEq)]
enum SyntectTheme {
    Base16MochaDark,
    SolarizedLight,
}

impl SyntectTheme {
    fn syntect_key_name(&self) -> &'static str {
        match self {
            Self::Base16MochaDark => "base16-mocha.dark",
            Self::SolarizedLight => "Solarized (light)",
        }
    }
}

#[derive(Clone, Hash, PartialEq)]
struct CodeTheme {
    dark_mode: bool,
    syntect_theme: SyntectTheme,
}

impl CodeTheme {
    fn dark() -> Self {
        Self {
            dark_mode: true,
            syntect_theme: SyntectTheme::Base16MochaDark,
        }
    }

    fn light() -> Self {
        Self {
            dark_mode: false,
            syntect_theme: SyntectTheme::SolarizedLight,
        }
    }

    fn from_memory(ctx: &egui::Context) -> Self {
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
                egui::FontId::monospace(24.0),
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
                        font_id: egui::FontId::monospace(24.0),
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

fn highlight(ctx: &egui::Context, theme: &CodeTheme, code: &str, language: &str) -> LayoutJob {
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

pub fn get_layouter(
    programming_language: &str,
) -> fn(ui: &egui::Ui, string: &str, wrap_width: f32) -> Arc<Galley> {
    match programming_language {
        "c" => get_layouter_c,
        "rs" => get_layouter_rust_lang,
        _ => get_layouter_rust_lang,
    }
}

pub fn get_layouter_rust_lang(ui: &egui::Ui, string: &str, wrap_width: f32) -> Arc<Galley> {
    let mut layout_job = highlight(ui.ctx(), &CodeTheme::from_memory(ui.ctx()), string, "rs");
    layout_job.wrap.max_width = wrap_width;
    ui.fonts().layout_job(layout_job)
}

pub fn get_layouter_c(ui: &egui::Ui, string: &str, wrap_width: f32) -> Arc<Galley> {
    let mut layout_job = highlight(ui.ctx(), &CodeTheme::from_memory(ui.ctx()), string, "c");
    layout_job.wrap.max_width = wrap_width;
    ui.fonts().layout_job(layout_job)
}
