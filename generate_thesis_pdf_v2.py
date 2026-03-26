#!/usr/bin/env python3
"""
Generate Thesis PDF v2 (Expanded ~70 pages): AI-Powered Stock Market Analysis Platform
"""

from fpdf import FPDF
import textwrap

class ThesisPDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=25)
        self.chapter_title = ""
        self.show_header_footer = False
        self.page_label = ""

    def header(self):
        if self.show_header_footer and self.page_no() > 1:
            self.set_font('Times', 'I', 9)
            self.cell(95, 5, 'IITE/CSE2026/IDP138', 0, 0, 'L')
            self.cell(95, 5, self.chapter_title.upper(), 0, 0, 'R')
            self.ln(6)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)

    def footer(self):
        if self.show_header_footer:
            self.set_y(-20)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(2)
            self.set_font('Times', 'I', 9)
            self.cell(95, 5, 'Department of Computer Science And Engineering', 0, 0, 'L')
            self.cell(95, 5, f'Page {self.page_label}', 0, 0, 'R')

    def chapter_cover(self, num, title, bullets=None):
        self.add_page()
        prev = self.show_header_footer
        self.show_header_footer = False
        self.ln(70)
        self.set_font('Times', 'B', 16)
        self.cell(0, 10, f'CHAPTER {num}', 0, 1, 'R')
        self.set_font('Times', 'B', 26)
        for line in title.split('\n'):
            self.cell(0, 13, line.upper(), 0, 1, 'R')
        if bullets:
            self.ln(10)
            self.set_font('Times', 'B', 12)
            for b in bullets:
                self.cell(0, 8, b, 0, 1, 'R')
        self.show_header_footer = prev

    def s1(self, num, title):
        self.ln(6)
        self.set_font('Times', 'B', 14)
        self.cell(0, 8, f'{num} {title.upper()}', 0, 1, 'L')
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def s2(self, num, title):
        self.ln(4)
        self.set_font('Times', 'B', 12)
        self.cell(0, 8, f'{num} {title}', 0, 1, 'L')
        self.ln(2)

    def s3(self, num, title):
        self.ln(3)
        self.set_font('Times', 'BI', 11)
        self.cell(0, 7, f'{num} {title}', 0, 1, 'L')
        self.ln(2)

    def p(self, text):
        self.set_font('Times', '', 12)
        self.multi_cell(0, 6.5, text, 0, 'J')
        self.ln(3)

    def bp(self, text, bold_prefix=""):
        self.set_font('Times', '', 12)
        self.cell(10, 6.5, '-', 0, 0)
        if bold_prefix:
            self.set_font('Times', 'B', 12)
            w = self.get_string_width(f'{bold_prefix}: ') + 2
            self.write(6.5, f'{bold_prefix}: ')
            self.set_font('Times', '', 12)
        self.multi_cell(0, 6.5, text, 0, 'J')
        self.ln(2)

    def ni(self, num, text, bold_prefix=""):
        self.set_font('Times', '', 12)
        self.cell(5, 6.5, '', 0, 0)
        self.set_font('Times', 'B', 12)
        self.cell(8, 6.5, f'{num}.', 0, 0)
        if bold_prefix:
            self.write(6.5, f'{bold_prefix}: ')
            self.set_font('Times', '', 12)
        self.multi_cell(0, 6.5, text, 0, 'J')
        self.ln(2)

    def tbl(self, headers, rows, col_widths=None):
        if col_widths is None:
            w = 190 / len(headers)
            col_widths = [w] * len(headers)
        self.set_font('Times', 'B', 10)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 8, h, 1, 0, 'C')
        self.ln()
        self.set_font('Times', '', 9)
        for row in rows:
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell)[:50], 1, 0, 'C')
            self.ln()
        self.ln(3)

    def fig_ref(self, fig_num, caption):
        self.ln(3)
        self.set_font('Times', 'B', 11)
        self.cell(0, 7, f'Fig {fig_num} {caption}', 0, 1, 'C')
        self.set_font('Times', 'I', 10)
        self.cell(0, 6, '[Refer to attached screenshot/diagram]', 0, 1, 'C')
        self.ln(3)


def build():
    pdf = ThesisPDF()

    # ===== PAGE 1: TITLE =====
    pdf.add_page()
    pdf.ln(15)
    pdf.set_font('Times', 'I', 14)
    pdf.cell(0, 8, 'PROJECT REPORT', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'On', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Times', 'B', 22)
    pdf.multi_cell(0, 12, 'AI-Powered Stock Market Analysis\nPlatform', 0, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'Submitted by', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Times', 'B', 16)
    pdf.cell(0, 10, 'Arya Shah (IU2241230098)', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'In fulfillment for the award of the degree', 0, 1, 'C')
    pdf.cell(0, 8, 'Of', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'BI', 14)
    pdf.cell(0, 10, 'BACHELOR OF TECHNOLOGY', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'I', 12)
    pdf.cell(0, 8, 'In', 0, 1, 'C')
    pdf.set_font('Times', 'I', 13)
    pdf.cell(0, 8, 'COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.ln(20)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 7, 'INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, 'INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ', 0, 1, 'C')
    pdf.cell(0, 7, 'AHMEDABAD-382115, GUJARAT, INDIA,', 0, 1, 'C')
    pdf.set_font('Times', '', 11)
    pdf.cell(0, 7, 'WEB: www.indusuni.ac.in', 0, 1, 'C')
    pdf.cell(0, 7, 'APRIL 2026', 0, 1, 'C')

    # ===== PAGE 2: DETAILED TITLE =====
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('Times', 'B', 13)
    pdf.cell(0, 8, 'PROJECT REPORT', 0, 1, 'C')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'ON', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', '', 20)
    pdf.multi_cell(0, 11, 'AI-Powered Stock Market Analysis\nPlatform', 0, 'C')
    pdf.ln(3)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'AT', 0, 1, 'C')
    pdf.ln(8)
    pdf.cell(0, 7, 'In the partial fulfillment of the requirement', 0, 1, 'C')
    pdf.cell(0, 7, 'for the degree of', 0, 1, 'C')
    pdf.cell(0, 7, 'Bachelor of Technology', 0, 1, 'C')
    pdf.cell(0, 7, 'in', 0, 1, 'C')
    pdf.cell(0, 7, 'Computer Science And Engineering', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 13)
    pdf.cell(0, 8, 'PREPARED BY', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'Arya Shah (IU2241230098)', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 13)
    pdf.cell(0, 8, 'UNDER GUIDANCE OF', 0, 1, 'C')
    pdf.ln(5)
    pdf.set_font('Times', 'B', 11)
    pdf.cell(95, 7, 'External Guide', 0, 0, 'C')
    pdf.cell(95, 7, 'Internal Guide', 0, 1, 'C')
    pdf.set_font('Times', '', 11)
    pdf.cell(95, 6, '<Guide name>', 0, 0, 'C')
    pdf.cell(95, 6, 'Prof. Ruchi Patel', 0, 1, 'C')
    pdf.cell(95, 6, '(<Company Name>)', 0, 0, 'C')
    pdf.cell(95, 6, 'Assistant Professor,', 0, 1, 'C')
    pdf.cell(95, 6, '', 0, 0, 'C')
    pdf.cell(95, 6, 'Dept. of Computer Science and Engineering,', 0, 1, 'C')
    pdf.cell(95, 6, '', 0, 0, 'C')
    pdf.cell(95, 6, 'I.T.E, Indus University, Ahmedabad', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 7, 'SUBMITTED TO', 0, 1, 'C')
    pdf.ln(3)
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, 'INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ', 0, 1, 'C')
    pdf.cell(0, 7, 'AHMEDABAD-382115, GUJARAT, INDIA,', 0, 1, 'C')
    pdf.set_font('Times', '', 11)
    pdf.cell(0, 7, 'WEB: www.indusuni.ac.in', 0, 1, 'C')
    pdf.cell(0, 7, 'APRIL 2026', 0, 1, 'C')

    # ===== PAGE 3: DECLARATION =====
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, "CANDIDATE'S DECLARATION", 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(10)
    pdf.set_font('Times', '', 12)
    pdf.write(7, 'I declare that the final semester report entitled ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(7, '"AI-Powered Stock Market Analysis Platform"')
    pdf.set_font('Times', '', 12)
    pdf.write(7, ' is my own work conducted under the supervision of the guide ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(7, 'Prof. Ruchi Patel')
    pdf.set_font('Times', '', 12)
    pdf.write(7, '.')
    pdf.ln(12)
    pdf.multi_cell(0, 7, 'I further declare that to the best of my knowledge, the report for B.Tech final semester does not contain part of the work which has been submitted for the award of B.Tech Degree either in this university or any other university without proper citation.', 0, 'J')
    pdf.ln(30)
    pdf.line(10, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(3)
    pdf.cell(0, 7, "Candidate's Signature", 0, 1, 'L')
    pdf.cell(0, 7, 'Arya Shah (IU2241230098)', 0, 1, 'L')
    pdf.ln(40)
    pdf.line(10, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 11)
    for line in ['Guide : Prof. Ruchi Patel', 'Assistant Professor', 'Department of Computer Science And Engineering,', 'Indus Institute of Technology and Engineering', 'INDUS UNIVERSITY - Ahmedabad,', 'State: Gujarat']:
        pdf.cell(0, 6, line, 0, 1, 'L')

    # ===== PAGE 4: CERTIFICATE =====
    pdf.add_page()
    pdf.ln(3)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 7, 'INDUS INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, 'COMPUTER SCIENCE AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, '2025 - 2026', 0, 1, 'C')
    pdf.ln(15)
    pdf.set_font('Times', 'B', 22)
    pdf.cell(0, 12, 'CERTIFICATE', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Date: 13-03-2026', 0, 1, 'R')
    pdf.ln(5)
    pdf.set_font('Times', '', 12)
    pdf.write(7, 'This is to certify that the project work entitled ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(7, '"AI-Powered Stock Market Analysis Platform"')
    pdf.set_font('Times', '', 12)
    pdf.write(7, ' has been carried out by ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(7, 'Arya Shah')
    pdf.set_font('Times', '', 12)
    pdf.write(7, ' under my guidance in partial fulfillment of degree of Bachelor of Technology in ')
    pdf.set_font('Times', 'B', 12)
    pdf.write(7, 'COMPUTER SCIENCE AND ENGINEERING (Final Year)')
    pdf.set_font('Times', '', 12)
    pdf.write(7, ' of Indus University, Ahmedabad during the academic year 2025-2026.')
    pdf.ln(40)
    col_w = 63
    pdf.line(10, pdf.get_y(), 60, pdf.get_y())
    pdf.line(73, pdf.get_y(), 133, pdf.get_y())
    pdf.line(140, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 9)
    sigs = [
        ('Prof. Ruchi Patel', 'Dr. Kaushal Jani', 'Prof. Zalak Vyas'),
        ('Assistant Professor,', 'Head of Department,', 'Head of Department,'),
        ('Department of Computer', 'Department of Computer', 'Department of Computer'),
        ('Science And Engineering,', 'Science And Engineering,', 'Science And Engineering,'),
        ('IITE, Indus University,', 'IITE, Indus University,', 'IITE, Indus University,'),
        ('Ahmedabad', 'Ahmedabad', 'Ahmedabad'),
    ]
    for row in sigs:
        pdf.cell(col_w, 5, row[0], 0, 0, 'L')
        pdf.cell(col_w, 5, row[1], 0, 0, 'C')
        pdf.cell(col_w, 5, row[2], 0, 1, 'R')

    # ===== ABSTRACT (2 pages) =====
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'ABSTRACT', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    pdf.p('The rapid growth of retail participation in global stock markets has created a critical demand for intelligent, accessible, and real-time financial analysis tools. Traditional stock market platforms either provide raw data without actionable insights or charge prohibitive subscription fees for AI-driven analytics, creating a significant accessibility gap for individual investors. This thesis presents the design, development, and deployment of an AI-Powered Stock Market Analysis Platform - a full-stack web application that democratizes financial intelligence through deep learning.')
    pdf.p('Our approach integrates three independent microservices into a cohesive analytical ecosystem. First, a React 18 frontend delivers a responsive, dark-themed user interface featuring real-time market dashboards, interactive price charts built with Recharts, and a simulated paper trading engine that allows users to practice buy/sell strategies without financial risk. The frontend communicates with the backend through Axios HTTP clients augmented with JWT interceptor-based authentication.')
    pdf.p('Second, a Node.js/Express backend serves as the API gateway and business logic layer. It implements JWT-based authentication with bcrypt password hashing (12 salt rounds), manages user portfolios and watchlists through MongoDB via Mongoose ODM, and provides real-time stock price feeds using Socket.IO WebSocket connections. The backend employs a multi-layered security architecture including Helmet for HTTP header hardening, express-rate-limit for API throttling (100 requests per 15 minutes), and express-validator for input sanitization.')
    pdf.p('Third, and most critically, a Python FastAPI microservice houses the core artificial intelligence engine. The service deploys a multi-layer Long Short-Term Memory (LSTM) neural network built with TensorFlow/Keras for time-series stock price forecasting. The LSTM architecture comprises three stacked recurrent layers (128, 64, and 32 units) with Dropout regularization (0.2) to prevent overfitting, followed by a Dense output layer. The model is trained on two years of historical market data fetched via the Yahoo Finance API (yfinance), using a sliding window of 60 time steps with MinMaxScaler normalization. The system generates configurable prediction horizons (1-365 days) and provides comprehensive evaluation metrics including RMSE, MAE, R-squared Score, and MAPE to quantify prediction confidence.')
    pdf.p('Experimental results demonstrate that the LSTM model achieves an R-squared Score of 0.9159 and a MAPE of 1.02% on test data for major market indices, confirming strong predictive capability for short-to-medium term price forecasting. The platform supports real-time WebSocket price updates, AI-powered stock recommendations with confidence scoring, and a comprehensive learning center for financial literacy.')
    pdf.ln(3)
    pdf.set_font('Times', 'B', 12)
    pdf.write(6, 'Keywords: ')
    pdf.set_font('Times', '', 12)
    pdf.write(6, 'Stock Market Prediction, LSTM Neural Network, Deep Learning, Full-Stack Web Application, React, Node.js, FastAPI, Time-Series Forecasting, Real-Time Data.')

    # ===== LIST OF FIGURES =====
    pdf.add_page()
    pdf.show_header_footer = False
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'LIST OF FIGURES', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)
    figs = [
        ('Fig 6.1', 'System Architecture Diagram'),
        ('Fig 7.1', 'AI Prediction Results - Metrics Dashboard'),
        ('Fig 7.2', 'Confusion of Prediction Accuracy'),
        ('Fig 8.1', 'Class Diagram'),
        ('Fig 8.2', 'Use-Case Diagram'),
        ('Fig 8.3', 'Sequence Diagram'),
        ('Fig 8.4', 'Activity Diagram'),
        ('Fig 8.5.1', 'Level 0 DFD (Context Diagram)'),
        ('Fig 8.5.2', 'Level 1 DFD (Primary Sub-Systems)'),
        ('Fig 8.5.3', 'Level 2 DFD (Deep Dive: Prediction Engine)'),
        ('Fig 11.1', 'Market Overview Dashboard'),
        ('Fig 11.2', 'All Stocks Dashboard'),
        ('Fig 11.3', 'Stock Detail Page (AAPL)'),
        ('Fig 11.4', 'AI Predictions Page (GOOGL) - Chart'),
        ('Fig 11.5', 'AI Predictions Page - Metrics and Predicted Prices'),
        ('Fig 11.6', 'Stock Recommendations (Discover Page)'),
        ('Fig 11.7', 'Transaction History'),
        ('Fig 11.8', 'Watchlist Page'),
        ('Fig 11.9', 'Login Page'),
        ('Fig 11.10', 'Learning Center'),
    ]
    pdf.set_font('Times', '', 12)
    for fig_num, fig_title in figs:
        pdf.cell(30, 8, fig_num, 0, 0, 'L')
        pdf.cell(130, 8, fig_title, 0, 0, 'L')
        pdf.ln()

    # ===== LIST OF TABLES =====
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'LIST OF TABLES', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)
    tables = [
        ('Table 2.1', 'Literature Survey Comparison'),
        ('Table 3.1', 'Project Timeline Chart'),
        ('Table 5.1', 'Platform Comparison'),
        ('Table 5.2', 'Architecture Comparison'),
        ('Table 5.3', 'ML Methodology Comparison'),
        ('Table 7.1', 'LSTM Model Evaluation Metrics'),
        ('Table 7.2', 'Test Cases'),
        ('Table 11.1', 'Backend REST API Endpoints'),
        ('Table 11.2', 'ML Service API Endpoints'),
        ('Table 11.3', 'LSTM Model Architecture Summary'),
    ]
    pdf.set_font('Times', '', 12)
    for t_num, t_title in tables:
        pdf.cell(30, 8, t_num, 0, 0, 'L')
        pdf.cell(130, 8, t_title, 0, 0, 'L')
        pdf.ln()

    # ===== ABBREVIATIONS =====
    pdf.add_page()
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'ABBREVIATIONS', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)
    abbrs = [
        ('AI', 'Artificial Intelligence'), ('API', 'Application Programming Interface'),
        ('ARIMA', 'AutoRegressive Integrated Moving Average'), ('CORS', 'Cross-Origin Resource Sharing'),
        ('CRUD', 'Create, Read, Update, Delete'), ('CSS', 'Cascading Style Sheets'),
        ('DFD', 'Data Flow Diagram'), ('DOM', 'Document Object Model'),
        ('EMA', 'Exponential Moving Average'), ('GARCH', 'Generalized Autoregressive Conditional Heteroskedasticity'),
        ('HTML', 'HyperText Markup Language'), ('HTTP', 'HyperText Transfer Protocol'),
        ('JSON', 'JavaScript Object Notation'), ('JWT', 'JSON Web Token'),
        ('LSTM', 'Long Short-Term Memory'), ('MACD', 'Moving Average Convergence Divergence'),
        ('MAE', 'Mean Absolute Error'), ('MAPE', 'Mean Absolute Percentage Error'),
        ('ML', 'Machine Learning'), ('NoSQL', 'Not Only Structured Query Language'),
        ('ODM', 'Object Document Mapper'), ('OHLCV', 'Open, High, Low, Close, Volume'),
        ('P&L', 'Profit and Loss'), ('REST', 'Representational State Transfer'),
        ('RMSE', 'Root Mean Squared Error'), ('RSI', 'Relative Strength Index'),
        ('SMA', 'Simple Moving Average'), ('SPA', 'Single Page Application'),
        ('TTL', 'Time To Live'), ('UI/UX', 'User Interface / User Experience'),
    ]
    pdf.set_font('Times', '', 12)
    for abbr, full in abbrs:
        pdf.set_font('Times', 'B', 12)
        pdf.cell(30, 7, abbr, 0, 0, 'L')
        pdf.set_font('Times', '', 12)
        pdf.cell(0, 7, full, 0, 1, 'L')

    # ========================================================================
    # CHAPTER 1: INTRODUCTION (expanded)
    # ========================================================================
    pdf.chapter_cover('1', 'Introduction', ['AI-POWERED STOCK MARKET', 'ANALYSIS PLATFORM'])
    pdf.show_header_footer = True
    pdf.chapter_title = "Introduction"

    pdf.add_page()
    pdf.s1('1.1', 'Project Summary')
    pdf.p('This project develops an AI-Powered Stock Market Analysis Platform - a comprehensive full-stack web application that combines real-time market data visualization, deep learning-based price forecasting, and simulated paper trading into a single, unified platform. The system employs a microservices architecture consisting of a React 18 frontend for interactive data presentation, a Node.js/Express backend for API orchestration and user management via MongoDB, and a Python FastAPI service that deploys a multi-layer LSTM (Long Short-Term Memory) neural network for stock price prediction.')
    pdf.p('The platform, branded as "StockAI," provides retail investors with institutional-grade analytical capabilities including real-time WebSocket price feeds, AI-powered stock recommendations with confidence scoring, interactive historical price charts with multiple time intervals (1W, 1M, 3M, 6M, 1Y), and comprehensive model evaluation metrics (RMSE, MAE, R-squared Score, MAPE). The system supports paper trading simulation with complete transaction history, portfolio profit/loss tracking, and personalized stock watchlists for up to 50 symbols per user.')

    pdf.s1('1.2', 'Project Purpose')
    pdf.p('The purpose of this project is to bridge the gap between institutional-grade financial analytics and retail investors. Traditional stock analysis tools present raw numerical data - price, volume, and percentage changes - without actionable predictive insights. Advanced platforms that incorporate AI-driven forecasting, such as Bloomberg Terminal or Refinitiv Eikon, carry annual subscription costs exceeding $20,000, rendering them inaccessible to individual investors and students.')
    pdf.p('The global retail trading market has witnessed unprecedented growth, with retail investors now accounting for over 25% of daily trading volume on major US exchanges. Despite this significant market participation, these investors remain systematically disadvantaged in their access to predictive financial intelligence. The tools available to them are either overly simplistic (basic price charts and news feeds) or prohibitively expensive (institutional-grade analytics platforms).')
    pdf.p('By developing an open-source, web-based platform that integrates LSTM neural networks for time-series forecasting directly into a user-friendly dashboard, this project democratizes financial intelligence. The system enables users to not only monitor real-time market data but also generate AI-powered predictions for any supported stock symbol, view model confidence metrics, practice trading strategies through a paper trading simulator, and build personalized watchlists - all within a single browser-based interface.')

    pdf.add_page()
    pdf.s1('1.3', 'Project Scope')
    pdf.p('The scope of this project encompasses the complete design, development, testing, and deployment of a three-tier web application with integrated machine learning capabilities. The following subsections detail each component of the project scope:')
    pdf.bp('Development of a responsive, dark-themed React 18 single-page application (SPA) with over 10 interactive views including Dashboard, Stock Detail, AI Predictions, Watchlist, Discover (Recommendations), Trading History, News, and Learning Center. The frontend leverages React Router v6 for client-side navigation, Recharts for data visualization, and Socket.IO for real-time data streaming.', 'Frontend Application')
    pdf.bp('Implementation of a RESTful API server using Node.js/Express with MongoDB persistence for user accounts, watchlists, stock data caching, and trade history. The backend implements JWT-based authentication with 7-day token expiry, bcrypt password hashing with 12 salt rounds, rate limiting at 100 requests per 15 minutes, Helmet HTTP header hardening, CORS configuration, and express-validator input sanitization.', 'Backend API Layer')
    pdf.bp('Deployment of a Python FastAPI microservice hosting a TensorFlow/Keras LSTM model trained on Yahoo Finance historical data. The service provides endpoints for on-demand stock price prediction with configurable horizons (1-365 days), model training with hyperparameter configuration, prediction accuracy history, and trained model inventory management.', 'Machine Learning Service')
    pdf.bp('Integration with Yahoo Finance (yfinance) for fetching two years of historical OHLCV (Open, High, Low, Close, Volume) data, with MinMaxScaler normalization to the [0, 1] range and a sliding window of 60 time steps for sequence generation. The data pipeline implements an 80/20 train/test temporal split to prevent data leakage.', 'Data Pipeline')
    pdf.bp('A simulated trading system that allows authenticated users to execute buy/sell transactions at current market prices, specify trade quantities, track portfolio performance metrics (Total Trades, Total Bought, Total Sold, Net P&L), and review complete transaction history with date/time stamps and running balance calculations.', 'Paper Trading Engine')

    pdf.add_page()
    pdf.s1('1.4', 'Objectives')
    pdf.s2('1.4.1', 'Main Objectives')
    pdf.bp('To design and develop a full-stack web platform that provides real-time stock market data visualization with interactive charting capabilities across multiple time intervals (1W, 1M, 3M, 6M, 1Y), market index tracking (S&P 500, NASDAQ, Dow Jones), and comprehensive stock detail views with live price updates.')
    pdf.bp('To implement and deploy a deep learning LSTM neural network capable of generating accurate short-to-medium term stock price forecasts with quantifiable confidence metrics including RMSE, MAE, R-squared Score, MAPE, and an intuitive AI Confidence percentage.')
    pdf.bp('To build a secure, scalable microservices architecture that cleanly separates the presentation layer (React), business logic (Node.js/Express), and AI inference engine (Python/FastAPI), enabling independent development, testing, and deployment of each tier.')

    pdf.s2('1.4.2', 'Secondary Objectives')
    pdf.bp('To develop a paper trading simulator that enables users to practice investment strategies without financial risk, featuring buy/sell execution, quantity specification, portfolio tracking, and complete transaction history with P&L calculations.')
    pdf.bp('To implement an AI-powered stock recommendation engine that categorizes stocks into "Top Gainers," "Top Losers," "Most Active," and "Best Value" categories, with confidence percentages and actionable "Strong Buy," "Buy," or "Hold" labels.')
    pdf.bp('To create a comprehensive Learning Center that educates users on platform features (Dashboard, Predictions, Watchlist, Trading) and stock market fundamentals through searchable, expandable content cards.')
    pdf.bp('To ensure platform security through JWT authentication with bcrypt password hashing, API rate limiting, HTTP header hardening via Helmet, and input validation/sanitization through express-validator middleware.')
    pdf.bp('To implement a dark/light theme toggle for user accessibility and comfort across different viewing environments.')

    pdf.add_page()
    pdf.s1('1.5', 'Technology and Literature Overview')
    pdf.p('This project leverages several key technologies across its three-tier architecture. The technology selection process was governed by three principles: proven reliability in production environments, strong community support and documentation, and compatibility with the project requirements for real-time data processing and deep learning inference.')
    pdf.bp('TensorFlow/Keras LSTM networks are utilized for their proven effectiveness in modeling sequential dependencies in time-series financial data. The LSTM architecture was selected over traditional RNNs because of its ability to learn long-term dependencies through input, forget, and output gating mechanisms, which is critical for capturing the temporal patterns inherent in stock price movements.', 'Deep Learning (LSTM)')
    pdf.bp('React 18 with React Router v6 provides a component-based, single-page application architecture with client-side routing. The selection of React over alternatives (Angular, Vue.js) was driven by its virtual DOM performance, extensive ecosystem, and the availability of specialized financial visualization libraries.', 'Frontend Framework (React 18)')
    pdf.bp('The Recharts library was selected for its composable, declarative approach to chart construction using React components. It provides responsive charts, tooltips, customizable axes, and area/line chart types essential for financial data visualization.', 'Data Visualization (Recharts)')
    pdf.bp('Socket.IO WebSocket protocol delivers live stock price updates without HTTP polling overhead. Unlike raw WebSockets, Socket.IO provides automatic reconnection, fallback to long-polling in restrictive network environments, and room-based event broadcasting for per-symbol subscriptions.', 'Real-Time Communication (Socket.IO)')
    pdf.bp('MongoDB with Mongoose ODM provides flexible, schema-based document storage. The document-oriented model naturally maps to JSON data structures used throughout the JavaScript ecosystem, eliminating impedance mismatch between the application layer and the database.', 'Database (MongoDB)')
    pdf.bp('Yahoo Finance API (via the yfinance Python library) provides free, reliable access to historical and real-time market data for global stock exchanges. This eliminates the need for expensive market data subscriptions while providing sufficient data quality for model training.', 'Data Source (Yahoo Finance)')
    pdf.bp('FastAPI was selected as the ML service framework for its native async support, automatic OpenAPI documentation generation, built-in request validation via Pydantic, and high-performance ASGI server deployment through Uvicorn.', 'ML Service Framework (FastAPI)')

    pdf.add_page()
    pdf.s1('1.6', 'Synopsis')
    pdf.p('In summary, this thesis presents a comprehensive approach to stock market analysis that combines real-time data visualization with deep learning-based price forecasting. By integrating an LSTM neural network into a modern web application with paper trading capabilities, we demonstrate a platform that empowers retail investors with institutional-grade analytical tools.')
    pdf.p('The system achieves an R-squared Score of 0.9159 and MAPE of 1.02%, confirming the viability of LSTM networks for short-term stock price prediction when deployed within a production-ready web architecture. The platform delivers a complete investment analysis workflow - from market monitoring through AI prediction to simulated trade execution - through a single, accessible web interface that requires no software installation and incurs zero licensing costs.')

    # ========================================================================
    # CHAPTER 2: LITERATURE SURVEY (expanded with paper-by-paper analysis)
    # ========================================================================
    pdf.chapter_cover('2', 'Literature Survey')
    pdf.chapter_title = "Literature Survey"
    pdf.add_page()

    pdf.s1('2.1', 'Introduction to Survey')
    pdf.p('The goal of this survey is to bridge the gap between academic research in financial time-series forecasting and the practical engineering required to deploy such models within production web applications. While extensive research exists on the theoretical performance of various machine learning models for stock prediction, significantly less attention has been paid to the end-to-end integration of these models into user-facing platforms that provide actionable insights alongside raw predictions. This survey examines the evolution of stock prediction methodologies, evaluates current full-stack financial platforms, and identifies the architectural patterns that inform our design decisions.')

    pdf.s1('2.2', 'Why Survey?')
    pdf.p('The survey serves three primary purposes:')
    pdf.bp('Understanding why LSTM networks outperform traditional statistical models (ARIMA, GARCH) and classical ML approaches (SVM, Random Forest) for stock price time-series forecasting, particularly for capturing non-linear temporal dependencies in financial data.', 'Algorithm Selection')
    pdf.bp('Justifying the selection of a three-tier microservices architecture (React + Express + FastAPI) over monolithic alternatives, based on the principle of separation of concerns, independent scalability, and technology-appropriate deployment of each service component.', 'Architecture Validation')
    pdf.bp('Analyzing how existing platforms handle data normalization, sequence generation, prediction horizon configuration, and model evaluation metric presentation to establish best practices for our implementation.', 'Feature Engineering Baseline')

    pdf.add_page()
    pdf.s1('2.3', 'Evolution of Stock Price Prediction Models')
    pdf.p('The field of stock market prediction has undergone a significant transformation over the past decade, moving from traditional econometric models to deep learning architectures. This evolution can be categorized into three distinct generations:')

    pdf.s2('2.3.1', 'First Generation: Statistical Models')
    pdf.p('Traditional approaches such as ARIMA (AutoRegressive Integrated Moving Average) and GARCH (Generalized Autoregressive Conditional Heteroskedasticity) have been the foundation of financial time-series analysis for decades. ARIMA models capture linear dependencies in stationary time series through autoregressive and moving average components. GARCH extends this by modeling time-varying volatility, making it particularly useful for risk assessment.')
    pdf.p('However, research by Selvin et al. (2017) and others has demonstrated that these linear models fail to capture the non-linear, non-stationary dynamics inherent in stock market data. Financial markets are influenced by a complex interplay of macroeconomic indicators, investor sentiment, geopolitical events, and algorithmic trading patterns that cannot be adequately modeled through linear relationships alone.')

    pdf.s2('2.3.2', 'Second Generation: Classical Machine Learning')
    pdf.p('Models such as Support Vector Machines (SVM), Random Forest, and Gradient Boosting have shown improvement over statistical methods by capturing non-linear relationships in the data. Random Forest, in particular, has been effective for stock direction prediction (up/down classification) due to its ensemble approach and resistance to overfitting. However, these models treat each data point independently and cannot natively model the sequential dependencies that characterize financial time-series data. They require extensive manual feature engineering to capture temporal patterns, which limits their ability to discover novel predictive signals.')

    pdf.s2('2.3.3', 'Third Generation: Deep Learning')
    pdf.p('The introduction of Recurrent Neural Networks (RNNs), and specifically Long Short-Term Memory (LSTM) networks by Hochreiter and Schmidhuber (1997), revolutionized sequence modeling. LSTMs address the vanishing gradient problem inherent in standard RNNs through their gating mechanisms (input gate, forget gate, and output gate), enabling them to learn both short-term and long-term dependencies in price sequences. This makes them ideally suited for financial time-series forecasting where historical price patterns influence future movements.')

    pdf.add_page()
    pdf.s1('2.4', 'LSTM Networks for Financial Forecasting')
    pdf.p('Long Short-Term Memory networks have become the dominant architecture for stock price prediction in recent literature. The following subsections review key findings from the academic community:')

    pdf.s2('2.4.1', 'Architecture Superiority')
    pdf.p('Research by Fischer and Krauss (2018) conducted a comprehensive benchmark study comparing LSTM networks against traditional machine learning models including Random Forest, Logistic Regression, and standard feedforward neural networks. Their results demonstrated that LSTM networks consistently outperform all alternatives across multiple stock indices (S&P 500 constituents), achieving directional accuracy rates exceeding 55% - a statistically significant margin in efficient markets where random walk theory predicts 50% accuracy.')

    pdf.s2('2.4.2', 'Feature Selection and Input Design')
    pdf.p('Current research emphasizes the importance of selecting appropriate input features. While multi-feature models incorporating technical indicators (RSI, MACD, Bollinger Bands, moving averages) show marginal improvements in some studies, single-feature models using Close Price alone achieve competitive accuracy with significantly reduced computational overhead. Bao, Yue, and Rao (2017) demonstrated that a stacked autoencoder combined with LSTM using only price data achieved R-squared scores above 0.90 for major market indices, making single-feature models ideal for real-time web deployment where inference speed is critical.')

    pdf.s2('2.4.3', 'Stacked LSTM Architectures')
    pdf.p('Studies by Moghar and Hamiche (2020) validate the use of multiple stacked LSTM layers with decreasing unit counts (e.g., 128 to 64 to 32) and Dropout regularization to improve generalization and prevent overfitting on volatile financial data. The decreasing unit pattern creates a "funnel" architecture that progressively compresses the learned representations, forcing the network to extract increasingly abstract temporal features at each layer. Dropout rates between 0.1 and 0.3 have been shown to be optimal for financial time-series data.')

    pdf.add_page()
    pdf.s1('2.5', 'Full-Stack Financial Platforms')
    pdf.p('The integration of machine learning models into production web applications remains an active area of engineering research. Several architectural patterns have emerged:')
    pdf.bp('Modern financial platforms separate the ML inference engine from the user-facing application through RESTful APIs. This pattern, validated by frameworks like FastAPI and Flask, enables independent scaling of the prediction service based on demand. It also allows the ML model to be developed in Python (the lingua franca of data science) while the web application uses JavaScript/Node.js.', 'API-First Architecture')
    pdf.bp('The shift from HTTP polling to WebSocket-based real-time data delivery has been extensively documented. Socket.IO provides the reliability layer (automatic reconnection, fallback to long-polling) required for production financial data streaming. Studies show that WebSocket-based architectures reduce data latency by 60-80% compared to HTTP polling while consuming significantly less bandwidth.', 'Real-Time Data Delivery')
    pdf.bp('Microservices architecture allows each service to be developed, deployed, and scaled independently. In financial applications, this is particularly valuable because the ML inference service may require GPU resources while the web server needs high I/O throughput - fundamentally different hardware profiles.', 'Microservices Design')

    pdf.s1('2.6', 'Evaluation Metrics for Prediction Models')
    pdf.p('The selection of appropriate evaluation metrics is critical for validating stock prediction models and communicating confidence to end users:')
    pdf.bp('Root Mean Squared Error (RMSE) and Mean Absolute Error (MAE) quantify the average magnitude of prediction errors in the original price scale (e.g., dollars). RMSE penalizes larger deviations more heavily due to the squaring operation, making it sensitive to outliers. MAE provides a more intuitive measure of average prediction deviation.', 'RMSE and MAE')
    pdf.bp('The coefficient of determination (R-squared) measures the proportion of variance in the actual prices that is explained by the model predictions. An R-squared Score approaching 1.0 indicates that the model captures nearly all price variance. Values above 0.90 are considered excellent for financial forecasting.', 'R-squared Score')
    pdf.bp('Mean Absolute Percentage Error (MAPE) provides a scale-independent measure of accuracy, expressed as a percentage. This makes it the most intuitive metric for comparing predictions across stocks with different price ranges. A MAPE below 2% is generally considered excellent, while below 5% is considered good for financial forecasting.', 'MAPE')

    pdf.add_page()
    pdf.s1('2.7', 'Literature Comparison Table')
    pdf.p('The following table summarizes the key findings from the surveyed literature and positions our approach:')
    pdf.tbl(
        ['Study', 'Model', 'Features', 'Best Metric', 'Limitation'],
        [
            ['Selvin (2017)', 'CNN-LSTM', 'Close Price', 'Low RMSE', 'No web integration'],
            ['Fischer (2018)', 'LSTM', 'Multiple', '>55% direction', 'Batch only, no API'],
            ['Bao (2017)', 'SAE + LSTM', 'Close Price', 'R2 > 0.90', 'No real-time data'],
            ['Moghar (2020)', 'Stacked LSTM', 'Close Price', 'Low MAE', 'No user interface'],
            ['Roondiwala (2017)', 'LSTM', 'Close, Volume', 'R2 = 0.89', 'Single stock only'],
            ['Proposed: StockAI', '3-layer LSTM', 'Close Price', 'R2=0.92, MAPE=1%', 'Full-stack platform'],
        ],
        [30, 30, 28, 35, 40]
    )
    pdf.p('As demonstrated in Table 2.1, while existing academic studies achieve strong prediction accuracy, none of them integrate their models into a complete, user-facing web application with real-time data, paper trading, and transparent model metrics. Our proposed system fills this critical gap by combining proven LSTM architecture with modern full-stack web engineering.')

    # ========================================================================
    # CHAPTER 3: PROJECT MANAGEMENT (expanded)
    # ========================================================================
    pdf.chapter_cover('3', 'Project Management', ['3.1 Project Planning Objectives', '3.2 Project Scheduling', '3.3 Risk Management'])
    pdf.chapter_title = "Project Management"
    pdf.add_page()

    pdf.s1('3.1', 'PROJECT PLANNING OBJECTIVES')
    pdf.p('The primary objective of the planning phase was to coordinate the parallel development of three independent microservices - the React frontend, the Node.js/Express backend, and the Python FastAPI ML service - while ensuring seamless API contract compliance between them. The planning focused on:')
    pdf.bp('Defining clear API boundaries between the frontend, backend, and ML service to enable independent development and testing of each tier.', 'Scope Management')
    pdf.bp('Ensuring all development tools, cloud services, and data sources (Yahoo Finance API) were configured and accessible within the 8th-semester timeline.', 'Resource Allocation')

    pdf.s2('3.1.1', 'Software Scope')
    pdf.p('The software scope involves the development and integration of four distinct architectural modules:')
    pdf.ni(1, 'A React 18 single-page application with 10+ interactive views, Recharts-based data visualization, Axios HTTP client with JWT interceptors, and Socket.IO real-time data streaming.', 'The Frontend Application')
    pdf.ni(2, 'A Node.js/Express server implementing RESTful endpoints for authentication (register/login), stock data retrieval with 60-second caching, watchlist CRUD operations, paper trading execution, and ML service proxying.', 'The API Gateway')
    pdf.ni(3, 'A Python FastAPI service hosting a TensorFlow/Keras LSTM model with endpoints for on-demand prediction, model training, and prediction history retrieval.', 'The AI Prediction Engine')
    pdf.ni(4, 'MongoDB database with Mongoose ODM schemas for Users (with bcrypt-hashed passwords), Stocks (with historical data arrays), and Watchlists (with per-user stock tracking, max 50 symbols).', 'The Data Persistence Layer')

    pdf.s2('3.1.2', 'Resources')
    pdf.bp('The project was executed by a single final-year B.Tech CSE student, responsible for all aspects of design, development, testing, and documentation.', 'Human Resource')
    pdf.bp('The project utilized open-source libraries including React 18, Express.js, TensorFlow/Keras, FastAPI, Mongoose, Recharts, Socket.IO, and yfinance. No proprietary software licenses were required.', 'Reusable Software Resources')
    pdf.bp('A local development environment was configured with Node.js (v18+), Python 3.10+, MongoDB Community Server, and modern web browsers (Chrome, Firefox) for cross-platform testing.', 'Environment Resource')

    pdf.add_page()
    pdf.s2('3.1.3', 'Project Development Approach')
    pdf.p('An Agile Methodology was adopted, allowing for iterative development and testing of individual microservices. This approach was essential because the LSTM model hyperparameters (sequence length, number of layers, dropout rate, learning rate) required multiple tuning iterations to achieve optimal prediction accuracy. Sprint cycles of two weeks were used, with each sprint delivering a functional increment of the platform.')
    pdf.p('The Agile approach also facilitated early identification of integration issues between the three microservices. By deploying mock APIs during the first sprint, the frontend could be developed against stable contracts while the backend and ML service implementations were finalized in parallel.')

    pdf.s1('3.2', 'PROJECT SCHEDULING')
    pdf.p('The complexity of integrating deep learning inference with real-time web data delivery required a structured, phase-gate scheduling approach. A 16-week timeline was established, ensuring that each microservice was independently verified before full-stack integration testing.')

    pdf.s2('3.2.1', 'Basic Principal')
    pdf.bp('Developing the LSTM model in a Python environment while simultaneously building the Express API routes and React UI components.', 'Parallelism')
    pdf.bp('Defining the REST API contracts (request/response JSON schemas) before implementing either the backend or frontend, ensuring both could be developed independently against mock data.', 'API-First Design')
    pdf.bp('A 2-week "Contingency Buffer" was placed at the end of the integration phase to account for potential issues in the LSTM model accuracy or WebSocket real-time data synchronization.', 'Buffer Allocation')

    pdf.s2('3.2.2', 'Compartmentalization')
    pdf.p('To manage the full-stack development requirements, the project was compartmentalized into five distinct work packages. This modular approach allowed isolation of backend API challenges from frontend UI development and ML model tuning.')
    pdf.s3('', 'Module 1: Database Design and Backend API')
    pdf.p('This module focused on the data layer and API gateway. Key components included designing MongoDB schemas for Users, Stocks, and Watchlists using Mongoose ODM, implementing Express.js routes for authentication, stock data retrieval, and watchlist management, and configuring the stock data service with node-cache (60-second TTL) to minimize redundant API calls.')
    pdf.s3('', 'Module 2: Authentication and Security Layer')
    pdf.p('This module was dedicated to implementing the security architecture. Key deliverables included JWT token generation (7-day expiry) with jsonwebtoken library, bcrypt password hashing (12 salt rounds), rate limiting (100 requests/15 minutes), Helmet HTTP header hardening, and CORS configuration.')
    pdf.s3('', 'Module 3: The LSTM Prediction Engine')
    pdf.p('This module dealt with the core AI capability of the platform. The LSTM architecture features three stacked recurrent layers (128, 64, 32 units) with Dropout (0.2), trained on 2-year historical data from Yahoo Finance with a sliding window of 60 time steps. Trained models are saved in Keras .keras format with corresponding MinMaxScaler objects serialized via joblib.')
    pdf.s3('', 'Module 4: Frontend Application Development')
    pdf.p('This module focused on building React 18 components for the Dashboard, Stock Detail page, AI Predictions page, Watchlist management, Paper Trading interface, and Learning Center. Real-time integration was achieved through Socket.IO client connections for live stock price updates without page refresh.')
    pdf.s3('', 'Module 5: Integration and Full-Stack Testing')
    pdf.p('The final module integrated all three microservices. This involved configuring the Express backend to proxy prediction requests to the FastAPI service at port 8000, implementing graceful fallbacks with mock data when the ML service is unavailable, and conducting end-to-end testing across the complete user journey.')

    pdf.add_page()
    pdf.s2('3.2.3', 'Work Breakdown Structure')
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Level 1: Backend API & Database', 0, 1, 'L')
    pdf.set_font('Times', '', 11)
    pdf.p('  1.1 MongoDB Schema Design (User, Stock, Watchlist)\n  1.2 Express Route Implementation (Auth, Stocks, Predictions, Watchlist, News)\n  1.3 Stock Data Caching Service (node-cache, 60s TTL)')
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Level 2: Security & Authentication', 0, 1, 'L')
    pdf.set_font('Times', '', 11)
    pdf.p('  2.1 JWT Token Generation and Middleware\n  2.2 Bcrypt Password Hashing and Rate Limiting\n  2.3 Helmet Security Headers and CORS')
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Level 3: ML Model Development', 0, 1, 'L')
    pdf.set_font('Times', '', 11)
    pdf.p('  3.1 LSTM Architecture Design (128-64-32 stacked layers)\n  3.2 Data Pipeline (yfinance - MinMaxScaler - Sliding Window)\n  3.3 Model Training, Evaluation (RMSE, MAE, R-squared, MAPE)\n  3.4 FastAPI Endpoint Development')
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Level 4: Frontend Application', 0, 1, 'L')
    pdf.set_font('Times', '', 11)
    pdf.p('  4.1 React Component Development (10+ views)\n  4.2 Recharts Integration and Socket.IO WebSocket\n  4.3 Context API State Management (Auth, Theme, Portfolio)')
    pdf.set_font('Times', 'B', 11)
    pdf.cell(0, 7, 'Level 5: Testing & Documentation', 0, 1, 'L')
    pdf.set_font('Times', '', 11)
    pdf.p('  5.1 End-to-End Integration Testing\n  5.2 Final Thesis Compilation and Formatting')

    pdf.s2('3.2.4', 'Project Organization')
    pdf.p('Although executed by a single developer, the project required managing four distinct technical domains. The following functional roles were self-assigned across development sprints:')
    pdf.bp('Responsible for the Express.js API server, MongoDB schema design, authentication middleware, and stock data caching service.', 'Backend & Database Engineer')
    pdf.bp('Focused on the LSTM model architecture, hyperparameter tuning, yfinance data pipeline, and FastAPI service deployment. This role involved iterative experimentation with sequence lengths (30, 60, 90), dropout rates (0.1-0.3), and layer configurations to optimize prediction accuracy.', 'ML & Data Scientist')
    pdf.bp('Tasked with building the React 18 SPA, implementing React Router v6 navigation, integrating Recharts visualizations, and managing global state through React Context API (AuthContext, ThemeContext, PortfolioContext).', 'Frontend Developer')
    pdf.bp('Responsible for configuring the three-service startup sequence, managing environment variables, ensuring API proxy configuration between backend (port 5000) and ML service (port 8000), and conducting cross-browser compatibility testing.', 'DevOps & Integration')

    pdf.add_page()
    pdf.s2('3.2.5', 'Time Allocation (Timeline Chart)')
    pdf.tbl(
        ['Phase', 'Milestone', 'Duration', 'Key Deliverable'],
        [
            ['I', 'Requirements & Architecture', 'Weeks 1-2', 'API Contracts & DB Schemas'],
            ['II', 'Backend API & Authentication', 'Weeks 3-5', 'Functional REST API with JWT'],
            ['III', 'LSTM Model Development', 'Weeks 6-8', 'Trained Model (R2 > 0.90)'],
            ['IV', 'Frontend App Development', 'Weeks 9-11', 'Complete React SPA (10+ views)'],
            ['V', 'Integration & Tuning', 'Weeks 12-14', 'Full-Stack Platform'],
            ['VI', 'Evaluation & Documentation', 'Weeks 15-16', 'Thesis and Project Demo'],
        ],
        [15, 55, 25, 55]
    )

    pdf.s1('3.3', 'RISK MANAGEMENT')
    pdf.p('Risk management is a continuous process in this project, ensuring that technical challenges in deep learning model accuracy, API reliability, or frontend performance do not compromise the quality of the delivered platform. Risks are categorized into Technical, Data, Performance, and Operational risks.')

    pdf.s2('3.3.1', 'Risk Identification')
    pdf.bp('The LSTM model might overfit on historical training data and fail to generalize to recent market conditions, producing unreliable predictions.', 'Model Accuracy Risk')
    pdf.bp('The platform depends on Yahoo Finance (yfinance) as its primary data source. API rate limits, service outages, or data format changes could disrupt the prediction pipeline.', 'Data Source Dependency')
    pdf.bp('WebSocket connections for live price updates might introduce latency or connection drops under high user concurrency, degrading the user experience.', 'Real-Time Performance')
    pdf.bp('The backend dependency on the ML service (port 8000) creates a potential point of failure if the Python service crashes or becomes unresponsive.', 'Cross-Service Communication')

    pdf.s2('3.3.2', 'Risk Projection and Mitigation')
    pdf.bp('The backend implements mock data fallback mechanisms. If the ML service is unavailable, the system generates approximate predictions based on historical averages, ensuring the platform remains functional and demonstrable at all times.', 'Graceful Degradation')
    pdf.bp('The LSTM training process employs Early Stopping with a patience of 10 epochs, automatically halting training when validation loss plateaus to prevent overfitting. A 10% validation split is used during training.', 'Early Stopping')
    pdf.bp('Trained models are persisted to disk (.keras format) and cached in memory using an in-memory predictor cache, eliminating the need for retraining on every prediction request and reducing inference latency to milliseconds.', 'Model Caching')
    pdf.bp('Express-rate-limit throttles API requests to prevent abuse and ensure fair resource distribution across concurrent users.', 'Rate Limiting')

    # ========================================================================
    # CHAPTER 4: SYSTEM REQUIREMENTS (expanded)
    # ========================================================================
    pdf.chapter_cover('4', 'System Requirements', ['4.1 Introduction', '4.2 Hardware Specifications', '4.3 Software Specifications'])
    pdf.chapter_title = "System Requirements"
    pdf.add_page()

    pdf.s1('4.1', 'INTRODUCTION')
    pdf.p('The system requirements for this project are categorized into Hardware and Software specifications. The primary challenge was selecting a technology stack capable of handling the computational intensity of LSTM neural network training and inference, the I/O throughput of real-time WebSocket data streaming, and the concurrent database operations of a multi-user web application - all while maintaining responsive frontend performance.')

    pdf.s1('4.2', 'HARDWARE SPECIFICATIONS')
    pdf.p('The hardware architecture supports a three-tier microservices deployment, with each service designed to run independently on commodity hardware.')
    pdf.s2('4.2.1', 'Development Workstation')
    pdf.bp('Apple M-series or Intel Core i5/i7 (multi-core required for parallel service execution).', 'Processor')
    pdf.bp('8 GB RAM minimum (16 GB recommended for concurrent LSTM training and frontend development). During LSTM training, TensorFlow allocates significant GPU/CPU memory for gradient computation.', 'Memory')
    pdf.bp('256 GB SSD (required for fast MongoDB read/write operations, model file I/O, and Node.js module storage).', 'Storage')
    pdf.bp('Broadband internet connection (required for real-time Yahoo Finance data fetching and npm/pip package installation).', 'Network')
    pdf.s2('4.2.2', 'Server Requirements (Production)')
    pdf.bp('Minimum 4 GB RAM with GPU access (NVIDIA CUDA-compatible) for accelerated LSTM training. CPU-only inference is supported but slower.', 'ML Service Host')
    pdf.bp('2 GB RAM with Node.js v18+ runtime.', 'Backend Host')
    pdf.bp('MongoDB Atlas (cloud) or MongoDB Community Server (self-hosted) with 10 GB initial storage allocation.', 'Database')

    pdf.add_page()
    pdf.s1('4.3', 'SOFTWARE SPECIFICATIONS')
    pdf.p('The software architecture is built upon a modern JavaScript/Python hybrid stack that bridges frontend interactivity with backend intelligence. Each software component was selected based on its ability to handle the specific requirements of its tier while maintaining compatibility with the overall microservices architecture.')

    pdf.s2('4.3.1', 'Frontend Stack')
    pdf.bp('Core UI framework with functional components and hooks for state management.', 'React 18.2.0')
    pdf.bp('Client-side routing for SPA navigation across 10+ views.', 'React Router v6')
    pdf.bp('Composable charting library for stock price and prediction visualization with tooltips, responsive sizing, and area charts.', 'Recharts 2.10.3')
    pdf.bp('Promise-based HTTP client with JWT interceptor for authenticated API calls. Interceptors automatically attach Bearer tokens and handle 401 responses.', 'Axios 1.6.2')
    pdf.bp('WebSocket client for real-time stock price subscriptions with automatic reconnection.', 'Socket.IO Client 4.7.2')
    pdf.bp('Non-blocking toast notifications for trade confirmations, error alerts, and system messages.', 'React Toastify')
    pdf.bp('Lightweight date utility library for formatting timestamps in transaction history and prediction tables.', 'date-fns 2.30.0')
    pdf.bp('Icon library providing visual indicators for navigation, market trends, and actions.', 'React Icons')

    pdf.s2('4.3.2', 'Backend Stack')
    pdf.bp('Minimal web framework for REST API routing and middleware composition.', 'Express.js 4.18.2')
    pdf.bp('MongoDB ODM for schema definition, validation, and middleware hooks.', 'Mongoose 7.6.3')
    pdf.bp('JWT token generation and verification with configurable expiry (7 days).', 'jsonwebtoken 9.0.2')
    pdf.bp('Password hashing library implementing the bcrypt algorithm with 12 salt rounds.', 'bcryptjs')
    pdf.bp('WebSocket server for real-time bidirectional communication with room-based broadcasting.', 'Socket.IO 4.7.2')
    pdf.bp('HTTP security header middleware (Content-Security-Policy, X-Frame-Options, etc.).', 'Helmet 7.1.0')
    pdf.bp('API request throttling at 100 requests per 15-minute window per IP address.', 'express-rate-limit 7.1.4')
    pdf.bp('Input sanitization and validation middleware for request body/query/params.', 'express-validator 7.0.1')
    pdf.bp('In-memory key-value cache with configurable TTL (60 seconds for stock data).', 'node-cache 5.1.2')
    pdf.bp('Email service for account verification and notifications (optional).', 'Nodemailer 6.9.7')

    pdf.add_page()
    pdf.s2('4.3.3', 'Machine Learning Stack')
    pdf.bp('High-performance async web framework for ML inference API with automatic OpenAPI documentation.', 'FastAPI 0.104.1')
    pdf.bp('ASGI server for FastAPI deployment with hot-reload support.', 'Uvicorn 0.24.0')
    pdf.bp('Deep learning framework for LSTM model construction, training, and inference.', 'TensorFlow 2.18.0+')
    pdf.bp('MinMaxScaler normalization and train/test splitting utilities.', 'scikit-learn 1.6.0+')
    pdf.bp('DataFrame manipulation for time-series data processing and feature engineering.', 'pandas 2.2.3+')
    pdf.bp('Numerical computing for array operations and mathematical calculations.', 'numpy 2.1.0+')
    pdf.bp('Yahoo Finance API wrapper for fetching historical OHLCV data with configurable date ranges and intervals.', 'yfinance 0.2.33+')
    pdf.bp('Serialization of fitted MinMaxScaler objects for inference without refitting.', 'joblib 1.3.2')
    pdf.bp('Settings management with type validation for API configuration.', 'pydantic 2.10.0+')

    pdf.s2('4.3.4', 'Database Management')
    pdf.bp('MongoDB is a document-oriented NoSQL database selected for its flexible schema design. Unlike rigid relational databases, MongoDB document model naturally maps to the JSON-based data structures used throughout the JavaScript/Node.js ecosystem. It provides horizontal scalability through sharding and high availability through replica sets.', 'Database Engine (MongoDB)')
    pdf.bp('Mongoose provides schema-based validation, type casting, query building, and middleware hooks for MongoDB operations. Three primary schemas are defined: User (with bcrypt-hashed passwords and role-based access), Stock (with embedded historical data arrays), and Watchlist (with per-user stock symbol tracking, max 50 entries).', 'ODM Library (Mongoose 7.6.3)')
    pdf.bp('MongoDB Compass provides a GUI for inspecting collections, verifying document structures, monitoring query performance, and debugging data integrity issues during development.', 'Administration Tool (MongoDB Compass)')

    # ========================================================================
    # CHAPTER 5: SYSTEM ANALYSIS (expanded)
    # ========================================================================
    pdf.chapter_cover('5', 'System Analysis', ['5.1 Study of Current System', '5.2 Problems in Current System', '5.3 Requirement of New System', '5.4 Identification of Research Gaps', '5.5 Proposed System Rationale', '5.6 Feasibility Study', '5.7 Features of New System'])
    pdf.chapter_title = "System Analysis"
    pdf.add_page()

    pdf.s1('5.1', 'STUDY OF CURRENT SYSTEM')
    pdf.p('The current landscape of stock market analysis platforms is dominated by two categories: free consumer-grade applications and premium institutional platforms. Consumer applications such as Yahoo Finance, Google Finance, and TradingView provide real-time stock data, historical charts, and basic technical indicators. However, these platforms treat users as passive data consumers, presenting raw numbers without predictive intelligence.')
    pdf.p('On the institutional side, platforms like Bloomberg Terminal ($24,000/year), Refinitiv Eikon ($22,000/year), and FactSet ($12,000/year) provide AI-driven analytics, quantitative models, and predictive algorithms. These platforms are designed for professional traders and hedge funds with deep technical expertise and significant financial resources.')
    pdf.p('Between these two extremes, a small number of "prosumer" platforms exist (e.g., TradingView Pro, Seeking Alpha Premium) that offer limited predictive features for $15-50/month. However, these typically rely on rule-based technical analysis rather than machine learning, and they do not provide transparent model evaluation metrics.')

    pdf.s1('5.2', 'PROBLEMS IN CURRENT SYSTEM')
    pdf.p('Through our research and competitive analysis, we identified several critical gaps in the current ecosystem:')
    pdf.ni(1, 'AI-powered stock prediction models exist in academic research but are rarely integrated into user-friendly web applications. Retail investors must choose between expensive institutional platforms or building their own ML pipelines - both impractical for the average user.', 'The Prediction Accessibility Gap')
    pdf.ni(2, 'Current free platforms require users to switch between multiple tools - one for real-time quotes, another for charting, a third for news, and a separate spreadsheet for portfolio tracking. This fragmentation increases cognitive load and slows decision-making during time-critical market events.', 'Fragmented User Experience')
    pdf.ni(3, 'Platforms that do offer AI predictions rarely expose the underlying model metrics (RMSE, MAE, R-squared, MAPE). Users receive a predicted price without understanding the model confidence level or historical accuracy, making it impossible to calibrate trust in the prediction.', 'The Transparency Deficit')
    pdf.ni(4, 'Most stock platforms connect directly to real brokerage accounts. New investors have no way to practice trading strategies without risking actual capital, creating a significant barrier to entry for financial market participation.', 'No Risk-Free Practice Environment')

    pdf.add_page()
    pdf.s1('5.3', 'REQUIREMENT OF NEW SYSTEM')
    pdf.p('To overcome the limitations mentioned above, the proposed system is designed around the principles of Integrated Intelligence and Transparent AI. The requirements are:')
    pdf.bp('All functionality - real-time data, AI predictions, charting, watchlists, trading, news, and education - must be accessible through a single web interface without requiring external tools or platform switching.', 'Unified Platform')
    pdf.bp('Every AI prediction must be accompanied by comprehensive evaluation metrics (RMSE, MAE, R-squared, MAPE) and an AI Confidence score, enabling users to make informed decisions about the reliability of the forecast.', 'Transparent Model Metrics')
    pdf.bp('The platform must include a simulated trading engine with realistic buy/sell mechanics, portfolio tracking, and P&L calculation to enable risk-free practice.', 'Paper Trading Integration')
    pdf.bp('The platform must run entirely in a web browser, require no software installation, and support responsive layouts for desktop and tablet devices.', 'Accessible Architecture')

    pdf.p('COMPARISON TABLES:')
    pdf.tbl(
        ['Platform', 'Cost', 'AI Predictions', 'Transparency', 'Paper Trading'],
        [
            ['Bloomberg Terminal', '$24,000/yr', 'Yes', 'Low', 'No'],
            ['Yahoo Finance', 'Free', 'No', 'N/A', 'No'],
            ['TradingView', 'Freemium', 'Limited', 'Low', 'Yes (limited)'],
            ['Proposed: StockAI', 'Free', 'Yes (LSTM)', 'High (metrics)', 'Yes (full)'],
        ],
        [40, 28, 32, 35, 30]
    )
    pdf.tbl(
        ['ML Methodology', 'Model Type', 'Training Data', 'Inference Speed'],
        [
            ['Traditional (ARIMA)', 'Statistical', 'Limited features', 'Instant'],
            ['Random Forest', 'Ensemble', 'Tabular features', 'Fast'],
            ['Federated Learning', 'Distributed DL', 'Privacy-preserved', 'Slow'],
            ['Proposed: LSTM', 'Deep Learning', 'Time-series', 'Medium (cached)'],
        ],
        [45, 35, 40, 35]
    )

    pdf.add_page()
    pdf.s1('5.4', 'IDENTIFICATION OF RESEARCH GAPS')
    pdf.s2('5.4.1', 'The Prediction Integration Gap')
    pdf.p('Academic research has produced numerous high-accuracy stock prediction models, but these remain trapped in Jupyter notebooks and research papers. Converting a trained LSTM model into a production-ready API service that can handle concurrent prediction requests requires significant DevOps expertise beyond the scope of data science. There is a critical disconnect between model development (Python/TensorFlow) and model deployment (web service).')

    pdf.s2('5.4.2', 'The Model Transparency Gap')
    pdf.p('Existing platforms that offer AI predictions treat them as opaque "black box" outputs. Users receive a predicted price or direction without understanding why the model generated that prediction or how confident it is. While explainable AI (XAI) research has advanced significantly, its integration into consumer financial products remains minimal. Users need quantifiable confidence metrics, not just point predictions.')

    pdf.s2('5.4.3', 'The Financial Literacy Gap')
    pdf.p('Stock market participation requires foundational knowledge that many new investors lack. Platforms assume users understand terms like "volume," "RMSE," "candlestick," and "market cap," creating a steep learning curve. Current platforms separate the trading experience from educational content - learning and doing happen in different environments.')

    pdf.s1('5.5', 'PROPOSED SYSTEM RATIONALE')
    pdf.p('To bridge these identified gaps, the proposed system introduces three core technical innovations:')
    pdf.ni(1, 'By deploying a pre-trained LSTM neural network as a standalone FastAPI microservice, the platform achieves on-demand stock price forecasting without coupling the ML model to the web application lifecycle.', 'LSTM-Powered Prediction API')
    pdf.ni(2, 'Every prediction is accompanied by a comprehensive metrics panel (RMSE: 4.1308, MAE: 1.1950, R-squared: 0.9159, MAPE: 1.02%) and an AI Confidence bar (92%), enabling users to calibrate their trust in the forecast.', 'Transparent AI Dashboard')
    pdf.ni(3, 'Users can immediately act on AI predictions through a simulated trading system that tracks Total Trades, Total Bought, Total Sold, and Net P&L - bridging the gap between prediction and practice.', 'Integrated Paper Trading')

    pdf.add_page()
    pdf.s1('5.6', 'FEASIBILITY STUDY')
    pdf.s2('', 'Technical Feasibility')
    pdf.p('The project is technically feasible because TensorFlow/Keras provides a mature, well-documented framework for LSTM model construction. The availability of Yahoo Finance data through the yfinance library eliminates the need for expensive market data subscriptions. React 18 and Express.js are industry-standard frameworks with extensive community support and proven production reliability.')
    pdf.s2('', 'Operational Feasibility')
    pdf.p('The system is highly operational as it requires minimal configuration once deployed. The ML service automatically trains and caches models on first prediction request. The backend gracefully falls back to mock data when external services are unavailable. The platform supports both dark and light themes for user accessibility across different viewing environments.')
    pdf.s2('', 'Economical Feasibility')
    pdf.p('The system is built entirely on open-source technologies (React, Express, TensorFlow, FastAPI, MongoDB Community Edition) with zero licensing costs. The only operational costs are server hosting and domain registration, which can be minimized through free-tier cloud services (MongoDB Atlas free tier, Render free tier, Vercel free tier).')
    pdf.s2('', 'Schedule Feasibility')
    pdf.p('By following the 16-week timeline established in Chapter 3, the project was completed in distinct phases (Backend - ML - Frontend - Integration), ensuring all milestones were met before the final thesis submission.')

    pdf.s1('5.7', 'FEATURES OF NEW SYSTEM')
    pdf.bp('Live market indices (S&P 500, NASDAQ, Dow Jones) with auto-refreshing stock quotes, Top Gainers/Losers panels, Quick Access sidebar, and interactive price charts.', 'Real-Time Market Dashboard')
    pdf.bp('LSTM neural network predictions with configurable horizons (1-365 days), interactive Actual vs. Predicted overlay charts, comprehensive model metrics, and predicted price tables.', 'AI-Powered Predictions')
    pdf.bp('Simulated buy/sell execution with quantity selection, real-time portfolio tracking (Total Trades, Total Bought, Total Sold, Net P&L), and complete transaction history with timestamps.', 'Paper Trading Simulator')
    pdf.bp('Authenticated users can track up to 50 stocks with real-time price updates and percentage change indicators.', 'Personalized Watchlist')
    pdf.bp('Categorized recommendations (Top Gainers, Top Losers, Most Active, Best Value) with confidence percentages and "Strong Buy"/"Buy"/"Hold" labels.', 'AI Stock Recommendations')
    pdf.bp('Recharts-powered price charts with 1W, 1M, 3M, 6M, and 1Y interval selection on Dashboard and Stock Detail pages.', 'Interactive Charting')
    pdf.bp('Searchable educational content covering platform usage guides and stock market fundamentals.', 'Learning Center')
    pdf.bp('User-selectable dark/light UI theme for comfortable viewing in any environment.', 'Dark/Light Theme')

    # ========================================================================
    # CHAPTER 6: DETAIL DESCRIPTION (expanded)
    # ========================================================================
    pdf.chapter_cover('6', 'Detail Description', ['6.1 System Architecture and Module Overview', '6.2 Module Description (Actor-Based Logic)', '6.3 Database Design and Persistence Logic'])
    pdf.chapter_title = "Detail Description"
    pdf.add_page()

    pdf.s1('6.1', 'SYSTEM ARCHITECTURE AND MODULE OVERVIEW')
    pdf.p('The architecture of the proposed StockAI platform operates through a continuous, four-stage data pipeline, ensuring that market data flows from external sources through AI processing to the end user:')
    pdf.ni(1, 'The Node.js backend fetches real-time and historical stock data from external market data providers (Yahoo Finance). Stock quotes are cached in-memory using node-cache with a 60-second TTL to minimize redundant API calls while maintaining data freshness. The caching layer acts as a buffer between the external API rate limits and the potentially high volume of user requests.', 'Data Ingestion & Caching')
    pdf.ni(2, 'When a user requests a prediction, the backend proxies the request to the Python FastAPI ML service at port 8000. The ML service checks its in-memory predictor cache for a pre-trained model for the requested stock symbol. If no cached model exists, it fetches 2 years of historical data from Yahoo Finance, preprocesses it through the data pipeline (normalization, sequence generation), trains the LSTM model, and generates predictions using autoregressive forecasting.', 'AI Inference (LSTM)')
    pdf.ni(3, 'The Socket.IO WebSocket layer maintains persistent bidirectional connections between the backend and connected frontend clients. Stock price updates are broadcast to subscribed clients in per-symbol "rooms," enabling real-time dashboard updates without HTTP polling. This significantly reduces server load compared to polling-based architectures.', 'Real-Time Communication')
    pdf.ni(4, 'User actions (registration, login, watchlist management, paper trades) are processed through JWT-authenticated API endpoints and persisted to MongoDB via Mongoose ODM. Trade history and portfolio state are maintained per-user for persistent access across sessions and devices.', 'User Interaction & Persistence')

    pdf.fig_ref('6.1', 'System Architecture Diagram')

    pdf.add_page()
    pdf.s1('6.2', 'MODULE DESCRIPTION (ACTOR-BASED LOGIC)')
    pdf.p('According to the system design, the architecture is divided into three primary functional modules representing the "Actors" within the platform. Each module has distinct responsibilities, interfaces, and failure domains.')

    pdf.s2('6.2.1', 'The User Module')
    pdf.p('In this platform, the "User" represents the retail investor interacting with the web application through a modern browser.')
    pdf.bp('The user accesses the Dashboard page to view real-time market indices (S&P 500, NASDAQ, Dow Jones), browse the All Stocks table with price, change, volume data, and identify Top Gainers and Top Losers. The Quick Access sidebar provides one-click navigation to any tracked stock.', 'Market Monitoring')
    pdf.bp('The user navigates to the Predictions page, selects a stock symbol from quick-access buttons (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA) or enters a custom symbol. Clicking "Generate Prediction" triggers the LSTM model, and the system returns an interactive Actual vs. Predicted chart with model metrics (RMSE, MAE, R-squared, MAPE), an AI Confidence bar, Model Information panel, and a tabular view of predicted prices for the next 30 days.', 'AI Prediction Request')
    pdf.bp('Authenticated users can execute simulated Buy/Sell trades from the Stock Detail page by clicking the Buy or Sell button and specifying quantity. The system records the transaction with a precise timestamp, calculates the total cost, and updates the portfolio balance. The Transaction History page displays complete trade logs with date/time, type (BUY/SELL), symbol, quantity, price, total, and running balance.', 'Paper Trading')
    pdf.bp('Users add/remove stocks to a personalized watchlist (max 50 symbols) for quick price monitoring with real-time percentage change indicators. Each watchlist card shows the current price and daily change percentage with color coding (green for gains, red for losses).', 'Watchlist Management')

    pdf.add_page()
    pdf.s2('6.2.2', 'The Backend API Module')
    pdf.p('The backend module represents the central orchestration layer, hosted on the Express.js server at port 5000.')
    pdf.bp('All frontend requests are routed through the Express API, which handles authentication verification via JWT middleware, input validation and sanitization, rate limiting, and request proxying to the ML service.', 'API Gateway')
    pdf.bp('The stock data service implements node-cache with a 60-second TTL, dramatically reducing the number of external API calls. When a stock quote is requested, the service first checks the cache. Only on cache miss does it fetch fresh data from the external provider.', 'Data Caching')
    pdf.bp('The Socket.IO server manages per-symbol subscription rooms. When a client subscribes to "AAPL," they join the AAPL room and receive targeted price updates without receiving data for other symbols. This room-based architecture scales efficiently with the number of tracked symbols.', 'WebSocket Management')
    pdf.bp('When external data sources or the ML service are unavailable, the backend seamlessly switches to mock data generation, ensuring the platform remains functional and demonstrable at all times. Mock predictions use historical price averages with random walk simulation.', 'Mock Data Fallback')

    pdf.s2('6.2.3', 'The ML Prediction Module')
    pdf.p('The ML Prediction Module provides the core artificial intelligence capability of the platform, hosted as a standalone Python FastAPI service at port 8000.')
    pdf.bp('The StockPredictor class implements a three-layer stacked LSTM network. Layer 1 contains 128 LSTM units with return_sequences=True, followed by Dropout(0.2). Layer 2 contains 64 LSTM units with return_sequences=True, followed by Dropout(0.2). Layer 3 contains 32 LSTM units with return_sequences=False, followed by Dropout(0.2). This is followed by a Dense(16, activation="relu") layer and a Dense(1) output layer. The model is compiled with Adam optimizer (learning_rate=0.001) and Mean Squared Error loss function.', 'LSTM Architecture')
    pdf.bp('Historical Close prices are normalized to the [0, 1] range using MinMaxScaler. Sequences are generated using a sliding window of 60 time steps - each training sample consists of 60 consecutive close prices as input and the next day close price as the target. The data is split 80/20 (train/test) while preserving temporal ordering to prevent data leakage.', 'Data Preprocessing')
    pdf.bp('For multi-day forecasting, the model uses autoregressive prediction: each predicted day becomes the last element of the input sequence for the next prediction. This allows generating forecasts for any horizon up to 365 days. Business day awareness accounts for weekends and holidays when generating prediction dates.', 'Autoregressive Prediction')
    pdf.bp('Each prediction response includes RMSE, MAE, R-squared Score, and MAPE, calculated on the test set. An AI Confidence percentage is derived from the R-squared Score (e.g., R-squared of 0.9159 yields 92% confidence) to provide an intuitive trust indicator for non-technical users.', 'Model Metrics')
    pdf.bp('Trained models are saved as .keras files with corresponding .pkl scaler objects in the models/ directory. An in-memory cache (Python dictionary) prevents redundant model loading across prediction requests for the same symbol, reducing inference latency from seconds to milliseconds.', 'Model Persistence')

    pdf.add_page()
    pdf.s1('6.3', 'DATABASE DESIGN AND PERSISTENCE LOGIC')
    pdf.p('A critical component of the platform is the MongoDB database, managed through Mongoose ODM with strictly defined schemas that enforce data integrity at the application level.')

    pdf.s2('6.3.1', 'Database Schema')
    pdf.p('The architecture relies on three primary collections:')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 1: Users (The Identity Registry)', 0, 1, 'L')
    pdf.ln(2)
    pdf.set_font('Times', '', 12)
    pdf.bp('_id (ObjectId): Auto-generated unique identifier')
    pdf.bp('name (String, max 100 chars): User display name')
    pdf.bp('email (String, unique, validated): Login credential with regex email validation')
    pdf.bp('password (String, bcrypt-hashed): 12 salt rounds ensure resistance to brute-force attacks')
    pdf.bp('isVerified (Boolean, default: false): Email verification status for account activation')
    pdf.bp('otp, otpExpiry: One-time password fields for email verification flow')
    pdf.bp('role (Enum: ["user", "admin"], default: "user"): Role-based access control')
    pdf.bp('createdAt (Date): Account creation timestamp, auto-generated')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 2: Stocks (The Market Data Cache)', 0, 1, 'L')
    pdf.ln(2)
    pdf.set_font('Times', '', 12)
    pdf.bp('symbol (String, uppercase, indexed): Ticker symbol (e.g., "AAPL", "GOOGL")')
    pdf.bp('name (String): Full company name')
    pdf.bp('price, change, changePercent (Number): Current market data')
    pdf.bp('volume, high, low, open, previousClose (Number): Daily trading metrics')
    pdf.bp('marketCap (Number): Total market capitalization')
    pdf.bp('historicalData (Array of {date, open, high, low, close, volume}): Embedded time-series OHLCV data')
    pdf.bp('lastUpdated (Date, auto-updated on save): Cache freshness indicator')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 3: Watchlists (The User Preference Store)', 0, 1, 'L')
    pdf.ln(2)
    pdf.set_font('Times', '', 12)
    pdf.bp('user (ObjectId, ref: "User", unique): One watchlist per user, enforced by unique constraint')
    pdf.bp('stocks (Array of {symbol, addedAt}): Tracked symbols with addition timestamps, max 50 entries')
    pdf.bp('createdAt (Date): Watchlist creation timestamp')

    pdf.add_page()
    pdf.s2('6.3.2', 'Data Integrity Mechanisms')
    pdf.bp('All fields are type-checked and validated before insertion. Email fields use regex validation, password fields enforce minimum length requirements, and enum fields restrict values to predefined sets.', 'Schema Validation')
    pdf.bp('Email uniqueness is enforced at the database level through a unique index, preventing duplicate account creation even under concurrent registration attempts.', 'Unique Constraints')
    pdf.bp('The User schema includes a pre-save middleware that automatically hashes passwords using bcrypt before persisting to the database. This ensures passwords are never stored in plaintext, even if the application code omits the hashing step.', 'Pre-Save Hooks')
    pdf.bp('Watchlist documents reference User documents via ObjectId, ensuring that watchlist operations are always scoped to authenticated users. Mongoose population enables efficient JOIN-like queries across collections.', 'Referential Integrity')

    # ========================================================================
    # CHAPTER 7: TESTING (expanded)
    # ========================================================================
    pdf.chapter_cover('7', 'Testing', ['7.1 Black-Box Testing', '7.2 White-Box Testing', '7.3 Test Cases'])
    pdf.chapter_title = "Testing"
    pdf.add_page()

    pdf.s1('7.1', 'BLACK-BOX TESTING')
    pdf.p('Black-Box testing focuses entirely on the inputs and outputs of the system without prior knowledge of the internal code structure. For this platform, Black-Box testing was conducted from the perspective of an end user and a system administrator.')

    pdf.s2('7.1.1', 'LSTM Prediction Accuracy (The "Intelligence" Test)')
    pdf.p('To evaluate the LSTM prediction model, we treated the FastAPI prediction endpoint as a black box. We fed the system a stock symbol and prediction horizon and evaluated the quality of the output predictions.')
    pdf.bp('A POST request to /api/predict with symbol "GOOGL" and days = 30.', 'Input')
    pdf.bp('The system should return an array of 30 predicted prices with associated dates, along with model evaluation metrics (RMSE, MAE, R-squared, MAPE) and model information (algorithm, training data size, sequence length).', 'Expected Output')
    pdf.p('Result: The LSTM model achieved the following metrics on test data:')
    pdf.tbl(
        ['Metric', 'Value', 'Interpretation'],
        [
            ['RMSE', '4.1308', 'Low average prediction error'],
            ['MAE', '1.1950', 'Average $1.19 deviation from actual'],
            ['R-squared', '0.9159', '91.6% of price variance explained'],
            ['MAPE', '1.02%', 'Excellent accuracy (< 2% threshold)'],
            ['AI Confidence', '92%', 'High model reliability'],
        ],
        [40, 40, 75]
    )
    pdf.fig_ref('7.1', 'AI Prediction Results - Metrics Dashboard showing RMSE, MAE, R-squared, MAPE, and AI Confidence bar')

    pdf.add_page()
    pdf.s2('7.1.2', 'Authentication and Authorization Testing')
    pdf.p('This test evaluated the JWT authentication middleware to ensure proper access control across protected endpoints.')
    pdf.bp('Attempting to access the /api/watchlist endpoint without a valid JWT token.', 'Input')
    pdf.bp('The system should return HTTP 401 (Unauthorized) with an error message "No token, authorization denied."', 'Expected Output')
    pdf.bp('The JWT middleware correctly rejected unauthorized requests. Authenticated requests with valid tokens returned the expected watchlist data. Expired tokens were properly rejected with appropriate error messages.', 'Result')

    pdf.s2('7.1.3', 'Paper Trading Accuracy Testing')
    pdf.bp('Executing a BUY trade for 2 shares of AAPL at $149.55, followed by a SELL trade for 2 shares at the same price.', 'Input')
    pdf.bp('Total Bought should equal $299.10, Total Sold should equal $299.10, and Net P&L should be $0.00.', 'Expected Output')
    pdf.bp('The paper trading engine correctly calculated all trade totals, maintained accurate running balances, recorded precise timestamps for each transaction, and properly categorized trades as BUY (green) or SELL (red) in the transaction history.', 'Result')
    pdf.fig_ref('7.2', 'Transaction History showing accurate BUY/SELL records with timestamps, quantities, prices, and running balances')

    pdf.s2('7.1.4', 'Real-Time WebSocket Testing')
    pdf.bp('Subscribing to the AAPL room via Socket.IO client connection.', 'Input')
    pdf.bp('The client should receive price updates for AAPL only (not other symbols) within 1 second of server broadcast.', 'Expected Output')
    pdf.bp('WebSocket connections maintained stable connectivity over extended periods. Price updates were received in under 1 second. Automatic reconnection logic successfully restored connections after simulated network interruptions.', 'Result')

    pdf.add_page()
    pdf.s1('7.2', 'WHITE-BOX TESTING')
    pdf.p('White-Box testing involves deep inspection of the internal algorithms, data preprocessing pipeline, and API response structures. This was performed at the code level using debugging tools and validation scripts.')

    pdf.s2('7.2.1', 'LSTM Data Pipeline Testing')
    pdf.p('The data preprocessing pipeline is critical for model accuracy. Any errors in normalization or sequence generation would produce unreliable predictions.')
    pdf.bp('We inserted validation checks at each stage of the pipeline: after yfinance data fetching (verifying non-null, non-zero data), after MinMaxScaler normalization (verifying all values fall within [0, 1]), and after sequence generation (verifying each sequence has exactly 60 time steps and the target is the next day price).', 'Methodology')
    pdf.bp('We confirmed that the sliding window correctly generates overlapping sequences, that the train/test split preserves temporal ordering (no data leakage - test data always follows training data chronologically), and that the inverse_transform correctly maps predicted values back to the original price scale using the fitted scaler.', 'Validation')

    pdf.s2('7.2.2', 'API Response Structure Testing')
    pdf.p('Every API endpoint was tested for response structure compliance to ensure consistent data contracts between the backend and frontend.')
    pdf.bp('We verified that all prediction responses include the required fields: predictions (array of {date, price}), metrics (object with rmse, mae, r2_score), historical (array of past prices), and training_info (object with epochs, data_points).', 'Methodology')
    pdf.bp('Responses were validated against predefined JSON schemas. Missing fields, incorrect types, and null values were flagged as test failures.', 'Validation')

    pdf.s2('7.2.3', 'Security Testing')
    pdf.p('The authentication and authorization layer was tested for common security vulnerabilities:')
    pdf.bp('Verified that JWT tokens cannot be forged without the secret key. Modified tokens are correctly rejected.', 'Token Forgery')
    pdf.bp('Verified that passwords are hashed with bcrypt (12 salt rounds) before storage. Raw passwords never appear in database documents or server logs.', 'Password Storage')
    pdf.bp('Verified that the rate limiter correctly blocks requests after 100 calls within a 15-minute window, returning HTTP 429 (Too Many Requests).', 'Rate Limiting')

    pdf.add_page()
    pdf.s1('7.3', 'TEST CASES')
    pdf.p('To systematically document the testing phase, the following standardized test cases were executed and logged:')
    pdf.tbl(
        ['TC ID', 'Feature Tested', 'Action/Input', 'Expected Result', 'Pass/Fail'],
        [
            ['TC-01', 'LSTM Prediction', 'POST /predict GOOGL', 'R2=0.9159, 30 prices', 'PASS'],
            ['TC-02', 'User Registration', 'POST /auth/register', 'JWT token returned', 'PASS'],
            ['TC-03', 'JWT Auth Guard', 'GET /watchlist + token', 'Watchlist returned', 'PASS'],
            ['TC-04', 'Unauthorized Access', 'GET /watchlist (no token)', 'HTTP 401 error', 'PASS'],
            ['TC-05', 'Paper Trade BUY', 'BUY 2 AAPL', 'Balance updated', 'PASS'],
            ['TC-06', 'Paper Trade SELL', 'SELL 2 AAPL', 'Balance increased', 'PASS'],
            ['TC-07', 'WebSocket Feed', 'Subscribe to AAPL', 'Updates in <1s', 'PASS'],
            ['TC-08', 'Data Cache Hit', 'GET /quote/AAPL x2', 'Cached in <5ms', 'PASS'],
            ['TC-09', 'Watchlist Limit', 'Add 51st stock', 'HTTP 400 error', 'PASS'],
            ['TC-10', 'Mock Fallback', 'ML Service offline', 'Mock data returned', 'PASS'],
            ['TC-11', 'Rate Limiting', '101 requests in 15min', 'HTTP 429 error', 'PASS'],
            ['TC-12', 'Market Summary', 'GET /market-summary', 'S&P, NASDAQ, DJ data', 'PASS'],
        ],
        [16, 32, 38, 50, 18]
    )

    # ========================================================================
    # CHAPTER 8: SYSTEM DESIGN (expanded)
    # ========================================================================
    pdf.chapter_cover('8', 'System Design', ['8.1 Class Diagram', '8.2 Use-Case Diagram', '8.3 Sequence Diagram', '8.4 Activity Diagram', '8.5 Data Flow Diagram'])
    pdf.chapter_title = "System Design"
    pdf.add_page()

    pdf.s1('8.1', 'CLASS DIAGRAM')
    pdf.p('The Class Diagram illustrates the static structure of the StockAI platform, detailing the software blueprint across three technology layers: the React Frontend (JavaScript), the Express Backend (JavaScript/Node.js), and the FastAPI ML Service (Python).')
    pdf.fig_ref('8.1', 'Class Diagram showing three packages with their classes, attributes, and methods')

    pdf.s2('8.1.1', 'Package 1: React Frontend (JavaScript)')
    pdf.bp('Attributes: baseURL (string), token (string). Methods: getStockQuote(symbol), getPrediction(symbol, days), getWatchlist(), executeTrade(tradeData), login(credentials), register(userData). Axios interceptors automatically attach JWT tokens.', 'ApiService Class')
    pdf.bp('Attributes: user (Object), token (string), isAuthenticated (boolean). Methods: login(email, password), register(name, email, password), logout(). Manages JWT tokens in localStorage and provides authentication state to all child components.', 'AuthContext Class')
    pdf.bp('Attributes: trades (Array), balance (number). Methods: executeBuy(symbol, qty, price), executeSell(symbol, qty, price), getHistory(). Manages the paper trading portfolio state.', 'PortfolioContext Class')
    pdf.bp('Attributes: socket (Socket.IO instance). Methods: connect(), subscribeToSymbol(symbol), onPriceUpdate(callback), disconnect(). Manages WebSocket lifecycle.', 'SocketService Class')

    pdf.s2('8.1.2', 'Package 2: Express Backend (Node.js)')
    pdf.bp('Methods: verifyToken(req, res, next). Extracts JWT from Authorization header, verifies against secret, and attaches user object to request.', 'AuthMiddleware Class')
    pdf.bp('Attributes: cache (NodeCache, TTL: 60s). Methods: getQuote(symbol), getHistorical(symbol, interval), searchStocks(query), getMarketSummary(). Implements cache-first data retrieval.', 'StockService Class')
    pdf.bp('Attributes: mlServiceURL ("http://localhost:8000"). Methods: getPrediction(symbol, days), getHistory(symbol), getMockPrediction(symbol, days). Proxies requests to FastAPI.', 'PredictionProxy Class')

    pdf.s2('8.1.3', 'Package 3: FastAPI ML Service (Python)')
    pdf.bp('Attributes: model (Keras Sequential), scaler (MinMaxScaler), sequence_length (60). Methods: prepare_data(symbol), train(symbol, epochs), predict(symbol, days), load_model(symbol), save_model(symbol).', 'StockPredictor Class')

    pdf.add_page()
    pdf.s1('8.2', 'USE-CASE DIAGRAM')
    pdf.p('The Use Case diagram provides a high-level behavioral blueprint of the StockAI platform.')
    pdf.fig_ref('8.2', 'Use-Case Diagram with system boundary showing all actors and use cases')

    pdf.s2('8.2.1', 'Identification of Actors')
    pdf.ni(1, 'Can access the Dashboard, view stock quotes, generate AI predictions, browse recommendations, read news, and access the Learning Center. Cannot manage a watchlist or execute paper trades.', 'Unauthenticated User (Guest)')
    pdf.ni(2, 'Inherits all Guest capabilities. Additionally can manage a personal watchlist (add/remove up to 50 stocks), execute paper trades (buy/sell), view transaction history with P&L calculations.', 'Authenticated User (Investor)')
    pdf.ni(3, 'An automated system actor that receives prediction requests from the backend, fetches historical data from Yahoo Finance, executes LSTM inference, and returns predictions with metrics.', 'ML Service (FastAPI)')
    pdf.ni(4, 'Can view server health endpoints, monitor API rate-limit statistics, and access database administration.', 'System Administrator')

    pdf.s2('8.2.2', 'Use Case Relationships')
    pdf.p('Mandatory Execution (include): "View Stock Detail" includes "Fetch Real-Time Quote"; "Generate AI Prediction" includes "Fetch Historical Data" and "Execute LSTM Inference"; "Execute Paper Trade" includes "Verify JWT Authentication".')
    pdf.p('Conditional Execution (extend): "Add to Watchlist" extends "View Stock Detail" (only if authenticated); "View Model Metrics" extends "Generate AI Prediction" (always displayed with prediction); "Execute Paper Trade" extends "View Stock Detail" (only if authenticated and Buy/Sell button clicked).')

    pdf.add_page()
    pdf.s1('8.3', 'SEQUENCE DIAGRAM')
    pdf.p('The Sequence Diagram maps the precise, step-by-step execution of an AI prediction request - the most complex interaction in the system.')
    pdf.fig_ref('8.3', 'Sequence Diagram showing message flow across all three microservices')

    pdf.s2('', 'Phase 1: User Request Initiation (Steps 1-2)')
    pdf.p('Step 1: The User selects a stock symbol (e.g., "GOOGL") on the Predictions page and clicks "Generate Prediction." Step 2: The React frontend sends an HTTP POST request to the Express backend at /api/predict/GOOGL with the JWT token in the Authorization header.')

    pdf.s2('', 'Phase 2: Backend Proxy and ML Service Communication (Steps 3-7)')
    pdf.p('Step 3: The Express backend validates the request parameters and proxies to the FastAPI ML service at http://localhost:8000/api/predict. Step 4: The ML service checks if a trained model for "GOOGL" exists in the model cache. Step 5: If no cached model exists, the service fetches 2 years of historical data from Yahoo Finance using yfinance. Step 6: The service normalizes Close prices using MinMaxScaler, generates sliding window sequences (60 time steps), splits the data 80/20, and trains the LSTM model with Early Stopping (patience=10). Step 7: The trained model generates predictions for the requested number of days using autoregressive forecasting.')

    pdf.s2('', 'Phase 3: Response Assembly and Delivery (Steps 8-11)')
    pdf.p('Step 8: The ML service calculates evaluation metrics (RMSE, MAE, R-squared, MAPE) on the test set. Step 9: The ML service returns a JSON response containing predictions, metrics, historical data, and training_info. Step 10: The Express backend relays the response to the React frontend. Step 11: The frontend renders the Actual vs. Predicted overlay chart using Recharts, displays the metrics dashboard, and populates the Predicted Prices table.')

    pdf.add_page()
    pdf.s1('8.4', 'ACTIVITY DIAGRAM')
    pdf.p('The Activity Diagram models the step-by-step algorithmic execution across three swimlanes: React Frontend, Express Backend, and FastAPI ML Service.')
    pdf.fig_ref('8.4', 'Activity Diagram with three swimlanes showing parallel processing paths')

    pdf.s2('8.4.1', 'Frontend Swimlane')
    pdf.p('User navigates to the Predictions page. User selects a stock symbol from quick-access buttons (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA) or enters a custom symbol. User clicks "Generate Prediction." Frontend displays loading spinner and sends POST request. Decision Fork: Response received? Yes: Render charts and metrics. No (timeout): Display error notification.')

    pdf.s2('8.4.2', 'Backend Swimlane')
    pdf.p('Receive prediction request with stock symbol and days parameter. Decision Fork: ML Service available? Yes: Proxy request to FastAPI at port 8000. No: Generate mock predictions using historical average price data. Return prediction response to frontend.')

    pdf.s2('8.4.3', 'ML Service Swimlane')
    pdf.p('Receive prediction request. Decision Fork: Cached model exists? Yes: Load model from disk (.keras) and scaler from disk (.pkl). No: Fetch 2-year historical data, normalize, generate sequences, train LSTM, save model to disk. Generate autoregressive predictions for N days. Calculate metrics (RMSE, MAE, R-squared, MAPE). Return JSON response.')

    pdf.add_page()
    pdf.s1('8.5', 'DATA FLOW DIAGRAMS (DFD)')

    pdf.s2('8.5.1', 'Level 0 DFD (Context Diagram)')
    pdf.p('The Level 0 DFD represents the entire StockAI Platform as a single process (Process 0.0), establishing a strict system boundary with three external entities:')
    pdf.bp('Provides login credentials, stock symbol queries, prediction requests, and trade orders. Receives real-time market data, AI predictions with metrics, portfolio analytics, and educational content.', 'Retail Investor (User)')
    pdf.bp('Provides historical OHLCV data and real-time stock quotes. Receives HTTP requests with stock symbols and date ranges.', 'Yahoo Finance API')
    pdf.bp('Provides persistent storage and retrieval of user accounts, watchlists, stock data cache, and trade history.', 'MongoDB Database')
    pdf.fig_ref('8.5.1', 'Level 0 DFD (Context Diagram)')

    pdf.s2('8.5.2', 'Level 1 DFD (Primary Sub-Systems)')
    pdf.p('The Level 1 DFD decomposes the system into six primary processes:')
    pdf.bp('Handles registration, login, and JWT token management.', 'Process 1.0 (User Authentication)')
    pdf.bp('Fetches, caches, and serves real-time and historical market data.', 'Process 2.0 (Stock Data Service)')
    pdf.bp('Manages the LSTM model lifecycle - training, caching, and inference.', 'Process 3.0 (AI Prediction Engine)')
    pdf.bp('CRUD operations on user-specific watchlists.', 'Process 4.0 (Watchlist Management)')
    pdf.bp('Executes simulated trades and calculates portfolio metrics.', 'Process 5.0 (Paper Trading Engine)')
    pdf.bp('Manages Socket.IO connections and per-symbol price broadcasting.', 'Process 6.0 (Real-Time WebSocket)')
    pdf.fig_ref('8.5.2', 'Level 1 DFD (Primary Sub-Systems)')

    pdf.s2('8.5.3', 'Level 2 DFD (Deep Dive: Process 3.0 - AI Prediction Engine)')
    pdf.p('The Level 2 DFD provides an expanded view of Process 3.0, showing four sub-processes: 3.1 (Parse Prediction Request), 3.2 (Check Model Cache), 3.3 (Train LSTM Model), and 3.4 (Generate Autoregressive Predictions). Data stores include D1 (Model Cache - .keras files) and D2 (Scaler Cache - .pkl files).')
    pdf.fig_ref('8.5.3', 'Level 2 DFD (Deep Dive: AI Prediction Engine)')

    # ========================================================================
    # CHAPTER 9: LIMITATIONS & FUTURE (expanded)
    # ========================================================================
    pdf.chapter_cover('9', 'Limitations and\nFuture Enhancements', ['9.1 Limitations', '9.2 Future Enhancements'])
    pdf.chapter_title = "Limitations and Future Enhancements"
    pdf.add_page()

    pdf.s1('9.1', 'LIMITATIONS')
    pdf.p('Despite achieving strong prediction accuracy and delivering a comprehensive user experience, the system exhibits several operational constraints that should be acknowledged.')
    pdf.s2('9.1.1', 'Single-Feature LSTM Model')
    pdf.p('The current LSTM model uses only the historical Close Price as its input feature. While this achieves competitive accuracy (R-squared = 0.9159), it ignores potentially valuable signals such as trading volume, technical indicators (RSI, MACD, Bollinger Bands), and macroeconomic factors (interest rates, earnings reports, GDP data) that could improve prediction quality.')
    pdf.s2('9.1.2', 'Autoregressive Prediction Drift')
    pdf.p('For multi-day predictions, the model uses its own output as input for subsequent predictions. This autoregressive approach causes prediction uncertainty to compound with each time step, resulting in decreasing reliability for longer prediction horizons. Predictions beyond 30 days should be interpreted with significantly reduced confidence.')
    pdf.s2('9.1.3', 'Data Source Dependency')
    pdf.p('The platform depends entirely on the Yahoo Finance API (yfinance) for both historical training data and real-time quotes. Any changes to Yahoo Finance API structure, rate limits, or service availability could disrupt the platform data pipeline. The mock data fallback provides only simulated data, not real market prices.')
    pdf.s2('9.1.4', 'Paper Trading Simplification')
    pdf.p('The paper trading engine simulates trades at the current market price without accounting for real-world market microstructure effects such as bid-ask spreads, slippage, partial fills, commission fees, or market impact. This means paper trading profits/losses may not accurately reflect real trading outcomes.')
    pdf.s2('9.1.5', 'No Model Retraining Automation')
    pdf.p('Trained LSTM models are cached indefinitely after the initial training. There is no automated retraining pipeline to update models as new market data becomes available. Over time, model predictions may degrade as market conditions evolve beyond the original training distribution.')

    pdf.add_page()
    pdf.s1('9.2', 'FUTURE ENHANCEMENTS')
    pdf.s2('9.2.1', 'Multi-Feature LSTM with Technical Indicators')
    pdf.p('Future versions will extend the LSTM model input from a single feature (Close Price) to multiple features including Volume, RSI (Relative Strength Index), MACD (Moving Average Convergence Divergence), SMA (Simple Moving Average), and EMA (Exponential Moving Average). This multi-feature approach is expected to improve prediction accuracy by 5-15% based on current academic literature.')
    pdf.s2('9.2.2', 'Transformer-Based Prediction Models')
    pdf.p('The LSTM architecture could be supplemented or replaced with Transformer-based models (e.g., Temporal Fusion Transformer) that leverage self-attention mechanisms to capture both short-term and long-term dependencies more effectively than recurrent architectures. Transformers can also handle variable-length input sequences and multi-horizon forecasting natively.')
    pdf.s2('9.2.3', 'Sentiment Analysis Integration')
    pdf.p('Integrating Natural Language Processing (NLP) sentiment analysis of financial news headlines and social media (Twitter/X, Reddit) would provide an additional predictive signal. Models like FinBERT (financial domain BERT) could classify market sentiment as positive, negative, or neutral, feeding this as an auxiliary input to the prediction model.')
    pdf.s2('9.2.4', 'Real Brokerage API Integration')
    pdf.p('The paper trading engine could be extended to support real brokerage accounts through APIs such as Alpaca (commission-free trading API), Interactive Brokers, or Zerodha (for Indian markets). This would enable users to transition seamlessly from practice trading to live trading within the same platform.')
    pdf.s2('9.2.5', 'Mobile Application')
    pdf.p('Developing a React Native or Flutter mobile application would extend the platform reach to smartphones, enabling users to monitor market data, receive AI prediction push notifications, and execute trades on-the-go.')

    # ========================================================================
    # CHAPTER 10: CONCLUSION (expanded)
    # ========================================================================
    pdf.chapter_cover('10', 'Conclusion', ['10.1 Conclusion'])
    pdf.chapter_title = "Conclusion"
    pdf.add_page()

    pdf.s1('10.1', 'CONCLUSION')
    pdf.p('The exponential growth in retail stock market participation has created an urgent demand for intelligent, accessible, and transparent financial analysis tools. Traditional platforms either present raw data without actionable insights or lock advanced analytics behind prohibitive subscription barriers, systematically disadvantaging individual investors in an increasingly algorithm-driven market.')
    pdf.p('This thesis successfully designed, implemented, and validated an AI-Powered Stock Market Analysis Platform - a full-stack web application that integrates deep learning-based price forecasting, real-time market data visualization, and simulated paper trading into a unified, browser-based experience.')

    pdf.s2('10.1.1', 'Summary of Engineering Contributions')
    pdf.p('The successful deployment of this platform validates several core engineering paradigms:')
    pdf.bp('The multi-layer LSTM neural network (128, 64, 32 stacked architecture with Dropout regularization) achieves an R-squared Score of 0.9159 and a MAPE of 1.02% on historical test data, confirming that deep learning models can generate meaningful short-term stock price forecasts when properly architected and trained with appropriate hyperparameters.', 'Deep Learning for Financial Forecasting')
    pdf.bp('The three-tier architecture (React + Express + FastAPI) demonstrates that complex AI inference systems can be cleanly integrated into modern web applications through well-defined API contracts. The independent scalability of each service ensures that high-demand ML inference does not degrade frontend responsiveness.', 'Microservices Architecture')
    pdf.bp('By exposing comprehensive model metrics (RMSE, MAE, R-squared, MAPE) and an AI Confidence percentage alongside every prediction, the platform empowers users to make calibrated decisions rather than blindly trusting opaque algorithmic outputs.', 'Transparent AI')
    pdf.bp('The Socket.IO WebSocket integration proves that financial-grade real-time data streaming can be achieved in a web browser environment without specialized client software, democratizing access to live market feeds.', 'Real-Time Data Delivery')
    pdf.bp('The paper trading simulator bridges the gap between financial literacy and active market participation, enabling users to practice investment strategies with realistic trade mechanics without risking actual capital.', 'Risk-Free Practice')

    pdf.s2('10.1.2', 'Final Verdict')
    pdf.p('The experimental results confirm that the proposed platform successfully delivers institutional-grade analytical capabilities - real-time market monitoring, AI-powered price forecasting, and portfolio management - through a free, accessible web application. The system achievement of an R-squared Score exceeding 0.91 validates the LSTM architecture for short-term price prediction, while the comprehensive UI (Dashboard, Predictions, Watchlist, Discover, History, News, Learn) provides a complete investment analysis workflow.')
    pdf.p('Ultimately, this thesis proves that the convergence of modern web frameworks (React, Express), deep learning infrastructure (TensorFlow, FastAPI), and thoughtful UX design can democratize financial intelligence for retail investors. As algorithmic trading continues to dominate global markets, platforms like StockAI will be essential to ensuring that individual investors have access to the same analytical tools - transparent, intelligent, and free - that were previously reserved for institutional professionals.')

    # ========================================================================
    # CHAPTER 11: APPENDICES (expanded with all screenshots)
    # ========================================================================
    pdf.chapter_cover('11', 'Appendices', ['11.1 Business Model', '11.2 Product Deployment Detail', '11.3 API and Web Service Details'])
    pdf.chapter_title = "Appendices"
    pdf.add_page()

    pdf.s1('11.1', 'BUSINESS MODEL')
    pdf.p('The StockAI platform is designed as a freemium educational and analytical tool targeting retail investors and finance students. The platform is entirely free for individual users, with potential monetization through:')
    pdf.bp('Advanced prediction models (Transformer, ensemble methods), extended prediction horizons (365+ days), multi-stock portfolio optimization, and custom alert notifications could be offered as a paid tier.', 'Premium Features (Future)')
    pdf.bp('The LSTM prediction engine could be exposed as a paid API service for third-party financial applications, fintech startups, and robo-advisory platforms.', 'API Access (Future)')
    pdf.bp('The Learning Center could be expanded with structured courses in partnership with universities, financial education providers, and certification bodies.', 'Educational Partnerships')
    pdf.bp('Integration with real brokerage APIs (Alpaca, Zerodha) could generate referral commissions when users transition from paper trading to live trading accounts.', 'Affiliate Revenue')

    pdf.add_page()
    pdf.s1('11.2', 'PRODUCT DEPLOYMENT DETAIL')
    pdf.s2('11.2.1', 'Local Development Setup')
    pdf.p('The platform requires three services running simultaneously on different ports:')
    pdf.p('Backend Service (Port 5000): Navigate to the backend directory, run npm install to install dependencies, configure the .env file with MongoDB URI and JWT secret, then run npm run dev to start the Express server with nodemon hot-reload.')
    pdf.p('ML Service (Port 8000): Navigate to the ml-service directory, create a Python virtual environment, install requirements from requirements.txt using pip, then run python app.py to start the FastAPI server with Uvicorn.')
    pdf.p('Frontend Application (Port 3000): Navigate to the frontend directory, run npm install to install dependencies, then run npm start to start the React development server with hot-reload.')

    pdf.s2('11.2.2', 'Environment Variables')
    pdf.p('Backend (.env): PORT=5000, MONGODB_URI=mongodb://localhost:27017/stock_ai_platform, JWT_SECRET=<secure_random_string>, JWT_EXPIRE=7d, ML_SERVICE_URL=http://localhost:8000, CLIENT_URL=http://localhost:3000, NODE_ENV=development')
    pdf.p('ML Service (config.py): SEQUENCE_LENGTH=60, DEFAULT_EPOCHS=50, BATCH_SIZE=32, TRAIN_SPLIT=0.8, DEFAULT_PREDICTION_DAYS=30, HISTORICAL_PERIOD="2y", HOST="0.0.0.0", PORT=8000')

    pdf.s2('11.2.3', 'Project Directory Structure')
    pdf.p('/stock-ai-platform/backend/ contains config/ (Database, Socket.IO initialization), middleware/ (JWT auth, rate limiting), models/ (User, Stock, Watchlist Mongoose schemas), routes/ (auth, stocks, predictions, watchlist, news), services/ (stockService with caching), server.js (Express entry point), and package.json.')
    pdf.p('/stock-ai-platform/frontend/src/ contains components/ (Navbar, StockChart, TradeModal), context/ (AuthContext, ThemeContext, PortfolioContext), pages/ (Dashboard, Predictions, Watchlist, StockDetail, Discover, History, News, Learn, Login, Register), services/ (api.js, socket.js), App.js (React Router setup), and index.js (React root).')
    pdf.p('/stock-ai-platform/ml-service/ contains app.py (FastAPI endpoints), model.py (StockPredictor class with LSTM), config.py (Configuration constants), utils.py (Data generation, metrics), requirements.txt, and models/ directory (Persisted .keras models and .pkl scalers).')

    pdf.add_page()
    pdf.s2('11.2.4', 'Application Screenshots')
    pdf.p('The following figures reference the platform UI as captured during testing and demonstration:')
    screenshots = [
        ('11.1', 'Market Overview Dashboard - Shows S&P 500, NASDAQ, Dow Jones indices with real-time prices, Quick Access sidebar with all stocks, AAPL price chart with 1W/1M/3M/6M/1Y selectors, and Top Gainers/Losers panels'),
        ('11.2', 'All Stocks Dashboard - Tabular view showing Symbol, Name, Price, Change, Change %, Volume, and Add to Watchlist (+) action for all supported stocks including AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, JPM, V, NFLX'),
        ('11.3', 'Stock Detail Page (AAPL) - Current price ($306.54), change (-1.32%), Buy/Sell buttons with green/red styling, Add to Watchlist, Get AI Prediction button, and interactive 1-month price chart'),
        ('11.4', 'AI Predictions Page - GOOGL symbol with Actual vs Predicted overlay chart showing green actual line, yellow dashed predicted line, and gray confidence band'),
        ('11.5', 'AI Predictions - Metrics Panel showing RMSE (4.1308), MAE (1.1950), R2 Score (0.9159), MAPE (1.02%), AI Confidence bar (92%), Model Information (LSTM, 856+ points, Seq Length 50), and Predicted Prices table for next 30 days'),
        ('11.6', 'Stock Recommendations (Discover) - AI-powered cards showing Top Gainers (MSFT, AAPL, AMZN, GOOGL) with Strong Buy labels, confidence percentages, volume bars, and Buy Now buttons'),
        ('11.7', 'Transaction History - Summary cards (Total Trades: 6, Total Bought: $4,216.10, Total Sold: $2,255.80, Net P&L: -$1,960.30) and detailed trade log with BUY/SELL color coding'),
        ('11.8', 'Watchlist Page - Tracked stocks (AAPL at $258.97, -0.46%; META at $319.22, +1.01%) with delete icons and Refresh button'),
        ('11.9', 'Login Page - StockAI branded login form with Email Address and Password fields, Continue button with green gradient, and "Create one" registration link'),
        ('11.10', 'Learning Center - Searchable educational hub with expandable cards for Dashboard, Stock Detail Page, AI Predictions, Watchlist, and Buy & Sell (Paper Trading)'),
    ]
    for fig_num, desc in screenshots:
        pdf.fig_ref(fig_num, desc)

    pdf.add_page()
    pdf.s1('11.3', 'API AND WEB SERVICE DETAILS')
    pdf.s2('11.3.1', 'Backend REST API Endpoints (Express @ port 5000)')
    pdf.tbl(
        ['Route', 'Method', 'Auth', 'Purpose'],
        [
            ['/api/auth/register', 'POST', '-', 'Register new user'],
            ['/api/auth/login', 'POST', '-', 'Login, get JWT token'],
            ['/api/auth/me', 'GET', 'JWT', 'Get current profile'],
            ['/api/stocks/quote/:symbol', 'GET', '-', 'Real-time stock quote'],
            ['/api/stocks/historical/:sym', 'GET', '-', 'Historical price data'],
            ['/api/stocks/search/:query', 'GET', '-', 'Search stocks'],
            ['/api/stocks/market-summary', 'GET', '-', 'Market indices'],
            ['/api/predict/:symbol', 'POST', '-', 'LSTM predictions'],
            ['/api/predict/history/:sym', 'GET', '-', 'Prediction accuracy'],
            ['/api/watchlist', 'GET', 'JWT', 'Get user watchlist'],
            ['/api/watchlist/add', 'POST', 'JWT', 'Add stock'],
            ['/api/watchlist/remove/:sym', 'DELETE', 'JWT', 'Remove stock'],
            ['/api/news', 'GET', '-', 'Market news'],
            ['/api/health', 'GET', '-', 'Server health check'],
        ],
        [55, 18, 12, 55]
    )

    pdf.s2('11.3.2', 'ML Service API Endpoints (FastAPI @ port 8000)')
    pdf.tbl(
        ['Endpoint', 'Method', 'Purpose'],
        [
            ['/api/predict', 'POST', 'Generate LSTM price predictions'],
            ['/api/train', 'POST', 'Train/retrain model for a symbol'],
            ['/api/predict/history/{symbol}', 'GET', 'Actual vs. predicted (90 days)'],
            ['/api/models', 'GET', 'List all trained models'],
            ['/api/health', 'GET', 'ML service health check'],
        ],
        [65, 25, 65]
    )

    pdf.add_page()
    pdf.s2('11.3.3', 'LSTM Model Architecture Summary')
    pdf.tbl(
        ['Layer', 'Configuration', 'Output Shape'],
        [
            ['Input', 'shape=(60, 1)', '(None, 60, 1)'],
            ['LSTM 1', '128 units, return_seq=True', '(None, 60, 128)'],
            ['Dropout 1', 'rate=0.2', '(None, 60, 128)'],
            ['LSTM 2', '64 units, return_seq=True', '(None, 60, 64)'],
            ['Dropout 2', 'rate=0.2', '(None, 60, 64)'],
            ['LSTM 3', '32 units, return_seq=False', '(None, 32)'],
            ['Dropout 3', 'rate=0.2', '(None, 32)'],
            ['Dense 1', '16 units, ReLU activation', '(None, 16)'],
            ['Dense 2 (Output)', '1 unit, Linear activation', '(None, 1)'],
        ],
        [45, 60, 50]
    )
    pdf.p('Optimizer: Adam (learning_rate=0.001). Loss Function: Mean Squared Error. Training Metric: Mean Absolute Error. Regularization: Early Stopping (patience=10, restore_best_weights=True). Validation Split: 10% during training. Training Data: 2 years of historical Close prices via yfinance. Normalization: MinMaxScaler (range: 0 to 1). Sequence Length: 60 time steps (configurable).')

    # ========================================================================
    # BIBLIOGRAPHY
    # ========================================================================
    pdf.add_page()
    pdf.show_header_footer = False
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'BIBLIOGRAPHY', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    refs = [
        '[1] S. Hochreiter and J. Schmidhuber, "Long Short-Term Memory," Neural Computation, vol. 9, no. 8, pp. 1735-1780, 1997.',
        '[2] T. Fischer and C. Krauss, "Deep learning with long short-term memory networks for financial market predictions," European Journal of Operational Research, vol. 270, no. 2, pp. 654-669, 2018.',
        '[3] S. Selvin, R. Vinayakumar, E. A. Gopalakrishnan, V. K. Menon, and K. P. Soman, "Stock price prediction using LSTM, RNN and CNN-sliding window model," in ICACCI, pp. 1643-1647, 2017.',
        '[4] A. Moghar and M. Hamiche, "Stock Market Prediction Using LSTM Recurrent Neural Network," Procedia Computer Science, vol. 170, pp. 1168-1173, 2020.',
        '[5] W. Bao, J. Yue, and Y. Rao, "A deep learning framework for financial time series using stacked autoencoders and long-short term memory," PLOS ONE, vol. 12, no. 7, e0180944, 2017.',
        '[6] M. Roondiwala, H. Patel, and S. Varma, "Predicting Stock Prices Using LSTM," IJSR, vol. 6, no. 4, pp. 1754-1756, 2017.',
        '[7] X. Ding, Y. Zhang, T. Liu, and J. Duan, "Deep learning for event-driven stock prediction," in IJCAI, pp. 2327-2333, 2015.',
        '[8] E. Chong, C. Han, and F. C. Park, "Deep learning networks for stock market analysis and prediction," Expert Systems with Applications, vol. 83, pp. 187-205, 2017.',
        '[9] React Documentation, "React - A JavaScript library for building user interfaces," Meta Platforms, Inc. Available: https://react.dev/',
        '[10] Express.js Documentation, "Express - Fast, unopinionated, minimalist web framework for Node.js." Available: https://expressjs.com/',
        '[11] TensorFlow Documentation, "TensorFlow - An end-to-end open source machine learning platform," Google Brain Team. Available: https://www.tensorflow.org/',
        '[12] FastAPI Documentation, "FastAPI - Modern, fast web framework for building APIs with Python." Available: https://fastapi.tiangolo.com/',
        '[13] MongoDB Documentation, "MongoDB - The application data platform." Available: https://www.mongodb.com/docs/',
        '[14] Socket.IO Documentation, "Socket.IO - Bidirectional and low-latency communication." Available: https://socket.io/docs/',
        '[15] yfinance Documentation, "Download market data from Yahoo Finance API." Available: https://pypi.org/project/yfinance/',
        '[16] Recharts Documentation, "A composable charting library built on React components." Available: https://recharts.org/',
        '[17] K. Adam, A. Marcet, and J. P. Nicolini, "Stock market volatility and learning," Journal of Finance, vol. 71, no. 1, pp. 33-82, 2016.',
        '[18] Y. Baek and H. Y. Kim, "ModAugNet: A new forecasting framework for stock market index value with an overfitting prevention LSTM module," Expert Systems with Applications, vol. 113, pp. 457-480, 2018.',
    ]
    pdf.set_font('Times', '', 11)
    for ref in refs:
        pdf.multi_cell(0, 6, ref, 0, 'J')
        pdf.ln(2)

    # Save
    out = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/Thesis_StockAI_AryaShah.pdf'
    pdf.output(out)
    print(f'PDF generated: {out}')
    print(f'Total pages: {pdf.page_no()}')

if __name__ == '__main__':
    build()
