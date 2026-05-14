import pdfplumber
import re


def extract_sections_from_pdf(pdf_path):
    sections = []
    current_section = None
    current_text = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            for line in text.split('\n'):
                line = line.strip()
                if not line:
                    continue

                # Détecte les titres de sections (Chapitre, Règle, Article, Part)
                is_heading = re.match(
                    r'^(chapitre|règle|article|part|chapter|rule|section)\s+[\dIVXivx\-]+',
                    line, re.IGNORECASE
                )

                if is_heading:
                    # Sauvegarde la section précédente
                    if current_section:
                        current_section['summary'] = ' '.join(current_text[:50])
                        sections.append(current_section)

                    current_section = {
                        'reference': line[:100],
                        'title': line[:255],
                        'summary': '',
                        'tags': [],
                        'order': len(sections) + 1
                    }
                    current_text = []
                else:
                    current_text.append(line)

        # Dernière section
        if current_section:
            current_section['summary'] = ' '.join(current_text[:50])
            sections.append(current_section)

    return sections