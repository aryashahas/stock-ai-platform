#!/usr/bin/env python3
"""
Final Thesis PDF Generator - Strictly follows Indus University B.Tech Guidelines
Margins: L=1.25", R=1.0", T=1.0", B=1.0"
Line spacing: 1.5 for body, double between paragraphs/sections
Font: Times New Roman (16/14/12pt as specified)
Page numbering: Roman (front matter), Arabic (chapters)
Project ID: IU/IITE/CSE/2026/IDP138
"""
from fpdf import FPDF

# Constants - Margins in mm (converted from inches)
L_MARGIN = 31.75   # 1.25 inches
R_MARGIN = 25.4    # 1.0 inches
T_MARGIN = 25.4    # 1.0 inches
B_MARGIN = 25.4    # 1.0 inches
PAGE_W = 210
CONTENT_W = PAGE_W - L_MARGIN - R_MARGIN  # ~152.85mm

# Line heights
LH = 8        # 1.5 spacing for 12pt (~7.6mm, using 8 for readability)
LH_DOUBLE = 16  # double spacing gap
PROJECT_ID = "IU/IITE/CSE/2026/IDP138"


def to_roman(num):
    vals = [(1000,'m'),(900,'cm'),(500,'d'),(400,'cd'),(100,'c'),(90,'xc'),
            (50,'l'),(40,'xl'),(10,'x'),(9,'ix'),(5,'v'),(4,'iv'),(1,'i')]
    r = ''
    for v, s in vals:
        while num >= v:
            r += s
            num -= v
    return r


class ThesisPDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_margins(L_MARGIN, T_MARGIN, R_MARGIN)
        self.set_auto_page_break(auto=True, margin=B_MARGIN + 10)
        self.chapter_title = ""
        self.show_hf = False
        self.use_roman = True  # True for front matter
        self.roman_offset = 0  # page offset for roman numbering
        self.arabic_offset = 0  # page offset for arabic numbering

    def header(self):
        if not self.show_hf:
            return
        self.set_font('Times', '', 10)
        self.set_y(T_MARGIN - 10)
        self.set_x(L_MARGIN)
        self.cell(CONTENT_W, 5, PROJECT_ID, 0, 0, 'L')
        self.set_x(L_MARGIN)
        self.cell(CONTENT_W, 5, self.chapter_title.upper(), 0, 0, 'R')
        self.ln(6)
        self.line(L_MARGIN, self.get_y(), PAGE_W - R_MARGIN, self.get_y())
        self.ln(5)

    def footer(self):
        if not self.show_hf:
            return
        self.set_y(-B_MARGIN)
        self.line(L_MARGIN, self.get_y(), PAGE_W - R_MARGIN, self.get_y())
        self.ln(2)
        self.set_font('Times', '', 10)
        self.set_x(L_MARGIN)
        self.cell(CONTENT_W, 5, 'Department of Computer Science And Engineering', 0, 0, 'L')
        if self.use_roman:
            pn = to_roman(self.page_no() - self.roman_offset)
        else:
            pn = str(self.page_no() - self.arabic_offset)
        self.set_x(L_MARGIN)
        self.cell(CONTENT_W, 5, pn, 0, 0, 'R')

    # -- Heading helpers --
    def chapter_heading(self, text):
        """Chapter heading: 16pt bold ALL CAPS"""
        self.set_font('Times', 'B', 16)
        self.cell(0, 10, text.upper(), 0, 1, 'L')
        self.ln(LH_DOUBLE)

    def _space_left(self):
        """How much vertical space remains before auto page break."""
        return self.h - self.get_y() - B_MARGIN - 10

    def section_heading(self, num, text):
        """Section heading: 14pt bold ALL CAPS - MORE space before (major topic)"""
        # Need at least heading + 3 body lines (~40mm). If not, start new page.
        if self._space_left() < 40:
            self.add_page()
        else:
            self.ln(14)
        self.set_font('Times', 'B', 14)
        self.cell(0, 9, f'{num}   {text.upper()}', 0, 1, 'L')
        self.ln(6)

    def subsection_heading(self, num, text):
        """Subsection heading: 12pt bold Leading Caps - LESS space (sub topic)"""
        # Need at least heading + 2 body lines (~28mm). If not, start new page.
        if self._space_left() < 28:
            self.add_page()
        else:
            self.ln(5)
        self.set_font('Times', 'B', 12)
        self.cell(0, LH, f'{num}   {text}', 0, 1, 'L')
        self.ln(2)

    def body(self, text):
        """Body text: 12pt normal, 1.5 spacing, justified, no indent, starts from left margin"""
        self.set_x(L_MARGIN)
        self.set_font('Times', '', 12)
        self.multi_cell(CONTENT_W, LH, text, 0, 'J')
        self.ln(6)  # double space between paragraphs (slightly tighter)

    def bullet(self, text, bold_label=""):
        """Indented bullet point - left justified wrapped text"""
        indent = 10
        bullet_w = 5
        text_x = L_MARGIN + indent + bullet_w
        text_w = CONTENT_W - indent - bullet_w
        # Build full text with bold label prefix
        if bold_label:
            full_text = f'{bold_label}: {text}'
        else:
            full_text = text
        # Print bullet dash
        self.set_x(L_MARGIN + indent)
        self.set_font('Times', '', 12)
        self.cell(bullet_w, LH, '-', 0, 0, 'L')
        # Print text with proper left margin for wrapping
        old_l_margin = self.l_margin
        self.set_left_margin(text_x)
        if bold_label:
            self.set_font('Times', 'B', 12)
            label_str = f'{bold_label}: '
            label_w = self.get_string_width(label_str)
            self.cell(label_w, LH, label_str, 0, 0, 'L')
            self.set_font('Times', '', 12)
            self.multi_cell(text_w - label_w, LH, text, 0, 'J')
        else:
            self.set_font('Times', '', 12)
            self.multi_cell(text_w, LH, text, 0, 'J')
        self.set_left_margin(old_l_margin)
        self.ln(2)

    def numbered(self, num, text, bold_label=""):
        """Numbered item - left justified wrapped text"""
        indent = 10
        num_w = 8
        text_x = L_MARGIN + indent + num_w
        text_w = CONTENT_W - indent - num_w
        # Print number
        self.set_x(L_MARGIN + indent)
        self.set_font('Times', 'B', 12)
        self.cell(num_w, LH, f'{num}.', 0, 0, 'L')
        # Print text with proper left margin for wrapping
        old_l_margin = self.l_margin
        self.set_left_margin(text_x)
        if bold_label:
            label_str = f'{bold_label}: '
            label_w = self.get_string_width(label_str)
            self.cell(label_w, LH, label_str, 0, 0, 'L')
            self.set_font('Times', '', 12)
            self.multi_cell(text_w - label_w, LH, text, 0, 'J')
        else:
            self.set_font('Times', '', 12)
            self.multi_cell(text_w, LH, text, 0, 'J')
        self.set_left_margin(old_l_margin)
        self.ln(2)

    def table_heading(self, caption):
        """Table heading at TOP: Table X.Y   Title"""
        # Ensure enough space for table heading + at least a few rows
        if self._space_left() < 50:
            self.add_page()
        self.ln(5)
        self.set_font('Times', 'B', 12)
        self.cell(0, LH, caption, 0, 1, 'C')
        self.ln(3)

    def make_table(self, headers, rows, col_widths=None):
        """Centered table"""
        if not col_widths:
            w = CONTENT_W / len(headers)
            col_widths = [w] * len(headers)
        total_w = sum(col_widths)
        x_start = L_MARGIN + (CONTENT_W - total_w) / 2
        # Header row
        self.set_x(x_start)
        self.set_font('Times', 'B', 10)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 8, h, 1, 0, 'C')
        self.ln()
        # Data rows
        self.set_font('Times', '', 10)
        for row in rows:
            self.set_x(x_start)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell)[:45], 1, 0, 'C')
            self.ln()
        self.ln(LH)

    def fig_caption(self, caption):
        """Figure caption at BOTTOM of figure"""
        # Ensure caption doesn't orphan at top of new page
        if self._space_left() < 20:
            self.add_page()
        self.ln(3)
        self.set_font('Times', 'B', 12)
        self.cell(0, LH, caption, 0, 1, 'C')
        self.set_font('Times', 'I', 10)
        self.cell(0, 6, '[Refer to attached screenshot/diagram]', 0, 1, 'C')
        self.ln(6)

    def chapter_cover_page(self, num, title, subtitles=None):
        """Full page chapter cover - NO header/footer, RIGHT aligned like template"""
        prev_hf = self.show_hf
        self.show_hf = False  # No header/footer on cover pages
        self.add_page()
        self.ln(60)
        # "CHAPTER X" right-aligned, clean text
        ch_text = 'CHAPTER ' + str(num)
        self.set_font('Times', 'B', 14)
        self.cell(0, 10, ch_text, 0, 1, 'R')
        self.ln(3)
        # Chapter title in large bold, right-aligned
        self.set_font('Times', 'B', 24)
        for line in title.upper().split('\n'):
            self.cell(0, 13, line, 0, 1, 'R')
        if subtitles:
            self.ln(15)
            # Bullet points right-aligned
            self.set_font('Times', 'B', 12)
            for s in subtitles:
                self.cell(0, 9, s, 0, 1, 'R')
        self.show_hf = prev_hf  # Restore for next content pages


def build():
    pdf = ThesisPDF()

    # ================================================================
    # COVER PAGE (Page 1 - no numbering)
    # ================================================================
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 8, 'APRIL 2026', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Times', 'I', 14)
    pdf.cell(0, 10, 'PROJECT REPORT', 0, 1, 'C')
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'On', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 22)
    pdf.multi_cell(0, 13, 'AI-Powered Stock Market Analysis\nPlatform', 0, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'Submitted by', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 10, 'ARYA SHAH (IU2241230098)', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'In fulfillment for the award of the degree', 0, 1, 'C')
    pdf.cell(0, 8, 'Of', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'BI', 14)
    pdf.cell(0, 10, 'BACHELOR OF TECHNOLOGY', 0, 1, 'C')
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'In', 0, 1, 'C')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 8, 'COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.ln(15)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 8, 'INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 8, 'INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ', 0, 1, 'C')
    pdf.cell(0, 8, 'AHMEDABAD-382115, GUJARAT, INDIA', 0, 1, 'C')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 8, 'WEB: www.indusuni.ac.in', 0, 1, 'C')

    # ================================================================
    # FIRST PAGE (Page 2 - detailed title, no numbering)
    # ================================================================
    pdf.add_page()
    pdf.ln(3)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 8, 'PROJECT REPORT', 0, 1, 'C')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'ON', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'B', 20)
    pdf.multi_cell(0, 12, 'AI-Powered Stock Market Analysis\nPlatform', 0, 'C')
    pdf.ln(3)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'AT', 0, 1, 'C')
    pdf.ln(5)
    pdf.cell(0, 7, 'In the partial fulfillment of the requirement', 0, 1, 'C')
    pdf.cell(0, 7, 'for the degree of', 0, 1, 'C')
    pdf.cell(0, 7, 'Bachelor of Technology', 0, 1, 'C')
    pdf.cell(0, 7, 'in', 0, 1, 'C')
    pdf.cell(0, 7, 'Computer Science And Engineering', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 8, 'PREPARED BY', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'Arya Shah (IU2241230098)', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 8, 'UNDER GUIDANCE OF', 0, 1, 'C')
    pdf.ln(5)
    hw = CONTENT_W / 2
    pdf.set_font('Times', 'B', 11)
    pdf.cell(hw, 7, 'External Guide', 0, 0, 'C')
    pdf.cell(hw, 7, 'Internal Guide', 0, 1, 'C')
    pdf.set_font('Times', '', 11)
    pairs = [('<Guide name>', 'Prof. Ruchi Patel'), ('(<Company Name>)', 'Assistant Professor,'), ('', 'Dept. of CSE, I.T.E,'), ('', 'Indus University, Ahmedabad')]
    for l, r in pairs:
        pdf.cell(hw, 6, l, 0, 0, 'C')
        pdf.cell(hw, 6, r, 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 7, 'SUBMITTED TO', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 7, 'INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, 'INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ', 0, 1, 'C')
    pdf.cell(0, 7, 'AHMEDABAD-382115, GUJARAT, INDIA', 0, 1, 'C')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'WEB: www.indusuni.ac.in', 0, 1, 'C')
    pdf.cell(0, 7, 'APRIL 2026', 0, 1, 'C')

    # ================================================================
    # From here: FRONT MATTER with Roman numeral pages
    # ================================================================
    pdf.show_hf = True
    pdf.use_roman = True
    pdf.roman_offset = pdf.page_no()  # pages before roman numbering starts
    pdf.chapter_title = ""

    # ================================================================
    # CANDIDATE'S DECLARATION (page i)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Candidate's Declaration"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, "CANDIDATE'S DECLARATION", 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    pdf.set_font('Times', '', 12)
    pdf.write(LH, 'I declare that the final semester report entitled ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, '"AI-Powered Stock Market Analysis Platform"')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, ' is my own work conducted under the supervision of the guide ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, 'Prof. Ruchi Patel')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, '.')
    pdf.ln(LH_DOUBLE)
    pdf.body('I further declare that to the best of my knowledge, the report for B.Tech final semester does not contain part of the work which has been submitted for the award of B.Tech Degree either in this university or any other university without proper citation.')
    pdf.ln(30)
    pdf.line(L_MARGIN, pdf.get_y(), L_MARGIN + 70, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, "Candidate's Signature", 0, 1, 'L')
    pdf.cell(0, 7, 'Arya Shah (IU2241230098)', 0, 1, 'L')
    pdf.ln(35)
    pdf.line(L_MARGIN, pdf.get_y(), L_MARGIN + 70, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 11)
    for line in ['Guide : Prof. Ruchi Patel', 'Assistant Professor', 'Department of Computer Science And Engineering,', 'Indus Institute of Technology and Engineering', 'INDUS UNIVERSITY - Ahmedabad,', 'State: Gujarat']:
        pdf.cell(0, 6, line, 0, 1, 'L')

    # ================================================================
    # COLLEGE CERTIFICATE (page ii)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Certificate"
    pdf.ln(3)
    pdf.set_font('Times', 'B', 14)
    pdf.cell(0, 8, 'INDUS INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 8, 'COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 8, '2025 - 2026', 0, 1, 'C')
    pdf.ln(15)
    pdf.set_font('Times', 'B', 22)
    pdf.cell(0, 12, 'CERTIFICATE', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Date: 13-03-2026', 0, 1, 'R')
    pdf.ln(5)
    pdf.set_font('Times', '', 12)
    pdf.write(LH, 'This is to certify that the project work entitled ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, '"AI-Powered Stock Market Analysis Platform"')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, ' has been carried out by ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, 'Arya Shah')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, ' under my guidance in partial fulfillment of degree of Bachelor of Technology in ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, 'COMPUTER SCIENCE AND ENGINEERING (Final Year)')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, ' of Indus University, Ahmedabad during the academic year 2025-2026.')
    pdf.ln(40)
    cw = CONTENT_W / 3
    pdf.line(L_MARGIN, pdf.get_y(), L_MARGIN + 45, pdf.get_y())
    pdf.line(L_MARGIN + 53, pdf.get_y(), L_MARGIN + 100, pdf.get_y())
    pdf.line(L_MARGIN + 108, pdf.get_y(), L_MARGIN + CONTENT_W, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 9)
    sigs = [
        ('Prof. Ruchi Patel', 'Dr. Kaushal Jani', 'Prof. Zalak Vyas'),
        ('Assistant Professor,', 'Head of Department,', 'Head of Department,'),
        ('Dept. of CSE,', 'Dept. of CSE,', 'Dept. of CSE,'),
        ('IITE, Indus University,', 'IITE, Indus University,', 'IITE, Indus University,'),
        ('Ahmedabad', 'Ahmedabad', 'Ahmedabad'),
    ]
    for row in sigs:
        pdf.cell(cw, 5, row[0], 0, 0, 'L')
        pdf.cell(cw, 5, row[1], 0, 0, 'C')
        pdf.cell(cw, 5, row[2], 0, 1, 'R')

    # ================================================================
    # ACKNOWLEDGEMENT (page iii)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Acknowledgement"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'ACKNOWLEDGEMENT', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    pdf.body('I would like to express my sincere gratitude to my project guide, Prof. Ruchi Patel, Assistant Professor, Department of Computer Science And Engineering, Indus Institute of Technology and Engineering, Indus University, Ahmedabad, for her invaluable guidance, constant encouragement, and constructive criticism throughout the course of this project work.')
    pdf.body('I am deeply thankful to Dr. Kaushal Jani and Prof. Zalak Vyas, Head of Department, Computer Science and Engineering, for providing the necessary infrastructure and support to carry out this project successfully.')
    pdf.body('I extend my heartfelt thanks to the entire faculty of the Department of Computer Science And Engineering for their support and encouragement during the academic year 2025-2026.')
    pdf.body('I am also grateful to the open-source community for providing the frameworks and libraries (React, TensorFlow, FastAPI, Express.js, MongoDB) that made this project possible.')
    pdf.body('Finally, I express my deep gratitude to my family and friends for their unwavering support, patience, and motivation throughout this endeavor.')
    pdf.ln(20)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, LH, 'Arya Shah', 0, 1, 'R')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, LH, 'IU2241230098', 0, 1, 'R')

    # ================================================================
    # ABSTRACT (page iv)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Abstract"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'ABSTRACT', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    pdf.body('The rapid growth of retail participation in global stock markets has created a critical demand for intelligent, accessible, and real-time financial analysis tools. Traditional stock market platforms either provide raw data without actionable insights or charge prohibitive subscription fees for AI-driven analytics, creating a significant accessibility gap for individual investors. This thesis presents the design, development, and deployment of an AI-Powered Stock Market Analysis Platform - a full-stack web application that democratizes financial intelligence through deep learning.')
    pdf.body('Our approach integrates three independent microservices into a cohesive analytical ecosystem. First, a React 18 frontend delivers a responsive, dark-themed user interface featuring real-time market dashboards, interactive price charts built with Recharts, and a simulated paper trading engine that allows users to practice buy/sell strategies without financial risk.')
    pdf.body('Second, a Node.js/Express backend serves as the API gateway and business logic layer. It implements JWT-based authentication with bcrypt password hashing (12 salt rounds), manages user portfolios and watchlists through MongoDB via Mongoose ODM, and provides real-time stock price feeds using Socket.IO WebSocket connections. The backend employs a multi-layered security architecture including Helmet for HTTP header hardening, express-rate-limit for API throttling, and express-validator for input sanitization.')
    pdf.body('Third, a Python FastAPI microservice houses the core artificial intelligence engine. The service deploys a multi-layer Long Short-Term Memory (LSTM) neural network built with TensorFlow/Keras for time-series stock price forecasting. The LSTM architecture comprises three stacked recurrent layers (128, 64, and 32 units) with Dropout regularization (0.2) to prevent overfitting, followed by a Dense output layer. The model is trained on two years of historical market data fetched via the Yahoo Finance API (yfinance), using a sliding window of 60 time steps with MinMaxScaler normalization.')
    pdf.body('Experimental results demonstrate that the LSTM model achieves an R-squared Score of 0.9159 and a MAPE of 1.02% on test data for major market indices, confirming strong predictive capability for short-to-medium term price forecasting. The platform supports real-time WebSocket price updates, AI-powered stock recommendations with confidence scoring, and a comprehensive learning center for financial literacy.')
    pdf.ln(3)
    pdf.set_font('Times', 'B', 12)
    pdf.write(LH, 'Keywords: ')
    pdf.set_font('Times', '', 12)
    pdf.write(LH, 'Stock Market Prediction, LSTM Neural Network, Deep Learning, Full-Stack Web Application, React, Node.js, FastAPI, Time-Series Forecasting, Real-Time Data.')

    # ================================================================
    # TABLE OF CONTENTS (pages v-vi)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Table of Content"
    pdf.ln(5)
    # Stylized heading matching template: "TABLE OF CONTENT" centered, bold, underlined
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 12, 'TABLE OF CONTENT', 0, 1, 'C')
    # Underline
    title_w = pdf.get_string_width('TABLE OF CONTENT')
    ux = L_MARGIN + (CONTENT_W - title_w) / 2
    pdf.line(ux, pdf.get_y(), ux + title_w, pdf.get_y())
    pdf.ln(8)
    # Column headers: "Title" left, "Page No" right (bold)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(CONTENT_W - 20, LH, 'Title', 0, 0, 'L')
    pdf.cell(20, LH, 'Page No', 0, 1, 'R')
    pdf.ln(4)

    # TOC entries - matching template format with dots
    # B = bold (chapter/major heading), R = regular (subsection), I = indented subsub
    toc = [
        ('B', 'ABSTRACT', 'iv'),
        ('B', 'LIST OF FIGURES', 'vi'),
        ('B', 'LIST OF TABLES', 'vii'),
        ('B', 'ABBREVIATIONS', 'viii'),
        ('B', 'CHAPTER 1 INTRODUCTION', '1'),
        ('R', '1.1     Project Summary', '2'),
        ('R', '1.2     Project Purpose', '2'),
        ('R', '1.3     Project Scope', '3'),
        ('R', '1.4     Objectives', '4'),
        ('I', '1.4.1   Main Objectives', '4'),
        ('I', '1.4.2   Secondary Objectives', '5'),
        ('R', '1.5     Technology and Literature Overview', '5'),
        ('R', '1.6     Synopsis', '6'),
        ('B', 'CHAPTER 2 LITERATURE SURVEY', '7'),
        ('R', '2.1     Introduction of Survey', '8'),
        ('R', '2.2     Why Survey?', '8'),
        ('R', '2.3     Evolution of Stock Price Prediction Models', '9'),
        ('R', '2.4     LSTM Networks for Financial Forecasting', '10'),
        ('R', '2.5     Evaluation Metrics', '11'),
        ('R', '2.6     Literature Comparison', '12'),
        ('B', 'CHAPTER 3 PROJECT MANAGEMENT', '13'),
        ('R', '3.1     Project Planning Objectives', '14'),
        ('I', '3.1.1   Software Scope', '14'),
        ('I', '3.1.2   Resource', '14'),
        ('I', '3.1.3   Project Development Approach', '15'),
        ('R', '3.2     Project Scheduling', '15'),
        ('I', '3.2.1   Basic Principles', '15'),
        ('I', '3.2.2   Time Allocation', '16'),
        ('R', '3.3     Risk Management', '17'),
        ('I', '3.3.1   Risk Identification', '17'),
        ('I', '3.3.2   Risk Mitigation', '17'),
        ('B', 'CHAPTER 4 SYSTEM REQUIREMENTS', '18'),
        ('R', '4.1     Introduction', '19'),
        ('R', '4.2     Hardware Specifications', '19'),
        ('R', '4.3     Software Specifications', '20'),
        ('I', '4.3.1   Frontend Stack', '20'),
        ('I', '4.3.2   Backend Stack', '20'),
        ('I', '4.3.3   Machine Learning Stack', '21'),
        ('I', '4.3.4   Database', '21'),
        ('B', 'CHAPTER 5 SYSTEM ANALYSIS', '22'),
        ('R', '5.1     Study of Current System', '23'),
        ('R', '5.2     Problems in Current System', '24'),
        ('R', '5.3     Requirement of New System', '25'),
        ('R', '5.4     Feasibility Study', '27'),
        ('I', '5.4.1   Technical Feasibility', '27'),
        ('I', '5.4.2   Operational Feasibility', '27'),
        ('I', '5.4.3   Economical Feasibility', '28'),
        ('I', '5.4.4   Schedule Feasibility', '28'),
        ('R', '5.5     Features of New System', '28'),
        ('B', 'CHAPTER 6 DETAILED DESCRIPTION', '30'),
        ('R', '6.1     System Architecture and Module Overview', '31'),
        ('R', '6.2     Module Description (Actor-Based Logic)', '32'),
        ('I', '6.2.1   The User Module', '32'),
        ('I', '6.2.2   The Backend API Module', '33'),
        ('I', '6.2.3   The ML Prediction Module', '33'),
        ('R', '6.3     Database Design and Persistence Logic', '34'),
        ('B', 'CHAPTER 7 TESTING', '36'),
        ('R', '7.1     Black-Box Testing', '37'),
        ('I', '7.1.1   LSTM Prediction Accuracy', '37'),
        ('I', '7.1.2   Authentication Testing', '38'),
        ('I', '7.1.3   Paper Trading Testing', '38'),
        ('R', '7.2     White-Box Testing', '39'),
        ('R', '7.3     Test Cases', '40'),
        ('B', 'CHAPTER 8 SYSTEM DESIGN', '41'),
        ('R', '8.1     Class Diagram', '42'),
        ('R', '8.2     Use-Case Diagram', '43'),
        ('R', '8.3     Sequence Diagram', '44'),
        ('R', '8.4     Activity Diagram', '45'),
        ('R', '8.5     Data Flow Diagrams', '46'),
        ('B', 'CHAPTER 9 LIMITATION AND FUTURE ENHANCEMENT', '47'),
        ('R', '9.1     Limitation', '48'),
        ('R', '9.2     Future Enhancement', '49'),
        ('B', 'CHAPTER 10 CONCLUSION', '50'),
        ('R', '10.1    Conclusion', '51'),
        ('B', 'CHAPTER 11 APPENDICES', '53'),
        ('R', '11.1    Business Model', '54'),
        ('R', '11.2    Product Deployment Detail', '54'),
        ('R', '11.3    API and Web Service Details', '56'),
        ('B', 'REFERENCES', '59'),
        ('B', 'EXPERIENCE', '62'),
    ]

    dot_char = '.'
    page_col_w = 20
    for style, title, pg in toc:
        if style == 'B':
            pdf.set_font('Times', 'B', 12)
            indent = 0
        elif style == 'R':
            pdf.set_font('Times', '', 12)
            indent = 10
        else:  # 'I' = sub-subsection
            pdf.set_font('Times', '', 12)
            indent = 25

        pdf.set_x(L_MARGIN + indent)
        title_w = pdf.get_string_width(title)
        avail = CONTENT_W - indent - page_col_w
        # Print title text
        pdf.cell(title_w + 2, 7, title, 0, 0, 'L')
        # Fill remaining space with dots
        remaining = avail - title_w - 2
        if remaining > 5:
            dot_w = pdf.get_string_width(dot_char)
            num_dots = int(remaining / dot_w)
            pdf.set_font('Times', '', 12)
            pdf.cell(remaining, 7, dot_char * num_dots, 0, 0, 'L')
        # Page number right-aligned
        pdf.cell(page_col_w, 7, pg, 0, 1, 'R')

    # ================================================================
    # LIST OF FIGURES (page vi)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "List of Figures"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'LIST OF FIGURES', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    figs = [
        ('Fig 6.1', 'System Architecture Diagram'), ('Fig 7.1', 'AI Prediction Results - Metrics Dashboard'),
        ('Fig 8.1', 'Class Diagram'), ('Fig 8.2', 'Use-Case Diagram'),
        ('Fig 8.3', 'Sequence Diagram'), ('Fig 8.4', 'Activity Diagram'),
        ('Fig 8.5', 'Level 0 DFD (Context Diagram)'), ('Fig 8.6', 'Level 1 DFD (Primary Sub-Systems)'),
        ('Fig 11.1', 'Market Overview Dashboard'), ('Fig 11.2', 'All Stocks Dashboard'),
        ('Fig 11.3', 'Stock Detail Page (AAPL)'), ('Fig 11.4', 'AI Predictions Page'),
        ('Fig 11.5', 'AI Predictions - Metrics and Predicted Prices'),
        ('Fig 11.6', 'Stock Recommendations (Discover Page)'), ('Fig 11.7', 'Transaction History'),
        ('Fig 11.8', 'Watchlist Page'), ('Fig 11.9', 'Login Page'), ('Fig 11.10', 'Learning Center'),
    ]
    pdf.set_font('Times', '', 12)
    for fn, ft in figs:
        pdf.cell(25, LH, fn, 0, 0, 'L')
        pdf.cell(0, LH, ft, 0, 1, 'L')

    # ================================================================
    # LIST OF TABLES (page vii)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "List of Tables"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'LIST OF TABLES', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    tables = [
        ('Table 2.1', 'Literature Survey Comparison'), ('Table 3.1', 'Project Timeline Chart'),
        ('Table 5.1', 'Platform Feature Comparison'), ('Table 5.2', 'ML Methodology Comparison'),
        ('Table 7.1', 'LSTM Model Evaluation Metrics'), ('Table 7.2', 'Comprehensive Test Cases'),
        ('Table 11.1', 'Backend REST API Endpoints'), ('Table 11.2', 'ML Service API Endpoints'),
        ('Table 11.3', 'LSTM Model Architecture Summary'),
    ]
    pdf.set_font('Times', '', 12)
    for tn, tt in tables:
        pdf.cell(25, LH, tn, 0, 0, 'L')
        pdf.cell(0, LH, tt, 0, 1, 'L')

    # ================================================================
    # ABBREVIATIONS (page viii)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Abbreviations"
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'ABBREVIATIONS', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    abbrs = [
        ('AI', 'Artificial Intelligence'), ('API', 'Application Programming Interface'),
        ('ARIMA', 'AutoRegressive Integrated Moving Average'),
        ('CORS', 'Cross-Origin Resource Sharing'), ('CRUD', 'Create, Read, Update, Delete'),
        ('DFD', 'Data Flow Diagram'), ('DOM', 'Document Object Model'),
        ('GARCH', 'Generalized Autoregressive Conditional Heteroskedasticity'),
        ('HTTP', 'HyperText Transfer Protocol'), ('JSON', 'JavaScript Object Notation'),
        ('JWT', 'JSON Web Token'), ('LSTM', 'Long Short-Term Memory'),
        ('MAE', 'Mean Absolute Error'), ('MAPE', 'Mean Absolute Percentage Error'),
        ('ML', 'Machine Learning'), ('NoSQL', 'Not Only Structured Query Language'),
        ('ODM', 'Object Document Mapper'), ('OHLCV', 'Open, High, Low, Close, Volume'),
        ('REST', 'Representational State Transfer'), ('RMSE', 'Root Mean Squared Error'),
        ('SPA', 'Single Page Application'), ('TTL', 'Time To Live'),
        ('UI/UX', 'User Interface / User Experience'),
    ]
    for a, f in abbrs:
        pdf.set_font('Times', 'B', 12)
        pdf.cell(25, LH, a, 0, 0, 'L')
        pdf.set_font('Times', '', 12)
        pdf.cell(0, LH, f, 0, 1, 'L')

    # ================================================================
    # CHAPTERS START - Switch to Arabic numbering
    # ================================================================
    pdf.use_roman = False
    pdf.arabic_offset = pdf.page_no()  # pages before arabic starts

    # ================================================================
    # CHAPTER 1: INTRODUCTION
    # ================================================================
    pdf.chapter_cover_page('1', 'Introduction', ['- AI-POWERED STOCK MARKET', '  ANALYSIS PLATFORM'])
    pdf.chapter_title = "Introduction"
    pdf.add_page()

    pdf.section_heading('1.1', 'Project Summary')
    pdf.body('This project develops an AI-Powered Stock Market Analysis Platform - a comprehensive full-stack web application that combines real-time market data visualization, deep learning-based price forecasting, and simulated paper trading into a single, unified platform. The system employs a microservices architecture consisting of a React 18 frontend for interactive data presentation, a Node.js/Express backend for API orchestration and user management via MongoDB, and a Python FastAPI service that deploys a multi-layer LSTM (Long Short-Term Memory) neural network for stock price prediction.')
    pdf.body('The platform, branded as "StockAI," provides retail investors with institutional-grade analytical capabilities including real-time WebSocket price feeds, AI-powered stock recommendations with confidence scoring, interactive historical price charts with multiple time intervals (1W, 1M, 3M, 6M, 1Y), and comprehensive model evaluation metrics (RMSE, MAE, R-squared Score, MAPE). The system supports paper trading simulation with complete transaction history, portfolio profit/loss tracking, and personalized stock watchlists for up to 50 symbols per user.')

    pdf.section_heading('1.2', 'Project Purpose')
    pdf.body('The purpose of this project is to bridge the gap between institutional-grade financial analytics and retail investors. Traditional stock analysis tools present raw numerical data - price, volume, and percentage changes - without actionable predictive insights. Advanced platforms that incorporate AI-driven forecasting, such as Bloomberg Terminal or Refinitiv Eikon, carry annual subscription costs exceeding $20,000, rendering them inaccessible to individual investors and students.')
    pdf.body('The global retail trading market has witnessed unprecedented growth, with retail investors now accounting for over 25% of daily trading volume on major US exchanges. Despite this significant market participation, these investors remain systematically disadvantaged in their access to predictive financial intelligence.')
    pdf.body('By developing an open-source, web-based platform that integrates LSTM neural networks for time-series forecasting directly into a user-friendly dashboard, this project democratizes financial intelligence. The system enables users to monitor real-time market data, generate AI-powered predictions, view model confidence metrics, practice trading strategies through a paper trading simulator, and build personalized watchlists - all within a single browser-based interface.')

    pdf.section_heading('1.3', 'Project Scope')
    pdf.body('The scope of this project encompasses the complete design, development, testing, and deployment of a three-tier web application with integrated machine learning capabilities:')
    pdf.bullet('Development of a responsive, dark-themed React 18 single-page application (SPA) with over 10 interactive views including Dashboard, Stock Detail, AI Predictions, Watchlist, Discover (Recommendations), Trading History, News, and Learning Center.', 'Frontend Application')
    pdf.bullet('Implementation of a RESTful API server using Node.js/Express with MongoDB persistence for user accounts, watchlists, stock data caching, and trade history. The backend implements JWT-based authentication, rate limiting, CORS configuration, and WebSocket real-time data streaming.', 'Backend API Layer')
    pdf.bullet('Deployment of a Python FastAPI microservice hosting a TensorFlow/Keras LSTM model trained on Yahoo Finance historical data with endpoints for on-demand stock price prediction with configurable horizons (1-365 days).', 'Machine Learning Service')
    pdf.bullet('Integration with Yahoo Finance (yfinance) for fetching two years of historical OHLCV data, with MinMaxScaler normalization and a sliding window of 60 time steps for sequence generation.', 'Data Pipeline')
    pdf.bullet('A simulated trading system that allows authenticated users to execute buy/sell transactions, track portfolio performance (Total Trades, Total Bought, Total Sold, Net P&L), and review complete transaction history.', 'Paper Trading Engine')

    pdf.section_heading('1.4', 'Objectives')
    pdf.subsection_heading('1.4.1', 'Main Objectives')
    pdf.bullet('To design and develop a full-stack web platform that provides real-time stock market data visualization with interactive charting capabilities across multiple time intervals (1W, 1M, 3M, 6M, 1Y).')
    pdf.bullet('To implement and deploy a deep learning LSTM neural network capable of generating accurate short-to-medium term stock price forecasts with quantifiable confidence metrics.')
    pdf.bullet('To build a secure, scalable microservices architecture that cleanly separates the presentation layer (React), business logic (Node.js/Express), and AI inference engine (Python/FastAPI).')

    pdf.subsection_heading('1.4.2', 'Secondary Objectives')
    pdf.bullet('To develop a paper trading simulator enabling users to practice investment strategies without financial risk.')
    pdf.bullet('To implement an AI-powered stock recommendation engine with confidence percentages and actionable labels.')
    pdf.bullet('To create a comprehensive Learning Center for platform usage and stock market fundamentals.')
    pdf.bullet('To ensure platform security through JWT authentication, bcrypt password hashing, rate limiting, and HTTP header hardening.')

    pdf.section_heading('1.5', 'Technology and Literature Overview')
    pdf.body('This project leverages several key technologies across its three-tier architecture:')
    pdf.bullet('TensorFlow/Keras LSTM networks for modeling sequential dependencies in time-series financial data.', 'Deep Learning')
    pdf.bullet('React 18 with React Router v6 for component-based, single-page application architecture.', 'Frontend Framework')
    pdf.bullet('Recharts library for interactive, responsive charting for stock price and prediction visualization.', 'Data Visualization')
    pdf.bullet('Socket.IO WebSocket protocol for live stock price updates without polling overhead.', 'Real-Time Communication')
    pdf.bullet('MongoDB with Mongoose ODM for flexible, schema-based document storage.', 'Database')
    pdf.bullet('Yahoo Finance API (via yfinance) for free, reliable historical and real-time market data.', 'Data Source')
    pdf.bullet('FastAPI with Uvicorn for high-performance async ML inference API.', 'ML Service Framework')

    pdf.section_heading('1.6', 'Synopsis')
    pdf.body('In summary, this thesis presents a comprehensive approach to stock market analysis that combines real-time data visualization with deep learning-based price forecasting. By integrating an LSTM neural network into a modern web application with paper trading capabilities, we demonstrate a platform that empowers retail investors with institutional-grade analytical tools. The system achieves an R-squared Score of 0.9159 and MAPE of 1.02%, confirming the viability of LSTM networks for short-term stock price prediction when deployed within a production-ready web architecture.')

    # ================================================================
    # CHAPTER 2: LITERATURE SURVEY
    # ================================================================
    pdf.chapter_cover_page('2', 'Literature Survey')
    pdf.chapter_title = "Literature Survey"
    pdf.add_page()

    pdf.section_heading('2.1', 'Introduction to Survey')
    pdf.body('The goal of this survey is to bridge the gap between academic research in financial time-series forecasting and the practical engineering required to deploy such models within production web applications. While extensive research exists on the theoretical performance of various machine learning models for stock prediction, significantly less attention has been paid to the end-to-end integration of these models into user-facing platforms that provide actionable insights alongside raw predictions.')

    pdf.section_heading('2.2', 'Why Survey?')
    pdf.body('The survey serves three primary purposes:')
    pdf.bullet('Understanding why LSTM networks outperform traditional statistical models (ARIMA, GARCH) and classical ML approaches (SVM, Random Forest) for stock price time-series forecasting.', 'Algorithm Selection')
    pdf.bullet('Justifying the selection of a three-tier microservices architecture (React + Express + FastAPI) over monolithic alternatives.', 'Architecture Validation')
    pdf.bullet('Analyzing how existing platforms handle data normalization, sequence generation, and prediction horizon configuration.', 'Feature Engineering Baseline')

    pdf.section_heading('2.3', 'Evolution of Stock Price Prediction Models')
    pdf.subsection_heading('2.3.1', 'Statistical Models (First Generation)')
    pdf.body('Traditional approaches such as ARIMA (AutoRegressive Integrated Moving Average) and GARCH (Generalized Autoregressive Conditional Heteroskedasticity) have been the foundation of financial time-series analysis. However, research by Selvin et al. (2017) demonstrates that these linear models fail to capture the non-linear, non-stationary dynamics inherent in stock market data.')

    pdf.subsection_heading('2.3.2', 'Classical Machine Learning (Second Generation)')
    pdf.body('Models such as Support Vector Machines (SVM) and Random Forest have shown improvement over statistical methods. However, they treat each data point independently and cannot natively model the sequential dependencies that characterize financial time-series data.')

    pdf.subsection_heading('2.3.3', 'Deep Learning (Third Generation)')
    pdf.body('The introduction of LSTM networks by Hochreiter and Schmidhuber (1997) revolutionized sequence modeling. LSTMs address the vanishing gradient problem through their gating mechanisms (input, forget, output gates), enabling them to learn long-term dependencies in price sequences.')

    pdf.section_heading('2.4', 'LSTM Networks for Financial Forecasting')
    pdf.body('Long Short-Term Memory networks have become the dominant architecture for stock price prediction in recent literature. The LSTM cell maintains a cell state that acts as an information highway, allowing gradients to flow unchanged through time. Three gating mechanisms control information flow: the forget gate decides what information to discard from the cell state, the input gate decides which new information to store, and the output gate determines the next hidden state based on the filtered cell state.')
    pdf.body('Research by Fischer and Krauss (2018) conducted a comprehensive benchmark study comparing LSTM networks against Random Forest, Logistic Regression, and standard feedforward neural networks. Their results demonstrated that LSTM networks consistently outperform all alternatives across S&P 500 constituents, achieving directional accuracy rates exceeding 55% - a statistically significant margin in efficient markets where random walk theory predicts 50% accuracy.')
    pdf.body('Studies by Moghar and Hamiche (2020) validate the use of multiple stacked LSTM layers with decreasing unit counts (128 to 64 to 32) and Dropout regularization (0.1-0.3) to improve generalization and prevent overfitting on volatile financial data. The decreasing unit pattern creates a funnel architecture that progressively compresses learned representations, forcing the network to extract increasingly abstract temporal features at each layer.')
    pdf.body('Bao, Yue, and Rao (2017) demonstrated that combining stacked autoencoders with LSTM using only price data achieved R-squared scores above 0.90 for major market indices. This finding is particularly significant for our project as it validates the single-feature (Close Price) approach for achieving competitive prediction accuracy while maintaining computational efficiency suitable for real-time web deployment.')

    pdf.section_heading('2.5', 'Evaluation Metrics')
    pdf.bullet('Root Mean Squared Error and Mean Absolute Error quantify prediction error magnitude.', 'RMSE and MAE')
    pdf.bullet('The coefficient of determination measures proportion of variance explained by predictions.', 'R-squared Score')
    pdf.bullet('Mean Absolute Percentage Error provides scale-independent accuracy measurement. Below 2% is excellent.', 'MAPE')

    pdf.section_heading('2.6', 'Literature Comparison')
    pdf.table_heading('Table 2.1   Literature Survey Comparison')
    pdf.make_table(
        ['Study', 'Model', 'Features', 'Best Result', 'Web Integration'],
        [
            ['Selvin (2017)', 'CNN-LSTM', 'Close', 'Low RMSE', 'No'],
            ['Fischer (2018)', 'LSTM', 'Multiple', '>55% dir.', 'No'],
            ['Bao (2017)', 'SAE+LSTM', 'Close', 'R2>0.90', 'No'],
            ['Moghar (2020)', 'Stacked LSTM', 'Close', 'Low MAE', 'No'],
            ['Proposed', '3-Layer LSTM', 'Close', 'R2=0.92', 'Yes (Full-Stack)'],
        ],
        [30, 30, 22, 28, 35]
    )

    # ================================================================
    # CHAPTER 3: PROJECT MANAGEMENT
    # ================================================================
    pdf.chapter_cover_page('3', 'Project Management', ['3.1  Project Planning Objectives', '3.2  Project Scheduling', '3.3  Risk Management'])
    pdf.chapter_title = "Project Management"
    pdf.add_page()

    pdf.section_heading('3.1', 'Project Planning Objectives')
    pdf.body('The primary objective of the planning phase was to coordinate the parallel development of three independent microservices while ensuring seamless API contract compliance between them.')

    pdf.subsection_heading('3.1.1', 'Software Scope')
    pdf.numbered(1, 'A React 18 SPA with 10+ interactive views, Recharts visualization, Axios with JWT interceptors, and Socket.IO real-time streaming.', 'Frontend Application')
    pdf.numbered(2, 'A Node.js/Express server with RESTful endpoints for authentication, stock data, watchlists, paper trading, and ML service proxying.', 'API Gateway')
    pdf.numbered(3, 'A Python FastAPI service hosting a TensorFlow/Keras LSTM model with prediction, training, and history endpoints.', 'AI Prediction Engine')
    pdf.numbered(4, 'MongoDB database with Mongoose ODM schemas for Users, Stocks, and Watchlists.', 'Data Persistence Layer')

    pdf.subsection_heading('3.1.2', 'Resources')
    pdf.bullet('Single final-year B.Tech CSE student responsible for all aspects of design, development, testing, and documentation.', 'Human Resource')
    pdf.bullet('Open-source libraries: React, Express.js, TensorFlow/Keras, FastAPI, Mongoose, Recharts, Socket.IO, yfinance.', 'Reusable Software Resources')
    pdf.bullet('Local development environment with Node.js v18+, Python 3.10+, MongoDB Community Server.', 'Environment Resource')

    pdf.subsection_heading('3.1.3', 'Project Development Approach')
    pdf.body('An Agile Methodology was adopted with two-week sprint cycles, allowing iterative development and testing of individual microservices. This approach was essential because the LSTM model hyperparameters required multiple tuning iterations to achieve optimal prediction accuracy.')

    pdf.section_heading('3.2', 'Project Scheduling')
    pdf.subsection_heading('3.2.1', 'Basic Principles')
    pdf.bullet('Developing the LSTM model while simultaneously building Express API routes and React components.', 'Parallelism')
    pdf.bullet('Defining REST API contracts before implementation, enabling independent development.', 'API-First Design')
    pdf.bullet('A 2-week contingency buffer at the end for integration issues.', 'Buffer Allocation')

    pdf.subsection_heading('3.2.2', 'Time Allocation')
    pdf.table_heading('Table 3.1   Project Timeline Chart')
    pdf.make_table(
        ['Phase', 'Milestone', 'Duration', 'Key Deliverable'],
        [
            ['I', 'Requirements & Architecture', 'Weeks 1-2', 'API Contracts & DB Schemas'],
            ['II', 'Backend API & Authentication', 'Weeks 3-5', 'REST API with JWT Auth'],
            ['III', 'LSTM Model Development', 'Weeks 6-8', 'Trained Model (R2>0.90)'],
            ['IV', 'Frontend Development', 'Weeks 9-11', 'React SPA (10+ views)'],
            ['V', 'Integration & Tuning', 'Weeks 12-14', 'Full-Stack Platform'],
            ['VI', 'Evaluation & Documentation', 'Weeks 15-16', 'Thesis and Demo'],
        ],
        [15, 52, 25, 52]
    )

    pdf.section_heading('3.3', 'Risk Management')
    pdf.subsection_heading('3.3.1', 'Risk Identification')
    pdf.bullet('LSTM model might overfit on historical data and fail to generalize.', 'Model Accuracy Risk')
    pdf.bullet('Yahoo Finance API rate limits or outages could disrupt the data pipeline.', 'Data Source Dependency')
    pdf.bullet('WebSocket connections might introduce latency under high concurrency.', 'Real-Time Performance')

    pdf.subsection_heading('3.3.2', 'Risk Mitigation')
    pdf.bullet('Backend implements mock data fallback when ML service is unavailable.', 'Graceful Degradation')
    pdf.bullet('LSTM training uses Early Stopping (patience=10) to prevent overfitting.', 'Early Stopping')
    pdf.bullet('Trained models are cached in memory and on disk (.keras format).', 'Model Caching')

    # ================================================================
    # CHAPTER 4: SYSTEM REQUIREMENTS
    # ================================================================
    pdf.chapter_cover_page('4', 'System Requirements', ['4.1  Introduction', '4.2  Hardware Specifications', '4.3  Software Specifications'])
    pdf.chapter_title = "System Requirements"
    pdf.add_page()

    pdf.section_heading('4.1', 'Introduction')
    pdf.body('The system requirements are categorized into Hardware and Software specifications. The primary challenge was selecting a technology stack capable of handling LSTM neural network training, real-time WebSocket data streaming, and concurrent database operations while maintaining responsive frontend performance.')

    pdf.section_heading('4.2', 'Hardware Specifications')
    pdf.subsection_heading('4.2.1', 'Development Workstation')
    pdf.bullet('Apple M-series or Intel Core i5/i7 (multi-core for parallel service execution).', 'Processor')
    pdf.bullet('8 GB RAM minimum (16 GB recommended for concurrent LSTM training).', 'Memory')
    pdf.bullet('256 GB SSD for fast MongoDB I/O and model file storage.', 'Storage')
    pdf.bullet('Broadband internet for Yahoo Finance data fetching.', 'Network')

    pdf.section_heading('4.3', 'Software Specifications')
    pdf.subsection_heading('4.3.1', 'Frontend Stack')
    pdf.bullet('React 18.2.0, React Router v6, Recharts 2.10.3, Axios 1.6.2, Socket.IO Client 4.7.2, React Toastify, date-fns 2.30.0, React Icons')
    pdf.subsection_heading('4.3.2', 'Backend Stack')
    pdf.bullet('Express.js 4.18.2, Mongoose 7.6.3, jsonwebtoken 9.0.2, bcryptjs, Socket.IO 4.7.2, Helmet 7.1.0, express-rate-limit 7.1.4, express-validator 7.0.1, node-cache 5.1.2, Nodemailer 6.9.7')
    pdf.subsection_heading('4.3.3', 'Machine Learning Stack')
    pdf.bullet('FastAPI 0.104.1, Uvicorn 0.24.0, TensorFlow 2.18.0+, scikit-learn 1.6.0+, pandas 2.2.3+, numpy 2.1.0+, yfinance 0.2.33+, joblib 1.3.2, pydantic 2.10.0+')
    pdf.subsection_heading('4.3.4', 'Database')
    pdf.bullet('MongoDB (document-oriented NoSQL) with Mongoose ODM for schema validation, type casting, and middleware hooks. Three primary collections: Users, Stocks, Watchlists.', 'MongoDB')

    # ================================================================
    # CHAPTER 5: SYSTEM ANALYSIS
    # ================================================================
    pdf.chapter_cover_page('5', 'System Analysis', ['5.1  Study of Current System', '5.2  Problems in Current System', '5.3  Requirement of New System', '5.4  Feasibility Study', '5.5  Features of New System'])
    pdf.chapter_title = "System Analysis"
    pdf.add_page()

    pdf.section_heading('5.1', 'Study of Current System')
    pdf.body('The current paradigm of stock market analysis for retail investors is built upon platforms that serve primarily as data aggregators rather than intelligent analytical tools. These platforms can be categorized into three distinct tiers based on their capabilities and cost structures.')
    pdf.body('The first tier consists of free consumer-grade applications such as Yahoo Finance, Google Finance, and the basic version of TradingView. These platforms provide real-time stock quotes, basic historical price charts, and curated financial news feeds. However, they treat users as passive data consumers, presenting raw numerical data (price, volume, percentage change) without any predictive intelligence or actionable insights. Users must independently interpret this data and make trading decisions based on their own analysis.')
    pdf.body('The second tier comprises premium institutional platforms such as Bloomberg Terminal ($24,000/year), Refinitiv Eikon ($22,000/year), and FactSet ($12,000/year). These platforms provide AI-driven analytics, quantitative models, algorithmic trading capabilities, and predictive algorithms. However, they are designed exclusively for professional traders, hedge funds, and institutional investors with deep technical expertise and significant financial resources.')
    pdf.body('The third tier includes a small number of prosumer platforms (TradingView Pro, Seeking Alpha Premium) that offer limited predictive features for $15-50/month. However, these typically rely on rule-based technical analysis rather than machine learning, and they do not provide transparent model evaluation metrics that would allow users to assess prediction reliability.')

    pdf.section_heading('5.2', 'Problems in Current System')
    pdf.numbered(1, 'AI-powered stock prediction models exist in academic research but are rarely integrated into user-friendly web applications.', 'Prediction Accessibility Gap')
    pdf.numbered(2, 'Current free platforms require users to switch between multiple tools for quotes, charting, news, and portfolio tracking.', 'Fragmented User Experience')
    pdf.numbered(3, 'Platforms that offer AI predictions rarely expose model metrics (RMSE, MAE, R-squared, MAPE).', 'Transparency Deficit')
    pdf.numbered(4, 'New investors have no way to practice trading strategies without risking actual capital.', 'No Risk-Free Practice')

    pdf.section_heading('5.3', 'Requirement of New System')
    pdf.bullet('All functionality accessible through a single web interface.', 'Unified Platform')
    pdf.bullet('Every prediction accompanied by comprehensive evaluation metrics and confidence score.', 'Transparent Model Metrics')
    pdf.bullet('Simulated trading engine with realistic buy/sell mechanics and P&L calculation.', 'Paper Trading Integration')

    pdf.table_heading('Table 5.1   Platform Feature Comparison')
    pdf.make_table(
        ['Platform', 'Cost', 'AI Predictions', 'Transparency', 'Paper Trading'],
        [
            ['Bloomberg', '$24,000/yr', 'Yes', 'Low', 'No'],
            ['Yahoo Finance', 'Free', 'No', 'N/A', 'No'],
            ['TradingView', 'Freemium', 'Limited', 'Low', 'Yes (limited)'],
            ['StockAI (Ours)', 'Free', 'Yes (LSTM)', 'High (metrics)', 'Yes (full)'],
        ],
        [35, 25, 30, 30, 30]
    )

    pdf.table_heading('Table 5.2   ML Methodology Comparison')
    pdf.make_table(
        ['Methodology', 'Model Type', 'Training Data', 'Inference Speed'],
        [
            ['ARIMA', 'Statistical', 'Limited', 'Instant'],
            ['Random Forest', 'Ensemble', 'Tabular', 'Fast'],
            ['LSTM (Ours)', 'Deep Learning', 'Time-series', 'Medium (cached)'],
        ],
        [40, 35, 38, 38]
    )

    pdf.section_heading('5.4', 'Feasibility Study')
    pdf.subsection_heading('5.4.1', 'Technical Feasibility')
    pdf.body('The project is technically feasible because TensorFlow/Keras provides a mature framework for LSTM construction. Yahoo Finance data via yfinance eliminates expensive data subscriptions. React 18 and Express.js are industry-standard frameworks.')
    pdf.subsection_heading('5.4.2', 'Operational Feasibility')
    pdf.body('The system requires minimal configuration once deployed. The ML service automatically trains and caches models. The backend gracefully falls back to mock data when services are unavailable.')
    pdf.subsection_heading('5.4.3', 'Economical Feasibility')
    pdf.body('Built entirely on open-source technologies with zero licensing costs. Only operational costs are server hosting, minimizable through free-tier cloud services.')
    pdf.subsection_heading('5.4.4', 'Schedule Feasibility')
    pdf.body('The 16-week timeline was completed in distinct phases (Backend, ML, Frontend, Integration), with all milestones met before thesis submission.')

    pdf.section_heading('5.5', 'Features of New System')
    pdf.bullet('Live market indices (S&P 500, NASDAQ, Dow Jones) with auto-refreshing quotes and Top Gainers/Losers panels.', 'Real-Time Market Dashboard')
    pdf.bullet('LSTM predictions with configurable horizons, Actual vs. Predicted charts, and comprehensive model metrics.', 'AI-Powered Predictions')
    pdf.bullet('Simulated buy/sell execution with portfolio tracking and complete transaction history.', 'Paper Trading Simulator')
    pdf.bullet('Track up to 50 stocks with real-time price updates and change indicators.', 'Personalized Watchlist')
    pdf.bullet('Categorized recommendations with confidence percentages and Strong Buy/Buy/Hold labels.', 'AI Stock Recommendations')
    pdf.bullet('Recharts-powered price charts with 1W, 1M, 3M, 6M, 1Y intervals.', 'Interactive Charting')
    pdf.bullet('Searchable educational content for platform usage and market fundamentals.', 'Learning Center')

    # ================================================================
    # CHAPTER 6: DETAILED DESCRIPTION
    # ================================================================
    pdf.chapter_cover_page('6', 'Detailed Description', ['6.1  System Architecture', '6.2  Module Description', '6.3  Database Design'])
    pdf.chapter_title = "Detailed Description"
    pdf.add_page()

    pdf.section_heading('6.1', 'System Architecture and Module Overview')
    pdf.body('The architecture operates through a four-stage data pipeline:')
    pdf.numbered(1, 'The Node.js backend fetches real-time and historical stock data from Yahoo Finance. Stock quotes are cached in-memory using node-cache with a 60-second TTL to minimize redundant API calls.', 'Data Ingestion and Caching')
    pdf.numbered(2, 'When a user requests a prediction, the backend proxies to the Python FastAPI ML service. The service loads the pre-trained LSTM model, generates predictions using autoregressive forecasting, and returns predictions with evaluation metrics.', 'AI Inference (LSTM)')
    pdf.numbered(3, 'The Socket.IO WebSocket layer maintains persistent connections between backend and frontend. Price updates are broadcast to per-symbol subscription rooms.', 'Real-Time Communication')
    pdf.numbered(4, 'User actions (registration, login, watchlist, trades) are processed through JWT-authenticated endpoints and persisted to MongoDB.', 'User Interaction and Persistence')
    pdf.fig_caption('Fig 6.1   System Architecture Diagram')

    pdf.section_heading('6.2', 'Module Description')
    pdf.subsection_heading('6.2.1', 'The User Module')
    pdf.bullet('Access Dashboard with real-time market indices, All Stocks table, Top Gainers/Losers.', 'Market Monitoring')
    pdf.bullet('Select stock symbol, trigger LSTM prediction, view Actual vs. Predicted chart with metrics.', 'AI Prediction Request')
    pdf.bullet('Execute simulated Buy/Sell trades with quantity, view transaction history with P&L.', 'Paper Trading')
    pdf.bullet('Add/remove stocks to personalized watchlist (max 50 symbols).', 'Watchlist Management')

    pdf.subsection_heading('6.2.2', 'The Backend API Module')
    pdf.bullet('Express API handles auth verification, input validation, rate limiting, ML service proxying.', 'API Gateway')
    pdf.bullet('node-cache with 60-second TTL reduces external API calls.', 'Data Caching')
    pdf.bullet('Socket.IO manages per-symbol rooms for targeted price broadcasts.', 'WebSocket Management')
    pdf.bullet('Seamless switch to mock data when external services unavailable.', 'Mock Data Fallback')

    pdf.subsection_heading('6.2.3', 'The ML Prediction Module')
    pdf.bullet('Three-layer stacked LSTM (128, 64, 32 units) with Dropout(0.2), Dense(16, ReLU), Dense(1). Compiled with Adam(lr=0.001) and MSE loss.', 'LSTM Architecture')
    pdf.bullet('Close prices normalized to [0,1] via MinMaxScaler. 60-step sliding window with 80/20 temporal split.', 'Data Preprocessing')
    pdf.bullet('Each predicted day becomes input for next prediction. Business day awareness for date generation.', 'Autoregressive Prediction')
    pdf.bullet('RMSE, MAE, R-squared, MAPE calculated on test set. AI Confidence derived from R-squared.', 'Model Metrics')

    pdf.section_heading('6.3', 'Database Design')
    pdf.subsection_heading('6.3.1', 'Users Collection')
    pdf.body('Fields: _id (ObjectId), name (String, max 100), email (String, unique, validated), password (String, bcrypt-hashed, 12 salt rounds), isVerified (Boolean), role (Enum: user/admin), createdAt (Date).')

    pdf.subsection_heading('6.3.2', 'Stocks Collection')
    pdf.body('Fields: symbol (String, uppercase, indexed), name (String), price/change/changePercent (Number), volume/high/low/open/previousClose (Number), marketCap (Number), historicalData (Array of OHLCV objects), lastUpdated (Date, auto-updated).')

    pdf.subsection_heading('6.3.3', 'Watchlists Collection')
    pdf.body('Fields: user (ObjectId, ref: User, unique), stocks (Array of {symbol, addedAt}, max 50), createdAt (Date).')

    pdf.subsection_heading('6.3.4', 'Data Integrity Mechanisms')
    pdf.body('The Mongoose ODM provides several critical data integrity mechanisms that protect against data corruption and unauthorized access:')
    pdf.bullet('All fields are type-checked and validated before insertion. Email fields use regex validation, password fields enforce minimum length requirements, and enum fields restrict values to predefined sets (e.g., role can only be "user" or "admin").', 'Schema Validation')
    pdf.bullet('Email uniqueness is enforced at the database level through a unique index, preventing duplicate account creation even under concurrent registration attempts.', 'Unique Constraints')
    pdf.bullet('The User schema includes a pre-save middleware that automatically hashes passwords using bcrypt before persisting to the database. This ensures passwords are never stored in plaintext, providing defense-in-depth security.', 'Pre-Save Hooks')
    pdf.bullet('Watchlist documents reference User documents via ObjectId, ensuring that watchlist operations are always scoped to authenticated users. Mongoose population enables efficient JOIN-like queries across collections when needed.', 'Referential Integrity')

    # ================================================================
    # CHAPTER 7: TESTING
    # ================================================================
    pdf.chapter_cover_page('7', 'Testing', ['7.1  Black-Box Testing', '7.2  White-Box Testing', '7.3  Test Cases'])
    pdf.chapter_title = "Testing"
    pdf.add_page()

    pdf.section_heading('7.1', 'Black-Box Testing')
    pdf.subsection_heading('7.1.1', 'LSTM Prediction Accuracy')
    pdf.body('To evaluate the LSTM prediction model, we treated the FastAPI prediction endpoint as a black box. Input: POST /api/predict with symbol "GOOGL" and days=30. Expected Output: Array of 30 predicted prices with model evaluation metrics.')

    pdf.table_heading('Table 7.1   LSTM Model Evaluation Metrics')
    pdf.make_table(
        ['Metric', 'Value', 'Interpretation'],
        [
            ['RMSE', '4.1308', 'Low average prediction error'],
            ['MAE', '1.1950', 'Average $1.19 deviation'],
            ['R-squared', '0.9159', '91.6% variance explained'],
            ['MAPE', '1.02%', 'Excellent accuracy (<2%)'],
            ['AI Confidence', '92%', 'High model reliability'],
        ],
        [40, 40, 70]
    )
    pdf.fig_caption('Fig 7.1   AI Prediction Results - Metrics Dashboard')

    pdf.subsection_heading('7.1.2', 'Authentication Testing')
    pdf.body('The JWT middleware correctly rejected unauthorized requests (HTTP 401). Authenticated requests with valid tokens returned expected data. Expired tokens were properly rejected.')

    pdf.subsection_heading('7.1.3', 'Paper Trading Testing')
    pdf.body('The paper trading engine correctly calculated all trade totals, maintained accurate running balances, and recorded precise timestamps for each transaction.')

    pdf.section_heading('7.2', 'White-Box Testing')
    pdf.subsection_heading('7.2.1', 'LSTM Data Pipeline Testing')
    pdf.body('Validation checks inserted at each pipeline stage: after yfinance fetching (non-null data), after MinMaxScaler normalization (values in [0,1]), after sequence generation (60 time steps each). Confirmed temporal ordering preserved in train/test split.')

    pdf.subsection_heading('7.2.2', 'Security Testing')
    pdf.body('Verified JWT tokens cannot be forged, passwords are bcrypt-hashed before storage, rate limiter blocks after 100 requests/15 minutes (HTTP 429).')

    pdf.section_heading('7.3', 'Test Cases')
    pdf.table_heading('Table 7.2   Comprehensive Test Cases')
    pdf.make_table(
        ['TC ID', 'Feature', 'Action/Input', 'Expected', 'Result'],
        [
            ['TC-01', 'LSTM Prediction', 'POST /predict GOOGL', 'R2=0.92, 30 prices', 'PASS'],
            ['TC-02', 'Registration', 'POST /auth/register', 'JWT token', 'PASS'],
            ['TC-03', 'JWT Auth', 'GET /watchlist+token', 'Watchlist data', 'PASS'],
            ['TC-04', 'No Auth', 'GET /watchlist (no tok)', 'HTTP 401', 'PASS'],
            ['TC-05', 'Paper BUY', 'BUY 2 AAPL', 'Balance updated', 'PASS'],
            ['TC-06', 'Paper SELL', 'SELL 2 AAPL', 'Balance increased', 'PASS'],
            ['TC-07', 'WebSocket', 'Subscribe AAPL', 'Updates <1s', 'PASS'],
            ['TC-08', 'Cache Hit', 'GET /quote x2', 'Cached <5ms', 'PASS'],
            ['TC-09', 'WL Limit', 'Add 51st stock', 'HTTP 400', 'PASS'],
            ['TC-10', 'Fallback', 'ML offline', 'Mock data', 'PASS'],
            ['TC-11', 'Rate Limit', '101 reqs/15min', 'HTTP 429', 'PASS'],
            ['TC-12', 'Market Sum', 'GET /market-summary', 'Index data', 'PASS'],
        ],
        [16, 28, 38, 35, 16]
    )

    # ================================================================
    # CHAPTER 8: SYSTEM DESIGN
    # ================================================================
    pdf.chapter_cover_page('8', 'System Design', ['8.1  Class Diagram', '8.2  Use-Case Diagram', '8.3  Sequence Diagram', '8.4  Activity Diagram', '8.5  Data Flow Diagram'])
    pdf.chapter_title = "System Design"
    pdf.add_page()

    DIAG = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/diagrams/'

    def embed_diagram(pdf, img_file, caption, landscape=False):
        """Embed a diagram image with caption TIGHT below. Only new page if not enough space."""
        img_path = DIAG + img_file
        if landscape:
            img_w = CONTENT_W
        else:
            img_w = CONTENT_W - 5
        # Estimate image height based on aspect ratio
        from PIL import Image as PILImage
        im = PILImage.open(img_path)
        aspect = im.height / im.width
        img_h = img_w * aspect
        im.close()
        # Check if image + caption fits on current page
        needed = img_h + 12  # image + caption + margin
        if pdf._space_left() < needed:
            pdf.add_page()
        img_x = L_MARGIN + (CONTENT_W - img_w) / 2
        pdf.image(img_path, x=img_x, w=img_w)
        pdf.ln(2)
        pdf.set_font('Times', 'B', 12)
        pdf.cell(0, 7, caption, 0, 1, 'C')
        pdf.ln(4)

    pdf.section_heading('8.1', 'Class Diagram')
    pdf.body('The Class Diagram illustrates the static structure across three packages: React Frontend (ApiService, AuthContext, PortfolioContext, SocketService), Express Backend (AuthMiddleware, StockService, PredictionProxy), and FastAPI ML Service (StockPredictor, Configuration). Each class shows its attributes and methods.')
    embed_diagram(pdf, 'class_diagram.png', 'Fig 8.1   Class Diagram', landscape=True)

    pdf.section_heading('8.2', 'Use-Case Diagram')
    pdf.body('Four actors identified: Unauthenticated User (Guest) who can view data and generate predictions; Authenticated User (Investor) who additionally manages watchlists and executes paper trades; ML Service (FastAPI) that processes prediction requests; and System Administrator for monitoring.')
    embed_diagram(pdf, 'usecase_diagram.png', 'Fig 8.2   Use-Case Diagram')

    pdf.section_heading('8.3', 'Sequence Diagram')
    pdf.body('The Sequence Diagram maps the AI prediction request lifecycle: (1) User selects symbol and clicks Generate; (2) React sends POST to Express; (3) Express proxies to FastAPI; (4) FastAPI checks model cache; (5) If miss, fetches yfinance data and trains LSTM; (6) Generates autoregressive predictions; (7) Calculates metrics; (8-12) Response cascades back through Express to React for chart rendering.')
    embed_diagram(pdf, 'sequence_diagram.png', 'Fig 8.3   Sequence Diagram', landscape=True)

    pdf.section_heading('8.4', 'Activity Diagram')
    pdf.body('The Activity Diagram models execution across three swimlanes: React Frontend (user interaction, chart rendering), Express Backend (request validation, caching, proxying), and FastAPI ML Service (model loading, training, inference). Key decision forks determine ML service availability and model cache status.')
    embed_diagram(pdf, 'activity_diagram.png', 'Fig 8.4   Activity Diagram')

    pdf.section_heading('8.5', 'Data Flow Diagrams')
    pdf.subsection_heading('8.5.1', 'Level 0 DFD (Context Diagram)')
    pdf.body('The Level 0 DFD represents the entire StockAI Platform as Process 0.0 with three external entities: Retail Investor (queries, credentials, trade orders), Yahoo Finance API (OHLCV market data), and MongoDB Database (persistent storage).')
    embed_diagram(pdf, 'dfd_level0.png', 'Fig 8.5   Level 0 DFD (Context Diagram)', landscape=True)

    pdf.subsection_heading('8.5.2', 'Level 1 DFD')
    pdf.body('The Level 1 DFD decomposes the system into six sub-processes: (1.0) User Authentication, (2.0) Stock Data Service, (3.0) AI Prediction Engine, (4.0) Watchlist Management, (5.0) Paper Trading Engine, (6.0) Real-Time WebSocket. Data stores include Users, Stocks, Watchlists, and Model Cache.')
    embed_diagram(pdf, 'dfd_level1.png', 'Fig 8.6   Level 1 DFD (Primary Sub-Systems)', landscape=True)

    pdf.subsection_heading('8.5.3', 'Level 2 DFD')
    pdf.body('The Level 2 DFD provides a deep dive into Process 3.0 (AI Prediction Engine), showing five sub-processes: Parse Request, Check Model Cache, Train LSTM Model, Generate Predictions, and Calculate Metrics. Data stores include Model Cache (.keras files) and Scaler Cache (.pkl files).')
    embed_diagram(pdf, 'dfd_level2.png', 'Fig 8.7   Level 2 DFD (AI Prediction Engine)', landscape=True)

    # ================================================================
    # CHAPTER 9: LIMITATIONS AND FUTURE ENHANCEMENTS
    # ================================================================
    pdf.chapter_cover_page('9', 'Limitations and\nFuture Enhancements', ['9.1  Limitations', '9.2  Future Enhancements'])
    pdf.chapter_title = "Limitations and Future Enhancements"
    pdf.add_page()

    pdf.section_heading('9.1', 'Limitations')
    pdf.subsection_heading('9.1.1', 'Single-Feature LSTM Model')
    pdf.body('The current model uses only Close Price, ignoring volume, technical indicators (RSI, MACD), and macroeconomic factors that could improve accuracy.')
    pdf.subsection_heading('9.1.2', 'Autoregressive Prediction Drift')
    pdf.body('Multi-day predictions compound uncertainty at each step, reducing reliability for horizons beyond 30 days.')
    pdf.subsection_heading('9.1.3', 'Data Source Dependency')
    pdf.body('Complete dependence on Yahoo Finance API. Changes to their API structure or availability could disrupt the data pipeline.')
    pdf.subsection_heading('9.1.4', 'Paper Trading Simplification')
    pdf.body('Simulates trades at current market price without bid-ask spreads, slippage, or commission fees.')
    pdf.subsection_heading('9.1.5', 'No Automated Model Retraining')
    pdf.body('Cached models are not automatically retrained as new market data becomes available.')

    pdf.section_heading('9.2', 'Future Enhancements')
    pdf.subsection_heading('9.2.1', 'Multi-Feature LSTM')
    pdf.body('Extend input to include Volume, RSI, MACD, SMA, EMA. Expected 5-15% accuracy improvement.')
    pdf.subsection_heading('9.2.2', 'Transformer-Based Models')
    pdf.body('Supplement LSTM with Temporal Fusion Transformer for better long-term dependency capture.')
    pdf.subsection_heading('9.2.3', 'Sentiment Analysis')
    pdf.body('Integrate FinBERT NLP sentiment analysis of financial news and social media as auxiliary prediction input.')
    pdf.subsection_heading('9.2.4', 'Real Brokerage Integration')
    pdf.body('Support real trading through Alpaca, Interactive Brokers, or Zerodha APIs.')
    pdf.subsection_heading('9.2.5', 'Mobile Application')
    pdf.body('React Native or Flutter mobile app for on-the-go monitoring and trading.')

    # ================================================================
    # CHAPTER 10: CONCLUSION
    # ================================================================
    pdf.chapter_cover_page('10', 'Conclusion')
    pdf.chapter_title = "Conclusion"
    pdf.add_page()

    pdf.section_heading('10.1', 'Conclusion')
    pdf.body('The exponential growth in retail stock market participation has created an urgent demand for intelligent, accessible, and transparent financial analysis tools. This thesis successfully designed, implemented, and validated an AI-Powered Stock Market Analysis Platform - a full-stack web application integrating deep learning-based price forecasting, real-time market data visualization, and simulated paper trading.')

    pdf.subsection_heading('10.1.1', 'Summary of Engineering Contributions')
    pdf.bullet('The multi-layer LSTM (128-64-32 with Dropout) achieves R-squared=0.9159 and MAPE=1.02%, confirming deep learning viability for short-term stock prediction.', 'Deep Learning for Forecasting')
    pdf.bullet('The three-tier architecture (React + Express + FastAPI) demonstrates clean integration of AI inference into modern web applications through well-defined API contracts.', 'Microservices Architecture')
    pdf.bullet('Comprehensive model metrics (RMSE, MAE, R-squared, MAPE) and AI Confidence percentage empower calibrated user decisions.', 'Transparent AI')
    pdf.bullet('Socket.IO WebSocket integration achieves financial-grade real-time streaming in a browser without specialized software.', 'Real-Time Data Delivery')
    pdf.bullet('Paper trading simulator bridges financial literacy and market participation with realistic trade mechanics and P&L tracking.', 'Risk-Free Practice')

    pdf.subsection_heading('10.1.2', 'Key Metrics Achieved')
    pdf.body('The following quantitative results validate the engineering decisions made throughout the project:')
    pdf.bullet('LSTM model R-squared Score: 0.9159 (91.6% of price variance explained)')
    pdf.bullet('LSTM model MAPE: 1.02% (well below the 5% threshold for "good" financial forecasting)')
    pdf.bullet('LSTM model RMSE: 4.1308 (low absolute prediction error)')
    pdf.bullet('LSTM model MAE: 1.1950 (average $1.19 deviation from actual prices)')
    pdf.bullet('AI Confidence: 92% (high reliability indicator for end users)')
    pdf.bullet('API response time: < 500ms for cached predictions')
    pdf.bullet('WebSocket latency: < 1 second for real-time price updates')
    pdf.bullet('Supported stock symbols: 8+ major US equities (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NFLX, NVDA)')

    pdf.subsection_heading('10.1.3', 'Final Verdict')
    pdf.body('The platform successfully delivers institutional-grade capabilities - real-time monitoring, AI forecasting, and portfolio management - through a free, accessible web application. The R-squared Score exceeding 0.91 validates LSTM architecture for short-term prediction.')
    pdf.body('Ultimately, this thesis proves that the convergence of modern web frameworks (React, Express), deep learning infrastructure (TensorFlow, FastAPI), and thoughtful UX design can democratize financial intelligence for retail investors. As algorithmic trading continues to dominate global markets, platforms like StockAI will be essential to ensuring that individual investors have access to the same analytical tools - transparent, intelligent, and free - that were previously reserved for institutional professionals.')

    # ================================================================
    # CHAPTER 11: APPENDICES
    # ================================================================
    pdf.chapter_cover_page('11', 'Appendices', ['11.1  Business Model', '11.2  Product Deployment Detail', '11.3  API and Web Service Details'])
    pdf.chapter_title = "Appendices"
    pdf.add_page()

    pdf.section_heading('11.1', 'Business Model')
    pdf.body('StockAI is designed as a freemium educational and analytical tool. Monetization paths include:')
    pdf.bullet('Advanced models, extended horizons, custom alerts as paid tier.', 'Premium Features')
    pdf.bullet('LSTM prediction engine as paid API for third-party fintech apps.', 'API Access')
    pdf.bullet('Brokerage API referral commissions (Alpaca, Zerodha).', 'Affiliate Revenue')

    pdf.section_heading('11.2', 'Product Deployment Detail')
    pdf.subsection_heading('11.2.1', 'Local Development Setup')
    pdf.body('Backend (Port 5000): cd backend, npm install, configure .env, npm run dev. ML Service (Port 8000): cd ml-service, create venv, pip install -r requirements.txt, python app.py. Frontend (Port 3000): cd frontend, npm install, npm start.')

    pdf.subsection_heading('11.2.2', 'Application Screenshots')
    pdf.body('The following figures show the platform UI as captured during testing and demonstration. Each screenshot is presented with its corresponding figure number and caption below as per university guidelines.')

    SS_DIR = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/screenshots/'
    screenshots = [
        ('dashboard.png',    'Fig 11.1   Market Overview Dashboard'),
        ('all_stocks.png',   'Fig 11.2   All Stocks Dashboard'),
        ('stock_detail.png', 'Fig 11.3   Stock Detail Page (AAPL)'),
        ('predictions.png',  'Fig 11.4   AI Predictions Page'),
        ('metrics.png',      'Fig 11.5   AI Predictions - Metrics and Predicted Prices'),
        ('discover.png',     'Fig 11.6   Stock Recommendations (Discover)'),
        ('history.png',      'Fig 11.7   Transaction History'),
        ('watchlist.png',    'Fig 11.8   Watchlist Page'),
        ('login.png',        'Fig 11.9   Login Page'),
        ('learning.png',     'Fig 11.10  Learning Center'),
    ]
    # 2 screenshots per page
    img_w = CONTENT_W - 15
    img_x = L_MARGIN + 7.5
    for i, (img_file, caption) in enumerate(screenshots):
        img_path = SS_DIR + img_file
        if i % 2 == 0:
            pdf.add_page()
            pdf.ln(2)
        else:
            pdf.ln(6)
        pdf.image(img_path, x=img_x, w=img_w)
        pdf.ln(2)
        pdf.set_font('Times', 'B', 11)
        pdf.cell(0, 6, caption, 0, 1, 'C')
        pdf.ln(2)

    pdf.add_page()
    pdf.section_heading('11.3', 'API and Web Service Details')
    pdf.table_heading('Table 11.1   Backend REST API Endpoints')
    pdf.make_table(
        ['Route', 'Method', 'Auth', 'Purpose'],
        [
            ['/api/auth/register', 'POST', '-', 'Register new user'],
            ['/api/auth/login', 'POST', '-', 'Login, get JWT'],
            ['/api/auth/me', 'GET', 'JWT', 'Get profile'],
            ['/api/stocks/quote/:sym', 'GET', '-', 'Real-time quote'],
            ['/api/stocks/historical/:s', 'GET', '-', 'Historical data'],
            ['/api/stocks/search/:q', 'GET', '-', 'Search stocks'],
            ['/api/stocks/market-summary', 'GET', '-', 'Market indices'],
            ['/api/predict/:symbol', 'POST', '-', 'LSTM predictions'],
            ['/api/watchlist', 'GET', 'JWT', 'Get watchlist'],
            ['/api/watchlist/add', 'POST', 'JWT', 'Add stock'],
            ['/api/watchlist/remove/:s', 'DELETE', 'JWT', 'Remove stock'],
            ['/api/news', 'GET', '-', 'Market news'],
            ['/api/health', 'GET', '-', 'Health check'],
        ],
        [52, 18, 12, 52]
    )

    pdf.table_heading('Table 11.2   ML Service API Endpoints')
    pdf.make_table(
        ['Endpoint', 'Method', 'Purpose'],
        [
            ['/api/predict', 'POST', 'Generate LSTM predictions'],
            ['/api/train', 'POST', 'Train/retrain model'],
            ['/api/predict/history/{sym}', 'GET', 'Actual vs. predicted'],
            ['/api/models', 'GET', 'List trained models'],
            ['/api/health', 'GET', 'Service health check'],
        ],
        [60, 22, 60]
    )

    pdf.table_heading('Table 11.3   LSTM Model Architecture Summary')
    pdf.make_table(
        ['Layer', 'Configuration', 'Output Shape'],
        [
            ['Input', 'shape=(60, 1)', '(None, 60, 1)'],
            ['LSTM 1', '128 units, return_seq=True', '(None, 60, 128)'],
            ['Dropout 1', 'rate=0.2', '(None, 60, 128)'],
            ['LSTM 2', '64 units, return_seq=True', '(None, 60, 64)'],
            ['Dropout 2', 'rate=0.2', '(None, 60, 64)'],
            ['LSTM 3', '32 units', '(None, 32)'],
            ['Dropout 3', 'rate=0.2', '(None, 32)'],
            ['Dense 1', '16 units, ReLU', '(None, 16)'],
            ['Dense 2', '1 unit, Linear', '(None, 1)'],
        ],
        [40, 55, 48]
    )

    # ================================================================
    # REFERENCES (Alphabetical order with descriptions)
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "References"
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'REFERENCES', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)

    refs = [
        ('Bao W., Yue J., and Rao Y. (2017)', 'A deep learning framework for financial time series using stacked autoencoders and long-short term memory, PLOS ONE, vol. 12, no. 7.', 'This paper proposes a novel deep learning framework combining stacked autoencoders for feature extraction with LSTM networks for stock prediction, demonstrating R-squared scores above 0.90 on major market indices.'),
        ('Chong E., Han C., and Park F. C. (2017)', 'Deep learning networks for stock market analysis and prediction, Expert Systems with Applications, vol. 83, pp. 187-205.', 'This study provides comprehensive benchmarking of deep learning architectures for financial prediction, validating the use of multi-layer networks for capturing complex market patterns.'),
        ('Express.js Documentation (2024)', 'Express - Fast, unopinionated, minimalist web framework for Node.js. Available: https://expressjs.com/', 'Express.js is the industry-standard Node.js web framework used in this project for REST API routing, middleware composition, and HTTP request handling.'),
        ('FastAPI Documentation (2024)', 'FastAPI - Modern, fast web framework for building APIs with Python. Available: https://fastapi.tiangolo.com/', 'FastAPI provides the high-performance async framework used to serve the LSTM prediction model as a RESTful API with automatic OpenAPI documentation.'),
        ('Fischer T. and Krauss C. (2018)', 'Deep learning with long short-term memory networks for financial market predictions, European Journal of Operational Research, vol. 270, no. 2, pp. 654-669.', 'This comprehensive benchmark study demonstrates that LSTM networks consistently outperform traditional ML models for stock prediction across S&P 500 constituents.'),
        ('Hochreiter S. and Schmidhuber J. (1997)', 'Long Short-Term Memory, Neural Computation, vol. 9, no. 8, pp. 1735-1780.', 'The foundational paper introducing the LSTM architecture with input, forget, and output gates that solve the vanishing gradient problem in recurrent neural networks.'),
        ('Moghar A. and Hamiche M. (2020)', 'Stock Market Prediction Using LSTM Recurrent Neural Network, Procedia Computer Science, vol. 170, pp. 1168-1173.', 'This study validates stacked LSTM architectures with decreasing unit counts and Dropout regularization for financial time-series forecasting.'),
        ('MongoDB Documentation (2024)', 'MongoDB - The application data platform. Available: https://www.mongodb.com/docs/', 'MongoDB is the document-oriented NoSQL database used in this project for flexible schema design and horizontal scalability.'),
        ('React Documentation (2024)', 'React - A JavaScript library for building user interfaces, Meta Platforms, Inc. Available: https://react.dev/', 'React 18 provides the component-based frontend framework with virtual DOM, hooks, and context API used throughout this project.'),
        ('Selvin S. et al. (2017)', 'Stock price prediction using LSTM, RNN and CNN-sliding window model, ICACCI, pp. 1643-1647.', 'This paper compares RNN, LSTM, and CNN approaches for stock prediction, establishing that LSTM networks achieve superior accuracy for time-series forecasting.'),
        ('TensorFlow Documentation (2024)', 'TensorFlow - An end-to-end open source machine learning platform, Google. Available: https://www.tensorflow.org/', 'TensorFlow with Keras API provides the deep learning framework used to construct, train, and deploy the LSTM prediction model.'),
    ]
    for title, cite, desc in refs:
        pdf.set_font('Times', 'B', 12)
        pdf.write(LH, title + ', ')
        pdf.set_font('Times', 'I', 12)
        pdf.write(LH, cite)
        pdf.ln(LH)
        pdf.set_font('Times', '', 12)
        pdf.multi_cell(0, LH, desc, 0, 'J')
        pdf.ln(LH)

    # ================================================================
    # EXPERIENCE
    # ================================================================
    pdf.add_page()
    pdf.chapter_title = "Experience"
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'EXPERIENCE', 0, 1, 'L')
    pdf.ln(LH_DOUBLE)
    pdf.body('The development of the AI-Powered Stock Market Analysis Platform provided invaluable hands-on experience across multiple domains of software engineering and artificial intelligence. Working on this project as an individual developer required managing the full software development lifecycle - from requirements analysis and system design through implementation, testing, and documentation.')
    pdf.body('The project environment was primarily self-hosted using a personal development workstation. The open-source community provided exceptional support through comprehensive documentation for React, TensorFlow, FastAPI, Express.js, and MongoDB. The availability of free-tier cloud services (MongoDB Atlas, GitHub) enabled collaborative development workflows and data persistence without incurring costs.')
    pdf.body('Key technical skills developed during this project include: deep learning model architecture design and hyperparameter tuning using TensorFlow/Keras; full-stack web development with React, Node.js, and Express; RESTful API design and microservices architecture; real-time data streaming using WebSocket protocols (Socket.IO); NoSQL database design with MongoDB; and secure authentication implementation using JWT and bcrypt.')
    pdf.body('The most challenging aspect of the project was optimizing the LSTM model to achieve consistent prediction accuracy across different stock symbols with varying price ranges and volatility profiles. This required extensive experimentation with sequence lengths, layer configurations, dropout rates, and learning rates over multiple development sprints.')
    pdf.body('The cooperation of the faculty members at the Department of Computer Science And Engineering, particularly Prof. Ruchi Patel, was instrumental in providing guidance on research methodology, system design best practices, and thesis preparation. Their feedback during periodic reviews helped refine both the technical implementation and the academic documentation.')

    # Save
    out = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/Thesis_StockAI_AryaShah.pdf'
    pdf.output(out)
    print(f'PDF generated: {out}')
    print(f'Total pages: {pdf.page_no()}')

if __name__ == '__main__':
    build()
