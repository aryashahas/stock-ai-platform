#!/usr/bin/env python3
"""
Generate Thesis PDF: AI-Powered Stock Market Analysis Platform
Matches the formatting of the Indus University B.Tech project report template.
"""

from fpdf import FPDF
import os

class ThesisPDF(FPDF):
    """Custom PDF class with thesis-specific formatting."""

    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=25)
        self.chapter_title = ""
        self.show_header_footer = False
        self.page_label = ""

    def header(self):
        if self.show_header_footer and self.page_no() > 1:
            self.set_font('Times', 'I', 9)
            self.cell(0, 5, 'IITE/CSE2026/IDP138', 0, 0, 'L')
            self.cell(0, 5, self.chapter_title.upper(), 0, 1, 'R')
            self.line(10, 15, 200, 15)
            self.ln(3)

    def footer(self):
        if self.show_header_footer:
            self.set_y(-20)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(2)
            self.set_font('Times', 'I', 9)
            self.cell(0, 5, 'Department of Computer Science And Engineering', 0, 0, 'L')
            self.cell(0, 5, f'Page {self.page_label}', 0, 0, 'R')

    def chapter_cover(self, num, title, bullets=None):
        """Full-page chapter cover."""
        self.add_page()
        self.show_header_footer = False
        self.ln(60)
        self.set_font('Times', 'B', 16)
        self.cell(0, 10, f'CHAPTER {num}', 0, 1, 'R')
        self.set_font('Times', 'B', 28)
        self.cell(0, 15, title.upper(), 0, 1, 'R')
        if bullets:
            self.ln(10)
            self.set_font('Times', 'B', 12)
            for b in bullets:
                self.cell(0, 8, b, 0, 1, 'R')

    def section_title(self, num, title, level=1):
        """Section heading."""
        self.ln(5)
        if level == 1:
            self.set_font('Times', 'B', 14)
            self.cell(0, 8, f'{num} {title.upper()}', 0, 1, 'L')
            self.line(10, self.get_y(), 200, self.get_y())
        elif level == 2:
            self.set_font('Times', 'B', 12)
            self.cell(0, 8, f'{num} {title}', 0, 1, 'L')
        elif level == 3:
            self.set_font('Times', 'B', 11)
            self.cell(0, 7, f'{num} {title}', 0, 1, 'L')
        self.ln(3)

    def body_text(self, text):
        """Justified body paragraph."""
        self.set_font('Times', '', 12)
        self.multi_cell(0, 6, text, 0, 'J')
        self.ln(3)

    def bullet_point(self, text, bold_prefix=""):
        """Bullet point with optional bold prefix."""
        self.set_font('Times', '', 12)
        x = self.get_x()
        self.cell(5, 6, '', 0, 0)
        self.cell(5, 6, '-', 0, 0)
        if bold_prefix:
            self.set_font('Times', 'B', 12)
            self.write(6, f'{bold_prefix}: ')
            self.set_font('Times', '', 12)
        self.multi_cell(170, 6, text, 0, 'J')
        self.ln(2)

    def numbered_item(self, num, text, bold_prefix=""):
        """Numbered list item."""
        self.set_font('Times', '', 12)
        self.cell(5, 6, '', 0, 0)
        self.set_font('Times', 'B', 12)
        self.cell(8, 6, f'{num}.', 0, 0)
        if bold_prefix:
            self.write(6, f'{bold_prefix}: ')
            self.set_font('Times', '', 12)
        self.multi_cell(167, 6, text, 0, 'J')
        self.ln(2)

    def add_table(self, headers, rows, col_widths=None):
        """Simple table."""
        if col_widths is None:
            w = 190 / len(headers)
            col_widths = [w] * len(headers)
        # Header
        self.set_font('Times', 'B', 10)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 8, h, 1, 0, 'C')
        self.ln()
        # Rows
        self.set_font('Times', '', 10)
        for row in rows:
            max_h = 8
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 8, str(cell)[:40], 1, 0, 'C')
            self.ln()


def build_pdf():
    pdf = ThesisPDF()

    # ==================== PAGE 1: TITLE PAGE ====================
    pdf.add_page()
    pdf.show_header_footer = False
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
    pdf.ln(15)
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 7, 'INSTITUTE OF TECHNOLOGY AND ENGINEERING', 0, 1, 'C')
    pdf.cell(0, 7, 'INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ', 0, 1, 'C')
    pdf.cell(0, 7, 'AHMEDABAD-382115, GUJARAT, INDIA,', 0, 1, 'C')
    pdf.set_font('Times', '', 11)
    pdf.cell(0, 7, 'WEB: www.indusuni.ac.in', 0, 1, 'C')
    pdf.cell(0, 7, 'APRIL 2026', 0, 1, 'C')

    # ==================== PAGE 2: DETAILED TITLE ====================
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
    pdf.cell(95, 6, 'Department of Computer Science and Engineering,', 0, 1, 'C')
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

    # ==================== PAGE 3: DECLARATION ====================
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
    pdf.ln(25)
    pdf.line(10, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(3)
    pdf.cell(0, 7, "Candidate's Signature", 0, 1, 'L')
    pdf.set_font('Times', '', 12)
    pdf.cell(0, 7, 'Arya Shah (IU2241230098)', 0, 1, 'L')
    pdf.ln(40)
    pdf.line(10, pdf.get_y(), 80, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 11)
    pdf.cell(0, 6, 'Guide : Prof. Ruchi Patel', 0, 1, 'L')
    pdf.cell(0, 6, 'Assistant Professor', 0, 1, 'L')
    pdf.cell(0, 6, 'Department of Computer Science And Engineering,', 0, 1, 'L')
    pdf.cell(0, 6, 'Indus Institute of Technology and Engineering', 0, 1, 'L')
    pdf.cell(0, 6, 'INDUS UNIVERSITY - Ahmedabad,', 0, 1, 'L')
    pdf.cell(0, 6, 'State: Gujarat', 0, 1, 'L')

    # ==================== PAGE 4: CERTIFICATE ====================
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
    # Three signature blocks
    col_w = 63
    pdf.line(10, pdf.get_y(), 60, pdf.get_y())
    pdf.line(73, pdf.get_y(), 133, pdf.get_y())
    pdf.line(140, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    pdf.set_font('Times', '', 9)
    pdf.cell(col_w, 5, 'Prof. Ruchi Patel', 0, 0, 'L')
    pdf.cell(col_w, 5, 'Dr. Kaushal Jani', 0, 0, 'C')
    pdf.cell(col_w, 5, 'Prof. Zalak Vyas', 0, 1, 'R')
    pdf.cell(col_w, 5, 'Assistant Professor,', 0, 0, 'L')
    pdf.cell(col_w, 5, 'Head of Department,', 0, 0, 'C')
    pdf.cell(col_w, 5, 'Head of Department,', 0, 1, 'R')
    pdf.cell(col_w, 5, 'Department of Computer', 0, 0, 'L')
    pdf.cell(col_w, 5, 'Department of Computer', 0, 0, 'C')
    pdf.cell(col_w, 5, 'Department of Computer', 0, 1, 'R')
    pdf.cell(col_w, 5, 'Science And Engineering,', 0, 0, 'L')
    pdf.cell(col_w, 5, 'Science And Engineering,', 0, 0, 'C')
    pdf.cell(col_w, 5, 'Science And Engineering,', 0, 1, 'R')
    pdf.cell(col_w, 5, 'IITE, Indus University,', 0, 0, 'L')
    pdf.cell(col_w, 5, 'IITE, Indus University,', 0, 0, 'C')
    pdf.cell(col_w, 5, 'IITE, Indus University,', 0, 1, 'R')
    pdf.cell(col_w, 5, 'Ahmedabad', 0, 0, 'L')
    pdf.cell(col_w, 5, 'Ahmedabad', 0, 0, 'C')
    pdf.cell(col_w, 5, 'Ahmedabad', 0, 1, 'R')

    # ==================== ABSTRACT ====================
    pdf.add_page()
    pdf.show_header_footer = False
    pdf.ln(5)
    pdf.set_font('Times', 'B', 18)
    pdf.cell(0, 10, 'ABSTRACT', 0, 1, 'L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    pdf.body_text(
        'The rapid growth of retail participation in global stock markets has created a critical demand for intelligent, '
        'accessible, and real-time financial analysis tools. Traditional stock market platforms either provide raw data '
        'without actionable insights or charge prohibitive subscription fees for AI-driven analytics, creating a significant '
        'accessibility gap for individual investors. This thesis presents the design, development, and deployment of an '
        'AI-Powered Stock Market Analysis Platform - a full-stack web application that democratizes financial intelligence '
        'through deep learning.'
    )
    pdf.body_text(
        'Our approach integrates three independent microservices into a cohesive analytical ecosystem. First, a React 18 '
        'frontend delivers a responsive, dark-themed user interface featuring real-time market dashboards, interactive '
        'price charts built with Recharts, and a simulated paper trading engine that allows users to practice buy/sell '
        'strategies without financial risk. The frontend communicates with the backend through Axios HTTP clients '
        'augmented with JWT interceptor-based authentication.'
    )
    pdf.body_text(
        'Second, a Node.js/Express backend serves as the API gateway and business logic layer. It implements JWT-based '
        'authentication with bcrypt password hashing (12 salt rounds), manages user portfolios and watchlists through '
        'MongoDB via Mongoose ODM, and provides real-time stock price feeds using Socket.IO WebSocket connections. '
        'The backend employs a multi-layered security architecture including Helmet for HTTP header hardening, '
        'express-rate-limit for API throttling (100 requests per 15 minutes), and express-validator for input sanitization.'
    )
    pdf.body_text(
        'Third, and most critically, a Python FastAPI microservice houses the core artificial intelligence engine. The '
        'service deploys a multi-layer Long Short-Term Memory (LSTM) neural network built with TensorFlow/Keras for '
        'time-series stock price forecasting. The LSTM architecture comprises three stacked recurrent layers (128, 64, '
        'and 32 units) with Dropout regularization (0.2) to prevent overfitting, followed by a Dense output layer. The '
        'model is trained on two years of historical market data fetched via the Yahoo Finance API (yfinance), using a '
        'sliding window of 60 time steps with MinMaxScaler normalization. The system generates configurable prediction '
        'horizons (1-365 days) and provides comprehensive evaluation metrics including RMSE, MAE, R-squared Score, '
        'and MAPE to quantify prediction confidence.'
    )
    pdf.body_text(
        'Experimental results demonstrate that the LSTM model achieves an R-squared Score of 0.9159 and a MAPE of '
        '1.02% on test data for major market indices, confirming strong predictive capability for short-to-medium term '
        'price forecasting. The platform supports real-time WebSocket price updates, AI-powered stock recommendations '
        'with confidence scoring, and a comprehensive learning center for financial literacy.'
    )
    pdf.ln(3)
    pdf.set_font('Times', 'B', 12)
    pdf.write(6, 'Keywords: ')
    pdf.set_font('Times', '', 12)
    pdf.write(6, 'Stock Market Prediction, LSTM Neural Network, Deep Learning, Full-Stack Web Application, '
               'React, Node.js, FastAPI, Time-Series Forecasting, Real-Time Data.')

    # ==================== CHAPTER 1: INTRODUCTION ====================
    pdf.chapter_cover('1', 'Introduction', [
        'AI-POWERED STOCK MARKET',
        'ANALYSIS PLATFORM'
    ])

    pdf.show_header_footer = True
    pdf.chapter_title = "Introduction"
    pdf.page_label = ""

    pdf.add_page()
    pdf.section_title('1.1', 'Project Summary')
    pdf.body_text(
        'This project develops an AI-Powered Stock Market Analysis Platform - a comprehensive full-stack web '
        'application that combines real-time market data visualization, deep learning-based price forecasting, and '
        'simulated paper trading into a single, unified platform. The system employs a microservices architecture '
        'consisting of a React 18 frontend for interactive data presentation, a Node.js/Express backend for API '
        'orchestration and user management via MongoDB, and a Python FastAPI service that deploys a multi-layer '
        'LSTM (Long Short-Term Memory) neural network for stock price prediction. The platform, branded as '
        '"StockAI," provides retail investors with institutional-grade analytical capabilities including real-time '
        'WebSocket price feeds, AI-powered stock recommendations with confidence scoring, interactive historical '
        'price charts, and comprehensive model evaluation metrics (RMSE, MAE, R-squared Score, MAPE).'
    )

    pdf.section_title('1.2', 'Project Purpose')
    pdf.body_text(
        'The purpose of this project is to bridge the gap between institutional-grade financial analytics and retail '
        'investors. Traditional stock analysis tools present raw numerical data - price, volume, and percentage '
        'changes - without actionable predictive insights. Advanced platforms that incorporate AI-driven forecasting, '
        'such as Bloomberg Terminal or Refinitiv Eikon, carry annual subscription costs exceeding $20,000, rendering '
        'them inaccessible to individual investors and students.'
    )
    pdf.body_text(
        'By developing an open-source, web-based platform that integrates LSTM neural networks for time-series '
        'forecasting directly into a user-friendly dashboard, this project democratizes financial intelligence. The '
        'system enables users to not only monitor real-time market data but also generate AI-powered predictions for '
        'any supported stock symbol, view model confidence metrics, practice trading strategies through a paper '
        'trading simulator, and build personalized watchlists - all within a single browser-based interface.'
    )

    pdf.add_page()
    pdf.section_title('1.3', 'Project Scope')
    pdf.body_text('The scope of this project encompasses:')
    pdf.bullet_point('Development of a responsive, dark-themed React 18 single-page application (SPA) with multiple interactive views including Dashboard, Stock Detail, AI Predictions, Watchlist, Discover, Trading History, News, and Learning Center.', 'Frontend Application')
    pdf.bullet_point('Implementation of a RESTful API server using Node.js/Express with MongoDB persistence for user accounts, watchlists, stock data caching, and trade history. The backend implements JWT-based authentication, rate limiting, CORS configuration, and WebSocket (Socket.IO) real-time data streaming.', 'Backend API Layer')
    pdf.bullet_point('Deployment of a Python FastAPI microservice hosting a TensorFlow/Keras LSTM model trained on Yahoo Finance historical data. The service provides endpoints for on-demand stock price prediction with configurable horizons (1-365 days), model training, and prediction accuracy history.', 'Machine Learning Service')
    pdf.bullet_point('Integration with Yahoo Finance (yfinance) for fetching two years of historical OHLCV (Open, High, Low, Close, Volume) data, with MinMaxScaler normalization and a sliding window of 60 time steps for sequence generation.', 'Data Pipeline')
    pdf.bullet_point('A simulated trading system that allows authenticated users to execute buy/sell transactions, track portfolio performance (Total Trades, Total Bought, Total Sold, Net P&L), and review complete transaction history.', 'Paper Trading Engine')

    pdf.add_page()
    pdf.section_title('1.4', 'Objectives')
    pdf.section_title('1.4.1', 'Main Objectives', level=2)
    pdf.bullet_point('To design and develop a full-stack web platform that provides real-time stock market data visualization with interactive charting capabilities (1W, 1M, 3M, 6M, 1Y intervals).')
    pdf.bullet_point('To implement and deploy a deep learning LSTM neural network capable of generating accurate short-to-medium term stock price forecasts with quantifiable confidence metrics.')
    pdf.bullet_point('To build a secure, scalable microservices architecture that cleanly separates the presentation layer (React), business logic (Node.js/Express), and AI inference engine (Python/FastAPI).')

    pdf.section_title('1.4.2', 'Secondary Objectives', level=2)
    pdf.bullet_point('To develop a paper trading simulator that enables users to practice investment strategies without financial risk.')
    pdf.bullet_point('To implement an AI-powered stock recommendation engine that categorizes stocks as "Strong Buy," "Buy," or "Hold" with associated confidence percentages.')
    pdf.bullet_point('To create a comprehensive Learning Center that educates users on platform features and stock market fundamentals.')
    pdf.bullet_point('To ensure platform security through JWT authentication, bcrypt password hashing, rate limiting, and HTTP header hardening.')

    pdf.section_title('1.5', 'Technology and Literature Overview')
    pdf.body_text('This project leverages several key technologies across its three-tier architecture:')
    pdf.bullet_point('TensorFlow/Keras LSTM networks are utilized for their proven effectiveness in modeling sequential dependencies in time-series financial data.', 'Deep Learning')
    pdf.bullet_point('React 18 with React Router v6 provides a component-based, single-page application architecture with client-side routing.', 'Frontend Framework')
    pdf.bullet_point('Recharts library enables interactive, responsive charting for stock price history and AI prediction overlays.', 'Data Visualization')
    pdf.bullet_point('Socket.IO WebSocket protocol delivers live stock price updates without polling overhead.', 'Real-Time Communication')
    pdf.bullet_point('MongoDB with Mongoose ODM provides flexible, schema-based document storage for users, stocks, watchlists, and trades.', 'Database')
    pdf.bullet_point('Yahoo Finance API (via yfinance Python library) provides free, reliable historical and real-time market data.', 'Data Source')

    pdf.add_page()
    pdf.section_title('1.6', 'Synopsis')
    pdf.body_text(
        'In summary, this thesis presents a comprehensive approach to stock market analysis that combines real-time '
        'data visualization with deep learning-based price forecasting. By integrating an LSTM neural network into a '
        'modern web application with paper trading capabilities, we demonstrate a platform that empowers retail investors '
        'with institutional-grade analytical tools. The system achieves an R-squared Score of 0.9159 and MAPE of 1.02%, '
        'confirming the viability of LSTM networks for short-term stock price prediction when deployed within a '
        'production-ready web architecture.'
    )

    # ==================== CHAPTER 2: LITERATURE SURVEY ====================
    pdf.chapter_cover('2', 'Literature Survey')
    pdf.chapter_title = "Literature Survey"
    pdf.add_page()

    pdf.section_title('2.1', 'Introduction to Survey')
    pdf.body_text(
        'The goal of this survey is to bridge the gap between academic research in financial time-series forecasting and '
        'the practical engineering required to deploy such models within production web applications. While extensive '
        'research exists on the theoretical performance of various machine learning models for stock prediction, '
        'significantly less attention has been paid to the end-to-end integration of these models into user-facing platforms '
        'that provide actionable insights alongside raw predictions.'
    )

    pdf.section_title('2.2', 'Why Survey?')
    pdf.body_text('The survey serves three primary purposes:')
    pdf.bullet_point('Understanding why LSTM networks outperform traditional statistical models (ARIMA, GARCH) and classical ML approaches (SVM, Random Forest) for stock price time-series forecasting.', 'Algorithm Selection')
    pdf.bullet_point('Justifying the selection of a three-tier microservices architecture (React + Express + FastAPI) over monolithic alternatives.', 'Architecture Validation')
    pdf.bullet_point('Analyzing how existing platforms handle data normalization, sequence generation, and prediction horizon configuration.', 'Feature Engineering Baseline')

    pdf.section_title('2.3', 'Evolution of Stock Price Prediction Models')
    pdf.body_text(
        'The field of stock market prediction has undergone a significant transformation over the past decade, moving '
        'from traditional econometric models to deep learning architectures.'
    )
    pdf.bullet_point('Traditional approaches such as ARIMA and GARCH have been the foundation of financial time-series analysis. However, recent studies demonstrate that these linear models fail to capture the non-linear, non-stationary dynamics inherent in stock market data.', 'Statistical Models')
    pdf.bullet_point('Models such as Support Vector Machines (SVM) and Random Forest have shown improvement over statistical methods. However, they treat each data point independently and cannot natively model the sequential dependencies that characterize financial time-series data.', 'Classical Machine Learning')
    pdf.bullet_point('The introduction of RNNs, and specifically LSTM networks by Hochreiter & Schmidhuber (1997), revolutionized sequence modeling. LSTMs address the vanishing gradient problem through their gating mechanisms, enabling them to learn long-term dependencies in price sequences.', 'Recurrent Neural Networks')

    pdf.add_page()
    pdf.section_title('2.4', 'LSTM Networks for Financial Forecasting')
    pdf.body_text('Long Short-Term Memory networks have become the dominant architecture for stock price prediction in recent literature.')
    pdf.bullet_point('Research by Fischer and Krauss (2018) demonstrated that LSTM networks consistently outperform traditional models across multiple stock indices, achieving directional accuracy rates exceeding 55%.', 'Architecture Superiority')
    pdf.bullet_point('Current research emphasizes the importance of selecting appropriate input features. Single-feature models using Close Price alone achieve competitive accuracy with significantly reduced computational overhead.', 'Feature Selection')
    pdf.bullet_point('Studies by Moghar and Hamiche (2020) validate the use of multiple stacked LSTM layers with decreasing unit counts (e.g., 128 to 64 to 32) and Dropout regularization to improve generalization.', 'Stacked LSTM Architectures')

    pdf.section_title('2.5', 'Full-Stack Financial Platforms')
    pdf.body_text('The integration of machine learning models into production web applications remains an active area of engineering research.')
    pdf.bullet_point('Modern financial platforms separate the ML inference engine from the user-facing application through RESTful APIs. This pattern enables independent scaling of the prediction service based on demand.', 'API-First Architecture')
    pdf.bullet_point('The shift from HTTP polling to WebSocket-based real-time data delivery has been extensively documented. Socket.IO provides the reliability layer required for production financial data streaming.', 'Real-Time Data Delivery')

    pdf.section_title('2.6', 'Evaluation Metrics for Prediction Models')
    pdf.bullet_point('Root Mean Squared Error and Mean Absolute Error quantify the average magnitude of prediction errors, with RMSE penalizing larger deviations more heavily.', 'RMSE and MAE')
    pdf.bullet_point('The coefficient of determination measures the proportion of variance in the actual prices that is explained by the model predictions. An R-squared Score approaching 1.0 indicates strong predictive capability.', 'R-squared Score')
    pdf.bullet_point('Mean Absolute Percentage Error provides a scale-independent measure of accuracy. A MAPE below 5% is generally considered excellent for financial forecasting.', 'MAPE')

    # ==================== CHAPTER 3: PROJECT MANAGEMENT ====================
    pdf.chapter_cover('3', 'Project Management', ['3.1 Project Planning Objectives', '3.2 Project Scheduling', '3.3 Risk Management'])
    pdf.chapter_title = "Project Management"
    pdf.add_page()

    pdf.section_title('3.1', 'PROJECT PLANNING OBJECTIVES')
    pdf.body_text(
        'The primary objective of the planning phase was to coordinate the parallel development of three independent '
        'microservices - the React frontend, the Node.js/Express backend, and the Python FastAPI ML service - while '
        'ensuring seamless API contract compliance between them.'
    )
    pdf.bullet_point('Defining clear API boundaries between the frontend, backend, and ML service to enable independent development and testing.', 'Scope Management')
    pdf.bullet_point('Ensuring all development tools, cloud services, and data sources (Yahoo Finance API) were configured and accessible within the 8th-semester timeline.', 'Resource Allocation')

    pdf.section_title('3.1.1', 'Software Scope', level=2)
    pdf.body_text('The software scope involves the development and integration of four distinct architectural modules:')
    pdf.numbered_item(1, 'A React 18 single-page application with 10+ interactive views, Recharts-based data visualization, Axios HTTP client with JWT interceptors, and Socket.IO real-time data streaming.', 'The Frontend Application')
    pdf.numbered_item(2, 'A Node.js/Express server implementing RESTful endpoints for authentication, stock data retrieval with 60-second caching, watchlist CRUD operations, paper trading execution, and ML service proxying.', 'The API Gateway')
    pdf.numbered_item(3, 'A Python FastAPI service hosting a TensorFlow/Keras LSTM model with endpoints for on-demand prediction, model training, and prediction history retrieval.', 'The AI Prediction Engine')
    pdf.numbered_item(4, 'MongoDB database with Mongoose ODM schemas for Users (with bcrypt-hashed passwords), Stocks (with historical data arrays), and Watchlists (with per-user stock tracking, max 50 symbols).', 'The Data Persistence Layer')

    pdf.section_title('3.1.2', 'Resources', level=2)
    pdf.bullet_point('The project was executed by a single final-year B.Tech CSE student, responsible for all aspects of design, development, and testing.', 'Human Resource')
    pdf.bullet_point('The project utilized open-source libraries including React, Express.js, TensorFlow/Keras, FastAPI, Mongoose, Recharts, Socket.IO, and yfinance.', 'Reusable Software Resources')
    pdf.bullet_point('A local development environment was configured with Node.js (v18+), Python 3.10+, MongoDB Community Server, and modern web browsers.', 'Environment Resource')

    pdf.add_page()
    pdf.section_title('3.1.3', 'Project Development Approach', level=2)
    pdf.body_text(
        'An Agile Methodology was adopted, allowing for iterative development and testing of individual microservices. '
        'This approach was essential because the LSTM model hyperparameters (sequence length, number of layers, dropout '
        'rate, learning rate) required multiple tuning iterations to achieve optimal prediction accuracy. Sprint cycles of '
        'two weeks were used, with each sprint delivering a functional increment of the platform.'
    )

    pdf.section_title('3.2', 'PROJECT SCHEDULING')
    pdf.body_text(
        'The complexity of integrating deep learning inference with real-time web data delivery required a structured, '
        'phase-gate scheduling approach. A 16-week timeline was established, ensuring that each microservice was '
        'independently verified before full-stack integration testing.'
    )

    pdf.section_title('3.2.1', 'Basic Principal', level=2)
    pdf.bullet_point('Developing the LSTM model in a Python environment while simultaneously building the Express API routes and React UI components.', 'Parallelism')
    pdf.bullet_point('Defining the REST API contracts before implementing either the backend or frontend, ensuring both could be developed independently against mock data.', 'API-First Design')
    pdf.bullet_point('A 2-week "Contingency Buffer" was placed at the end of the integration phase to account for potential issues in LSTM model accuracy or WebSocket synchronization.', 'Buffer Allocation')

    pdf.section_title('3.2.5', 'Time Allocation (Timeline Chart)', level=2)
    pdf.add_table(
        ['Phase', 'Milestone', 'Duration', 'Key Deliverable'],
        [
            ['I', 'Requirements & Architecture', 'Weeks 1-2', 'API Contracts & DB Schemas'],
            ['II', 'Backend API & Auth', 'Weeks 3-5', 'REST API with JWT Auth'],
            ['III', 'LSTM Model Development', 'Weeks 6-8', 'Trained Model (R2 > 0.90)'],
            ['IV', 'Frontend Development', 'Weeks 9-11', 'React SPA (10+ views)'],
            ['V', 'Integration & Tuning', 'Weeks 12-14', 'Full-Stack Platform'],
            ['VI', 'Evaluation & Documentation', 'Weeks 15-16', 'Thesis and Demo'],
        ],
        [15, 55, 25, 55]
    )

    pdf.add_page()
    pdf.section_title('3.3', 'RISK MANAGEMENT')
    pdf.body_text(
        'Risk management is a continuous process in this project, ensuring that technical challenges in deep learning '
        'model accuracy, API reliability, or frontend performance do not compromise the quality of the delivered platform.'
    )

    pdf.section_title('3.3.1', 'Risk Identification', level=2)
    pdf.bullet_point('The LSTM model might overfit on historical training data and fail to generalize to recent market conditions.', 'Model Accuracy Risk')
    pdf.bullet_point('The platform depends on Yahoo Finance (yfinance) as its primary data source. API rate limits or service outages could disrupt the prediction pipeline.', 'Data Source Dependency')
    pdf.bullet_point('WebSocket connections for live price updates might introduce latency or connection drops under high user concurrency.', 'Real-Time Performance')
    pdf.bullet_point('The backend dependency on the ML service (port 8000) creates a potential point of failure if the Python service crashes.', 'Cross-Service Communication')

    pdf.section_title('3.3.2', 'Risk Projection and Mitigation', level=2)
    pdf.bullet_point('The backend implements mock data fallback mechanisms. If the ML service is unavailable, the system generates approximate predictions, ensuring the platform remains functional.', 'Graceful Degradation')
    pdf.bullet_point('The LSTM training employs Early Stopping with a patience of 10 epochs, automatically halting training when validation loss plateaus to prevent overfitting.', 'Early Stopping')
    pdf.bullet_point('Trained models are persisted to disk (.keras format) and cached in memory, eliminating retraining on every prediction request.', 'Model Caching')

    # ==================== CHAPTER 4: SYSTEM REQUIREMENTS ====================
    pdf.chapter_cover('4', 'System Requirements', ['4.1 Introduction', '4.2 Hardware Specifications', '4.3 Software Specifications'])
    pdf.chapter_title = "System Requirements"
    pdf.add_page()

    pdf.section_title('4.1', 'INTRODUCTION')
    pdf.body_text(
        'The system requirements for this project are categorized into Hardware and Software specifications. The primary '
        'challenge was selecting a technology stack capable of handling the computational intensity of LSTM neural network '
        'training and inference, the I/O throughput of real-time WebSocket data streaming, and the concurrent database '
        'operations of a multi-user web application.'
    )

    pdf.section_title('4.2', 'HARDWARE SPECIFICATIONS')
    pdf.section_title('4.2.1', 'Development Workstation', level=2)
    pdf.bullet_point('Apple M-series or Intel Core i5/i7 (multi-core required for parallel service execution).', 'Processor')
    pdf.bullet_point('8 GB RAM minimum (16 GB recommended for concurrent LSTM training and frontend development).', 'Memory')
    pdf.bullet_point('256 GB SSD (required for fast MongoDB read/write operations and model file I/O).', 'Storage')
    pdf.bullet_point('Broadband internet connection (required for real-time Yahoo Finance data fetching).', 'Network')

    pdf.section_title('4.3', 'SOFTWARE SPECIFICATIONS')
    pdf.section_title('4.3.1', 'Frontend Stack', level=2)
    pdf.bullet_point('Core UI framework with functional components and hooks.', 'React 18.2.0')
    pdf.bullet_point('Client-side routing for SPA navigation across 10+ views.', 'React Router v6')
    pdf.bullet_point('Composable charting library for stock price and prediction visualization.', 'Recharts 2.10.3')
    pdf.bullet_point('Promise-based HTTP client with JWT interceptor for authenticated API calls.', 'Axios 1.6.2')
    pdf.bullet_point('WebSocket client for real-time stock price subscriptions.', 'Socket.IO Client 4.7.2')

    pdf.add_page()
    pdf.section_title('4.3.2', 'Backend Stack', level=2)
    pdf.bullet_point('Minimal web framework for REST API routing.', 'Express.js 4.18.2')
    pdf.bullet_point('MongoDB ODM for schema definition and validation.', 'Mongoose 7.6.3')
    pdf.bullet_point('JWT token generation and verification (7-day expiry).', 'jsonwebtoken 9.0.2')
    pdf.bullet_point('Password hashing library (12 salt rounds).', 'bcryptjs')
    pdf.bullet_point('HTTP security header middleware.', 'Helmet 7.1.0')
    pdf.bullet_point('API request throttling (100 requests/15 minutes).', 'express-rate-limit 7.1.4')

    pdf.section_title('4.3.3', 'Machine Learning Stack', level=2)
    pdf.bullet_point('High-performance async web framework for ML inference API.', 'FastAPI 0.104.1')
    pdf.bullet_point('Deep learning framework for LSTM model construction and training.', 'TensorFlow 2.18.0+')
    pdf.bullet_point('MinMaxScaler normalization and train/test splitting utilities.', 'scikit-learn 1.6.0+')
    pdf.bullet_point('Yahoo Finance API wrapper for fetching historical OHLCV data.', 'yfinance 0.2.33+')
    pdf.bullet_point('Serialization of fitted scaler objects for inference.', 'joblib 1.3.2')

    # ==================== CHAPTER 5: SYSTEM ANALYSIS ====================
    pdf.chapter_cover('5', 'System Analysis', ['5.1 Study of Current System', '5.2 Problems in Current System', '5.3 Requirement of New System', '5.4 Identification of Research Gaps', '5.5 Proposed System Rationale', '5.6 Feasibility Study', '5.7 Features of New System'])
    pdf.chapter_title = "System Analysis"
    pdf.add_page()

    pdf.section_title('5.1', 'STUDY OF CURRENT SYSTEM')
    pdf.body_text(
        'The current landscape of stock market analysis platforms is dominated by two categories: free consumer-grade '
        'applications and premium institutional platforms. Consumer applications such as Yahoo Finance, Google Finance, '
        'and TradingView provide real-time stock data and basic technical indicators. However, these platforms treat '
        'users as passive data consumers, presenting raw numbers without predictive intelligence.'
    )
    pdf.body_text(
        'On the institutional side, platforms like Bloomberg Terminal ($24,000/year) and Refinitiv Eikon provide '
        'AI-driven analytics and quantitative models. These platforms are designed for professional traders with deep '
        'technical expertise and significant financial resources. This creates a two-tier market where retail investors '
        'are systematically disadvantaged in their access to predictive financial intelligence.'
    )

    pdf.section_title('5.2', 'PROBLEMS IN CURRENT SYSTEM')
    pdf.numbered_item(1, 'AI-powered stock prediction models exist in academic research but are rarely integrated into user-friendly web applications. Retail investors must choose between expensive institutional platforms or building their own ML pipelines.', 'The Prediction Accessibility Gap')
    pdf.numbered_item(2, 'Current free platforms require users to switch between multiple tools - one for real-time quotes, another for charting, a third for news, and a separate spreadsheet for portfolio tracking.', 'Fragmented User Experience')
    pdf.numbered_item(3, 'Platforms that offer AI predictions rarely expose the underlying model metrics (RMSE, MAE, R-squared, MAPE). Users receive a predicted price without understanding the model confidence level.', 'The Transparency Deficit')
    pdf.numbered_item(4, 'Most stock platforms connect directly to real brokerage accounts. New investors have no way to practice trading strategies without risking actual capital.', 'No Risk-Free Practice Environment')

    pdf.add_page()
    pdf.section_title('5.3', 'REQUIREMENT OF NEW SYSTEM')
    pdf.bullet_point('All functionality - real-time data, AI predictions, charting, watchlists, trading, news, and education - must be accessible through a single web interface.', 'Unified Platform')
    pdf.bullet_point('Every AI prediction must be accompanied by comprehensive evaluation metrics (RMSE, MAE, R-squared, MAPE) and an AI Confidence score.', 'Transparent Model Metrics')
    pdf.bullet_point('The platform must include a simulated trading engine with realistic buy/sell mechanics, portfolio tracking, and P&L calculation.', 'Paper Trading Integration')

    pdf.section_title('5.5', 'PROPOSED SYSTEM RATIONALE')
    pdf.body_text('To bridge these identified gaps, the proposed system introduces three core technical innovations:')
    pdf.numbered_item(1, 'By deploying a pre-trained LSTM neural network as a standalone FastAPI microservice, the platform achieves on-demand stock price forecasting without coupling the ML model to the web application lifecycle.', 'LSTM-Powered Prediction API')
    pdf.numbered_item(2, 'Every prediction is accompanied by a comprehensive metrics panel (RMSE: 4.1308, MAE: 1.1950, R-squared: 0.9159, MAPE: 1.02%) and an AI Confidence bar (92%).', 'Transparent AI Dashboard')
    pdf.numbered_item(3, 'Users can immediately act on AI predictions through a simulated trading system that tracks Total Trades, Total Bought, Total Sold, and Net P&L.', 'Integrated Paper Trading Engine')

    pdf.section_title('5.6', 'FEASIBILITY STUDY')
    pdf.section_title('', 'Technical Feasibility', level=2)
    pdf.body_text('The project is technically feasible because TensorFlow/Keras provides a mature, well-documented framework for LSTM model construction. The availability of Yahoo Finance data through the yfinance library eliminates the need for expensive market data subscriptions. React 18 and Express.js are industry-standard frameworks with extensive community support.')
    pdf.section_title('', 'Operational Feasibility', level=2)
    pdf.body_text('The system is highly operational as it requires minimal configuration once deployed. The ML service automatically trains and caches models on first prediction request. The backend gracefully falls back to mock data when external services are unavailable.')
    pdf.section_title('', 'Economical Feasibility', level=2)
    pdf.body_text('The system is built entirely on open-source technologies (React, Express, TensorFlow, FastAPI, MongoDB Community Edition) with zero licensing costs. The only operational costs are server hosting and domain registration.')
    pdf.section_title('', 'Schedule Feasibility', level=2)
    pdf.body_text('By following the 16-week timeline established in Chapter 3, the project was completed in distinct phases (Backend to ML to Frontend to Integration), ensuring all milestones were met before the final thesis submission.')

    pdf.add_page()
    pdf.section_title('5.7', 'FEATURES OF NEW SYSTEM')
    pdf.bullet_point('Live market indices (S&P 500, NASDAQ, Dow Jones) with auto-refreshing stock quotes, Top Gainers/Losers panels, and Quick Access sidebar.', 'Real-Time Market Dashboard')
    pdf.bullet_point('LSTM neural network predictions with configurable horizons (1-365 days), interactive Actual vs. Predicted overlay charts, and comprehensive model metrics.', 'AI-Powered Predictions')
    pdf.bullet_point('Simulated buy/sell execution with quantity selection, real-time portfolio tracking (Total Trades, Total Bought, Total Sold, Net P&L), and complete transaction history.', 'Paper Trading Simulator')
    pdf.bullet_point('Authenticated users can track up to 50 stocks with real-time price updates and percentage change indicators.', 'Personalized Watchlist')
    pdf.bullet_point('Categorized recommendations (Top Gainers, Top Losers, Most Active, Best Value) with confidence percentages and Strong Buy/Buy/Hold labels.', 'AI Stock Recommendations')
    pdf.bullet_point('Recharts-powered price charts with 1W, 1M, 3M, 6M, and 1Y interval selection.', 'Interactive Charting')
    pdf.bullet_point('Searchable educational content covering platform usage guides and stock market fundamentals.', 'Learning Center')

    # ==================== CHAPTER 6-11 (condensed for PDF size) ====================

    # CHAPTER 6
    pdf.chapter_cover('6', 'Detail Description', ['6.1 System Architecture and Module Overview', '6.2 Module Description (Actor-Based Logic)', '6.3 Database Design and Persistence Logic'])
    pdf.chapter_title = "Detail Description"
    pdf.add_page()

    pdf.section_title('6.1', 'SYSTEM ARCHITECTURE AND MODULE OVERVIEW')
    pdf.body_text('The architecture of the proposed StockAI platform operates through a continuous, four-stage data pipeline:')
    pdf.numbered_item(1, 'The Node.js backend fetches real-time and historical stock data from external market data providers (Yahoo Finance). Stock quotes are cached in-memory using node-cache with a 60-second TTL.', 'Data Ingestion & Caching')
    pdf.numbered_item(2, 'When a user requests a prediction, the backend proxies the request to the Python FastAPI ML service. The ML service loads the appropriate pre-trained LSTM model, generates predictions using autoregressive forecasting, and returns predictions along with evaluation metrics.', 'AI Inference (LSTM)')
    pdf.numbered_item(3, 'The Socket.IO WebSocket layer maintains persistent bidirectional connections between the backend and frontend clients. Stock price updates are broadcast to subscribed clients in per-symbol rooms.', 'Real-Time Communication')
    pdf.numbered_item(4, 'User actions (registration, login, watchlist management, paper trades) are processed through JWT-authenticated API endpoints and persisted to MongoDB via Mongoose ODM.', 'User Interaction & Persistence')

    pdf.add_page()
    pdf.section_title('6.2', 'MODULE DESCRIPTION (ACTOR-BASED LOGIC)')
    pdf.section_title('6.2.1', 'The User Module', level=2)
    pdf.bullet_point('The user accesses the Dashboard page to view real-time market indices (S&P 500, NASDAQ, Dow Jones), browse the All Stocks table, and identify Top Gainers/Losers.', 'Market Monitoring')
    pdf.bullet_point('The user navigates to the Predictions page, selects a stock symbol, and triggers LSTM prediction generation. The system returns an interactive Actual vs. Predicted chart with model metrics.', 'AI Prediction Request')
    pdf.bullet_point('Authenticated users can execute simulated Buy/Sell trades from the Stock Detail page. The system records the transaction with timestamp and updates the portfolio balance.', 'Paper Trading')
    pdf.bullet_point('Users add/remove stocks to a personalized watchlist (max 50 symbols) for quick price monitoring with real-time percentage change indicators.', 'Watchlist Management')

    pdf.section_title('6.2.2', 'The Backend API Module', level=2)
    pdf.bullet_point('All frontend requests are routed through the Express API, which handles authentication verification, input validation, rate limiting, and request proxying.', 'API Gateway')
    pdf.bullet_point('The stock data service implements node-cache with a 60-second TTL, dramatically reducing the number of external API calls.', 'Data Caching')
    pdf.bullet_point('When external data sources or the ML service are unavailable, the backend seamlessly switches to mock data generation.', 'Mock Data Fallback')

    pdf.section_title('6.2.3', 'The ML Prediction Module', level=2)
    pdf.bullet_point('The StockPredictor class implements a three-layer stacked LSTM network (128, 64, 32 units) with Dropout regularization (0.2), followed by a Dense(16, ReLU) layer and a Dense(1) output layer.', 'LSTM Architecture')
    pdf.bullet_point('Historical Close prices are normalized to the [0, 1] range using MinMaxScaler. Sequences are generated using a sliding window of 60 time steps, with an 80/20 train/test split.', 'Data Preprocessing')
    pdf.bullet_point('For multi-day forecasting, the model uses its own predictions as input for subsequent predictions, iteratively extending the forecast horizon up to 365 days.', 'Autoregressive Prediction')
    pdf.bullet_point('Each prediction response includes RMSE, MAE, R-squared Score, and MAPE, calculated on the test set. An AI Confidence percentage is derived from the R-squared Score.', 'Model Metrics')

    pdf.add_page()
    pdf.section_title('6.3', 'DATABASE DESIGN AND PERSISTENCE LOGIC')
    pdf.section_title('6.3.1', 'Database Schema', level=2)
    pdf.body_text('The architecture relies on three primary MongoDB collections:')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 1: Users (The Identity Registry)', 0, 1, 'L')
    pdf.set_font('Times', '', 12)
    pdf.bullet_point('_id (ObjectId): Auto-generated unique identifier')
    pdf.bullet_point('name (String, max 100 chars): User display name')
    pdf.bullet_point('email (String, unique, validated): Login credential with regex validation')
    pdf.bullet_point('password (String, bcrypt-hashed): 12 salt rounds for brute-force resistance')
    pdf.bullet_point('role (Enum: [user, admin], default: user): Role-based access control')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 2: Stocks (The Market Data Cache)', 0, 1, 'L')
    pdf.set_font('Times', '', 12)
    pdf.bullet_point('symbol (String, uppercase, indexed): Ticker symbol (e.g., "AAPL")')
    pdf.bullet_point('price, change, changePercent (Number): Current market data')
    pdf.bullet_point('volume, high, low, open, previousClose (Number): Daily trading metrics')
    pdf.bullet_point('historicalData (Array): Embedded time-series OHLCV data')

    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, 'Collection 3: Watchlists (The User Preference Store)', 0, 1, 'L')
    pdf.set_font('Times', '', 12)
    pdf.bullet_point('user (ObjectId, ref: User, unique): One watchlist per user')
    pdf.bullet_point('stocks (Array of {symbol, addedAt}): Tracked symbols, max 50 entries')

    # CHAPTER 7: TESTING
    pdf.chapter_cover('7', 'Testing', ['7.1 Black-Box Testing', '7.2 White-Box Testing', '7.3 Test Cases'])
    pdf.chapter_title = "Testing"
    pdf.add_page()

    pdf.section_title('7.1', 'BLACK-BOX TESTING')
    pdf.section_title('7.1.1', 'LSTM Prediction Accuracy (The "Intelligence" Test)', level=2)
    pdf.body_text('To evaluate the LSTM prediction model, we treated the FastAPI prediction endpoint as a black box.')
    pdf.bullet_point('A POST request to /api/predict with symbol "GOOGL" and days = 30.', 'Input')
    pdf.bullet_point('The system should return an array of 30 predicted prices with associated dates, along with model evaluation metrics.', 'Expected Output')
    pdf.body_text('Result: The LSTM model achieved the following metrics on test data:')

    pdf.add_table(
        ['Metric', 'Value', 'Interpretation'],
        [
            ['RMSE', '4.1308', 'Low prediction error'],
            ['MAE', '1.1950', 'Average $1.19 deviation'],
            ['R-squared', '0.9159', '91.6% variance explained'],
            ['MAPE', '1.02%', 'Excellent accuracy'],
            ['AI Confidence', '92%', 'High reliability'],
        ],
        [40, 40, 70]
    )

    pdf.ln(5)
    pdf.section_title('7.1.2', 'Authentication and Authorization Testing', level=2)
    pdf.body_text('The JWT middleware correctly rejected unauthorized requests (HTTP 401). Authenticated requests with valid tokens returned the expected data.')

    pdf.section_title('7.1.3', 'Paper Trading Accuracy Testing', level=2)
    pdf.body_text('The paper trading engine correctly calculated all trade totals, maintained accurate running balances, and recorded precise timestamps for each transaction.')

    pdf.add_page()
    pdf.section_title('7.2', 'WHITE-BOX TESTING')
    pdf.section_title('7.2.1', 'LSTM Data Pipeline Testing', level=2)
    pdf.body_text('We inserted validation checks at each stage of the pipeline - after yfinance data fetching, after MinMaxScaler normalization (verifying all values fall within [0, 1]), and after sequence generation (verifying each sequence has exactly 60 time steps). The sliding window correctly generates overlapping sequences, and the train/test split preserves temporal ordering (no data leakage).')

    pdf.section_title('7.2.2', 'API Response Structure Testing', level=2)
    pdf.body_text('Every API endpoint was tested for response structure compliance. Responses were validated against predefined JSON schemas to ensure consistent data contracts between the backend and frontend.')

    pdf.section_title('7.3', 'TEST CASES')
    pdf.add_table(
        ['TC ID', 'Feature', 'Action/Input', 'Expected Result', 'Pass/Fail'],
        [
            ['TC-01', 'LSTM Prediction', 'POST /predict GOOGL', 'R2=0.9159, 30 prices', 'PASS'],
            ['TC-02', 'Registration', 'POST /auth/register', 'JWT token returned', 'PASS'],
            ['TC-03', 'JWT Auth', 'GET /watchlist + token', 'Watchlist returned', 'PASS'],
            ['TC-04', 'Paper Trade', 'BUY 2 AAPL', 'Balance updated', 'PASS'],
            ['TC-05', 'WebSocket', 'Subscribe to AAPL', 'Updates in <1s', 'PASS'],
            ['TC-06', 'Data Cache', 'GET /quote/AAPL x2', 'Cached in <5ms', 'PASS'],
            ['TC-07', 'Watchlist Limit', 'Add 51st stock', 'HTTP 400 error', 'PASS'],
            ['TC-08', 'Mock Fallback', 'ML Service offline', 'Mock data returned', 'PASS'],
        ],
        [18, 30, 42, 55, 18]
    )

    # CHAPTER 8: SYSTEM DESIGN
    pdf.chapter_cover('8', 'System Design', ['8.1 Class Diagram', '8.2 Use-Case Diagram', '8.3 Sequence Diagram', '8.4 Activity Diagram', '8.5 Data Flow Diagram'])
    pdf.chapter_title = "System Design"
    pdf.add_page()

    pdf.section_title('8.1', 'CLASS DIAGRAM')
    pdf.body_text('The Class Diagram illustrates the static structure of the StockAI platform, detailing the software blueprint across three technology layers: the React Frontend (JavaScript), the Express Backend (JavaScript/Node.js), and the FastAPI ML Service (Python).')
    pdf.body_text('[Fig 8.1 - Class Diagram showing ApiService, AuthContext, PortfolioContext, SocketService classes on the frontend; AuthMiddleware, StockService, PredictionProxy on the backend; and StockPredictor, Configuration on the ML service]')

    pdf.section_title('8.2', 'USE-CASE DIAGRAM')
    pdf.body_text('The Use Case diagram identifies four primary actors: Unauthenticated User (Guest), Authenticated User (Investor), ML Service (FastAPI), and System Administrator. Use cases include View Dashboard, View Stock Detail, Generate AI Prediction, Execute Paper Trade, Manage Watchlist, Browse Recommendations, Access Learning Center, and View Transaction History.')
    pdf.body_text('[Fig 8.2 - Use-Case Diagram with system boundary showing Edge Intelligence Module and Consensus & Persistence Module]')

    pdf.section_title('8.3', 'SEQUENCE DIAGRAM')
    pdf.body_text('The Sequence Diagram maps the AI prediction request lifecycle across all three microservices: (1) User selects stock and clicks Generate Prediction, (2) Frontend sends POST to Express backend, (3) Backend proxies to FastAPI ML service, (4) ML service checks model cache, (5) If no cache, fetches yfinance data and trains LSTM, (6) Model generates autoregressive predictions, (7) Metrics calculated, (8) Response cascades back to frontend, (9) Recharts renders Actual vs. Predicted overlay.')
    pdf.body_text('[Fig 8.3 - Sequence Diagram showing message flow between User, React Frontend, Express Backend, FastAPI ML Service, and MongoDB]')

    pdf.add_page()
    pdf.section_title('8.4', 'ACTIVITY DIAGRAM')
    pdf.body_text('The Activity Diagram models the system execution across three swimlanes (React Frontend, Express Backend, FastAPI ML Service). Key decision forks include: Is classification malicious? Is ML Service available? Does cached model exist? Is consensus reached?')
    pdf.body_text('[Fig 8.4 - Activity Diagram with swimlanes showing parallel processing paths]')

    pdf.section_title('8.5', 'DATA FLOW DIAGRAMS (DFD)')
    pdf.section_title('8.5.1', 'Level 0 DFD (Context Diagram)', level=2)
    pdf.body_text('The Level 0 DFD represents the entire StockAI Platform as a single process. External entities include: Retail Investor (provides queries, receives predictions), Yahoo Finance API (provides market data), and MongoDB Database (provides persistence).')
    pdf.body_text('[Fig 8.5.1 - Level 0 DFD Context Diagram]')

    pdf.section_title('8.5.2', 'Level 1 DFD (Primary Sub-Systems)', level=2)
    pdf.body_text('The Level 1 DFD decomposes the system into six processes: (1.0) User Authentication, (2.0) Stock Data Service, (3.0) AI Prediction Engine, (4.0) Watchlist Management, (5.0) Paper Trading Engine, and (6.0) Real-Time WebSocket.')
    pdf.body_text('[Fig 8.5.2 - Level 1 DFD showing data flows between all sub-processes]')

    # CHAPTER 9: LIMITATIONS
    pdf.chapter_cover('9', 'Limitations and\nFuture Enhancements', ['9.1 Limitations', '9.2 Future Enhancements'])
    pdf.chapter_title = "Limitations and Future Enhancements"
    pdf.add_page()

    pdf.section_title('9.1', 'LIMITATIONS')
    pdf.section_title('9.1.1', 'Single-Feature LSTM Model', level=2)
    pdf.body_text('The current LSTM model uses only the historical Close Price as its input feature. While this achieves competitive accuracy (R-squared = 0.9159), it ignores potentially valuable signals such as trading volume, technical indicators (RSI, MACD, Bollinger Bands), and macroeconomic factors.')

    pdf.section_title('9.1.2', 'Autoregressive Prediction Drift', level=2)
    pdf.body_text('For multi-day predictions, the model uses its own output as input for subsequent predictions. This autoregressive approach causes prediction uncertainty to compound with each time step, resulting in decreasing reliability for longer prediction horizons.')

    pdf.section_title('9.1.3', 'Data Source Dependency', level=2)
    pdf.body_text('The platform depends entirely on the Yahoo Finance API (yfinance) for both historical training data and real-time quotes. Any changes to Yahoo Finance API structure, rate limits, or service availability could disrupt the data pipeline.')

    pdf.section_title('9.1.4', 'Paper Trading Simplification', level=2)
    pdf.body_text('The paper trading engine simulates trades at the current market price without accounting for real-world market microstructure effects such as bid-ask spreads, slippage, partial fills, or commission fees.')

    pdf.section_title('9.1.5', 'No Model Retraining Automation', level=2)
    pdf.body_text('Trained LSTM models are cached indefinitely after the initial training. There is no automated retraining pipeline to update models as new market data becomes available.')

    pdf.add_page()
    pdf.section_title('9.2', 'FUTURE ENHANCEMENTS')
    pdf.section_title('9.2.1', 'Multi-Feature LSTM with Technical Indicators', level=2)
    pdf.body_text('Future versions will extend the LSTM model input to multiple features including Volume, RSI, MACD, SMA, and EMA. This multi-feature approach is expected to improve prediction accuracy by 5-15%.')

    pdf.section_title('9.2.2', 'Transformer-Based Prediction Models', level=2)
    pdf.body_text('The LSTM architecture could be supplemented with Transformer-based models (e.g., Temporal Fusion Transformer) that leverage self-attention mechanisms to capture both short-term and long-term dependencies more effectively.')

    pdf.section_title('9.2.3', 'Sentiment Analysis Integration', level=2)
    pdf.body_text('Integrating NLP sentiment analysis of financial news headlines and social media using models like FinBERT would provide an additional predictive signal.')

    pdf.section_title('9.2.4', 'Real Brokerage API Integration', level=2)
    pdf.body_text('The paper trading engine could be extended to support real brokerage accounts through APIs such as Alpaca or Zerodha, enabling users to transition from practice to live trading.')

    pdf.section_title('9.2.5', 'Mobile Application', level=2)
    pdf.body_text('Developing a React Native or Flutter mobile application would extend the platform reach to smartphones for on-the-go monitoring and trading.')

    # CHAPTER 10: CONCLUSION
    pdf.chapter_cover('10', 'Conclusion', ['10.1 Conclusion'])
    pdf.chapter_title = "Conclusion"
    pdf.add_page()

    pdf.section_title('10.1', 'CONCLUSION')
    pdf.body_text(
        'The exponential growth in retail stock market participation has created an urgent demand for intelligent, '
        'accessible, and transparent financial analysis tools. Traditional platforms either present raw data without '
        'actionable insights or lock advanced analytics behind prohibitive subscription barriers, systematically '
        'disadvantaging individual investors in an increasingly algorithm-driven market.'
    )
    pdf.body_text(
        'This thesis successfully designed, implemented, and validated an AI-Powered Stock Market Analysis Platform '
        '- a full-stack web application that integrates deep learning-based price forecasting, real-time market data '
        'visualization, and simulated paper trading into a unified, browser-based experience.'
    )

    pdf.section_title('10.1.1', 'Summary of Engineering Contributions', level=2)
    pdf.bullet_point('The multi-layer LSTM neural network (128, 64, 32 stacked architecture with Dropout regularization) achieves an R-squared Score of 0.9159 and a MAPE of 1.02% on historical test data, confirming that deep learning models can generate meaningful short-term stock price forecasts.', 'Deep Learning for Financial Forecasting')
    pdf.bullet_point('The three-tier architecture (React + Express + FastAPI) demonstrates that complex AI inference systems can be cleanly integrated into modern web applications through well-defined API contracts.', 'Microservices Architecture')
    pdf.bullet_point('By exposing comprehensive model metrics (RMSE, MAE, R-squared, MAPE) and an AI Confidence percentage alongside every prediction, the platform empowers users to make calibrated decisions.', 'Transparent AI')
    pdf.bullet_point('The Socket.IO WebSocket integration proves that financial-grade real-time data streaming can be achieved in a web browser environment without specialized client software.', 'Real-Time Data Delivery')
    pdf.bullet_point('The paper trading simulator bridges the gap between financial literacy and active market participation, enabling risk-free practice with realistic trade mechanics.', 'Risk-Free Practice')

    pdf.section_title('10.1.2', 'Final Verdict', level=2)
    pdf.body_text(
        'The experimental results confirm that the proposed platform successfully delivers institutional-grade analytical '
        'capabilities - real-time market monitoring, AI-powered price forecasting, and portfolio management - through a '
        'free, accessible web application. The system achievement of an R-squared Score exceeding 0.91 validates the LSTM '
        'architecture for short-term price prediction. Ultimately, this thesis proves that the convergence of modern web '
        'frameworks (React, Express), deep learning infrastructure (TensorFlow, FastAPI), and thoughtful UX design can '
        'democratize financial intelligence for retail investors.'
    )

    # CHAPTER 11: APPENDICES
    pdf.chapter_cover('11', 'Appendices', ['11.1 Business Model', '11.2 Product Deployment Detail', '11.3 API and Web Service Details'])
    pdf.chapter_title = "Appendices"
    pdf.add_page()

    pdf.section_title('11.1', 'BUSINESS MODEL')
    pdf.body_text('The StockAI platform is designed as a freemium educational and analytical tool targeting retail investors and finance students.')
    pdf.bullet_point('Advanced prediction models (Transformer, ensemble methods), extended prediction horizons (365+ days), and custom portfolio optimization algorithms could be offered as a paid tier.', 'Premium Features (Future)')
    pdf.bullet_point('The LSTM prediction engine could be exposed as a paid API service for third-party financial applications and fintech startups.', 'API Access (Future)')
    pdf.bullet_point('Integration with real brokerage APIs (Alpaca, Zerodha) could generate referral commissions.', 'Affiliate Revenue')

    pdf.section_title('11.2', 'PRODUCT DEPLOYMENT DETAIL')
    pdf.body_text('The platform requires three services running simultaneously:')
    pdf.body_text('Backend: cd backend && npm install && npm run dev (Port 5000)')
    pdf.body_text('ML Service: cd ml-service && pip install -r requirements.txt && python app.py (Port 8000)')
    pdf.body_text('Frontend: cd frontend && npm install && npm start (Port 3000)')

    pdf.ln(5)
    pdf.body_text('Application Screenshots: The following figures reference the platform UI as captured during testing and demonstration. These include the Market Overview Dashboard, All Stocks view, Stock Detail Page, AI Predictions with metrics, Stock Recommendations, Transaction History, Watchlist, Login Page, and Learning Center.')

    pdf.add_page()
    pdf.section_title('11.3', 'API AND WEB SERVICE DETAILS')
    pdf.section_title('11.3.1', 'Backend REST API Endpoints', level=2)
    pdf.add_table(
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
            ['/api/watchlist', 'GET', 'JWT', 'Get user watchlist'],
            ['/api/watchlist/add', 'POST', 'JWT', 'Add stock'],
            ['/api/watchlist/remove/:sym', 'DELETE', 'JWT', 'Remove stock'],
            ['/api/news', 'GET', '-', 'Market news'],
            ['/api/health', 'GET', '-', 'Server health check'],
        ],
        [55, 18, 12, 55]
    )

    pdf.ln(5)
    pdf.section_title('11.3.2', 'LSTM Model Architecture', level=2)
    pdf.add_table(
        ['Layer', 'Configuration', 'Output Shape'],
        [
            ['Input', 'shape=(60, 1)', '(None, 60, 1)'],
            ['LSTM 1', '128 units, return_seq=True', '(None, 60, 128)'],
            ['Dropout 1', 'rate=0.2', '(None, 60, 128)'],
            ['LSTM 2', '64 units, return_seq=True', '(None, 60, 64)'],
            ['Dropout 2', 'rate=0.2', '(None, 60, 64)'],
            ['LSTM 3', '32 units, return_seq=False', '(None, 32)'],
            ['Dropout 3', 'rate=0.2', '(None, 32)'],
            ['Dense 1', '16 units, ReLU', '(None, 16)'],
            ['Dense 2 (Output)', '1 unit, Linear', '(None, 1)'],
        ],
        [45, 60, 50]
    )

    # BIBLIOGRAPHY
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
        '[3] S. Selvin et al., "Stock price prediction using LSTM, RNN and CNN-sliding window model," in ICACCI, pp. 1643-1647, 2017.',
        '[4] A. Moghar and M. Hamiche, "Stock Market Prediction Using LSTM Recurrent Neural Network," Procedia Computer Science, vol. 170, pp. 1168-1173, 2020.',
        '[5] W. Bao, J. Yue, and Y. Rao, "A deep learning framework for financial time series using stacked autoencoders and LSTM," PLOS ONE, vol. 12, no. 7, 2017.',
        '[6] React Documentation, "React - A JavaScript library for building user interfaces," Meta Platforms, Inc.',
        '[7] Express.js Documentation, "Express - Fast, unopinionated, minimalist web framework for Node.js."',
        '[8] TensorFlow Documentation, "TensorFlow - An end-to-end open source machine learning platform," Google.',
        '[9] FastAPI Documentation, "FastAPI - Modern, fast web framework for building APIs with Python."',
        '[10] MongoDB Documentation, "MongoDB - The application data platform."',
        '[11] Socket.IO Documentation, "Socket.IO - Bidirectional and low-latency communication."',
        '[12] yfinance Documentation, "Download market data from Yahoo Finance API."',
        '[13] Recharts Documentation, "A composable charting library built on React components."',
        '[14] X. Ding et al., "Deep learning for event-driven stock prediction," in IJCAI, pp. 2327-2333, 2015.',
        '[15] M. Roondiwala et al., "Predicting Stock Prices Using LSTM," IJSR, vol. 6, no. 4, pp. 1754-1756, 2017.',
    ]
    pdf.set_font('Times', '', 11)
    for ref in refs:
        pdf.multi_cell(0, 6, ref, 0, 'J')
        pdf.ln(3)

    # Save
    output_path = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/Thesis_StockAI_AryaShah.pdf'
    pdf.output(output_path)
    print(f'PDF generated successfully: {output_path}')
    print(f'Total pages: {pdf.page_no()}')


if __name__ == '__main__':
    build_pdf()
