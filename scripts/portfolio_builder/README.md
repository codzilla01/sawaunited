# Portfolio builder

The source data is in `sawa_data.py`. The scripts produce the standalone web viewer and its Arabic/English PDF and editable PowerPoint downloads.

## Requirements

Use Python 3.10 or later and install the packages listed in `requirements.txt`:

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install -r scripts/portfolio_builder/requirements.txt
```

The PDF engine's Cairo and Manrope static font files are bundled in `fonts/` with their OFL license texts. JPEG source images live in `portfolio/assets/`; generated web images are WebP files in the same directory.

## Build

Run commands from the repository root, sequentially (the PDF and PowerPoint engines share a prepared-image cache):

```bash
python scripts/portfolio_builder/build_web_portfolio.py
python scripts/portfolio_builder/sawa_pdf_engine.py
python scripts/portfolio_builder/sawa_pptx_engine.py
```

Outputs are written to `portfolio/`. Set `SAWA_PREP_DIR` to choose a temporary cache directory or `SAWA_FONT_DIR` to use a different directory containing the expected font filenames. The source files are not modified by a build except for the generated portfolio outputs.

Content intentionally distinguishes listed sector names and website links from independently verified operations. Add claims, client names, registrations, or project examples only when their supporting evidence and publication authorization are available.
