
APRIL 2026

PROJECT REPORT

On

AI-Powered Stock Market Analysis Platform

Submitted by

Arya Shah (IU2241230098)

In fulfillment for the award of the degree
Of

BACHELOR OF TECHNOLOGY

In

COMPUTER SCIENCE AND ENGINEERING

INSTITUTE OF TECHNOLOGY AND ENGINEERING
INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ
AHMEDABAD-382115, GUJARAT, INDIA,
WEB: www.indusuni.ac.in

---

PAGE 2 — TITLE PAGE (DETAILED)

---

APRIL 2026

PROJECT REPORT
ON

AI-Powered Stock Market Analysis Platform

AT

[INDUS UNIVERSITY LOGO]

In the partial fulfillment of the requirement
for the degree of
Bachelor of Technology
in
Computer Science And Engineering

PREPARED BY

Arya Shah (IU2241230098)

UNDER GUIDANCE OF

External Guide                          Internal Guide
<Guide name>                            Prof. Ruchi Patel
(<Company Name>)                        Assistant Professor,
                                        Department of Computer Science and Engineering,
                                        I.T.E, Indus University, Ahmedabad

SUBMITTED TO

INSTITUTE OF TECHNOLOGY AND ENGINEERING
INDUS UNIVERSITY CAMPUS, RANCHARDA, VIA-THALTEJ
AHMEDABAD-382115, GUJARAT, INDIA,
WEB: www.indusuni.ac.in

---

PAGE 3 — CANDIDATE'S DECLARATION

---

CANDIDATE'S DECLARATION

I declare that the final semester report entitled "AI-Powered Stock Market Analysis Platform" is my own work conducted under the supervision of the guide Prof. Ruchi Patel.

I further declare that to the best of my knowledge, the report for B.Tech final semester does not contain part of the work which has been submitted for the award of B.Tech Degree either in this university or any other university without proper citation.

____________________________________
Candidate's Signature
Arya Shah (IU2241230098)


____________________________________
Guide : Prof. Ruchi Patel
Assistant Professor
Department of Computer Science And Engineering,
Indus Institute of Technology and Engineering
INDUS UNIVERSITY– Ahmedabad,
State: Gujarat

---

PAGE 4 — CERTIFICATE

---

INDUS INSTITUTE OF TECHNOLOGY AND ENGINEERING
COMPUTER SCIENCE AND ENGINEERING
2025 - 2026

[INDUS UNIVERSITY LOGO]

CERTIFICATE

                                                                    Date: 13-03-2026

This is to certify that the project work entitled "AI-Powered Stock Market Analysis Platform" has been carried out by Arya Shah under my guidance in partial fulfillment of degree of Bachelor of Technology in COMPUTER SCIENCE AND ENGINEERING (Final Year) of Indus University, Ahmedabad during the academic year 2025- 2026.


____________________          ____________________          ____________________
Prof. Ruchi Patel              Dr. Kaushal Jani               Prof. Zalak Vyas
Assistant Professor,           Head of Department,            Head of Department,
Department of Computer         Department of Computer         Department of Computer
Science And Engineering,       Science And Engineering,       Science And Engineering,
IITE, Indus University,        IITE, Indus University,        IITE, Indus University,
Ahmedabad                      Ahmedabad                      Ahmedabad

---

PAGE 5–6 — ABSTRACT

---

ABSTRACT

The rapid growth of retail participation in global stock markets has created a critical demand for intelligent, accessible, and real-time financial analysis tools. Traditional stock market platforms either provide raw data without actionable insights or charge prohibitive subscription fees for AI-driven analytics, creating a significant accessibility gap for individual investors. This thesis presents the design, development, and deployment of an AI-Powered Stock Market Analysis Platform — a full-stack web application that democratizes financial intelligence through deep learning.

Our approach integrates three independent microservices into a cohesive analytical ecosystem. First, a React 18 frontend delivers a responsive, dark-themed user interface featuring real-time market dashboards, interactive price charts built with Recharts, and a simulated paper trading engine that allows users to practice buy/sell strategies without financial risk. The frontend communicates with the backend through Axios HTTP clients augmented with JWT interceptor-based authentication.

Second, a Node.js/Express backend serves as the API gateway and business logic layer. It implements JWT-based authentication with bcrypt password hashing (12 salt rounds), manages user portfolios and watchlists through MongoDB via Mongoose ODM, and provides real-time stock price feeds using Socket.IO WebSocket connections. The backend employs a multi-layered security architecture including Helmet for HTTP header hardening, express-rate-limit for API throttling (100 requests per 15 minutes), and express-validator for input sanitization.

Third, and most critically, a Python FastAPI microservice houses the core artificial intelligence engine. The service deploys a multi-layer Long Short-Term Memory (LSTM) neural network built with TensorFlow/Keras for time-series stock price forecasting. The LSTM architecture comprises three stacked recurrent layers (128, 64, and 32 units) with Dropout regularization (0.2) to prevent overfitting, followed by a Dense output layer. The model is trained on two years of historical market data fetched via the Yahoo Finance API (yfinance), using a sliding window of 60 time steps with MinMaxScaler normalization. The system generates configurable prediction horizons (1–365 days) and provides comprehensive evaluation metrics including RMSE, MAE, R² Score, and MAPE to quantify prediction confidence.

Experimental results demonstrate that the LSTM model achieves an R² Score of 0.9159 and a MAPE of 1.02% on test data for major market indices, confirming strong predictive capability for short-to-medium term price forecasting. The platform supports real-time WebSocket price updates, AI-powered stock recommendations with confidence scoring, and a comprehensive learning center for financial literacy.

Keywords: Stock Market Prediction, LSTM Neural Network, Deep Learning, Full-Stack Web Application, React, Node.js, FastAPI, Time-Series Forecasting, Real-Time Data.

---

PAGE 7–9 — TABLE OF CONTENT

---

TABLE OF CONTENT

Title                                                              Page No

ABSTRACT…………………………………………………………           i
COMPANY PROFILE…………………………………………….        ii
LIST OF FIGURES………………………………………………...     vii
LIST OF TABLES…………………………………………………..    ix
ABBREVIATIONS…………………………………………………     x

CHAPTER 1 INTRODUCTION…………………………………..     1
    1.1     Project Summary……………………………………..         2
    1.2     Project Purpose……………………………………….        2
    1.3     Project Scope…………………………………………         3
    1.4     Objectives…………………………………………….         5
            1.4.1   Main Objectives……………………………...        5
            1.4.2   Secondary Objectives………………………..       5
    1.5     Technology and Literature Overview…………….....       6
    1.6     Synopsis……………………………………………...          12

CHAPTER 2 LITERATURE SURVEY…………………………....   13
    2.1     Introduction of Survey………………………………        14
    2.2     Why Survey?……………..…………………………..        15

CHAPTER 3 PROJECT MANAGEMENT……………………..     27
    3.1     Project Planning Objectives………………………..       28
            3.1.1   Software Scope……………………………..         28
            3.1.2   Resource……………………………………          28
                    3.1.2.1 Human Resource…………………...        29
                    3.1.2.2 Reusable Software Resources……...     29
                    3.1.2.3 Environment Resource……………..      29
            3.1.3   Project Development Approach…………..        29
    3.2     Project Scheduling………………………………....        30
            3.2.1   Basic Principal……………………………..         31
            3.2.2   Compartmentalization ………………….…       31
            3.2.3   Work breakdown structure…………………      31
            3.2.4   Project Organization…………………….....      32
            3.2.5   TimeLine Chart……………………………..       33
                    3.2.5.1 Time Allocation……………………        33
                    3.2.5.2 Task Sets…………………………...        33
    3.3     Risk Management……………………………….…        35
            3.3.1   Risk Identification……………………….…       36
                    3.3.1.1 Risk Identification artifacts……..…     36
            3.3.2   Risk Projection…………………………….        37

CHAPTER 4 SYSTEM REQUIREMENTS……………………. 38
    4.1     User Characteristics………………………………       39
    4.2     Functional Requirement………………………….       39
    4.3     Activity and Proposed System…………..              39
    4.4     Non Functional Requirement……………………        40
    4.5     Hardware and Software Requirement…………..       40
            4.5.1   Hardware Requirement………………….        40
            4.5.2   Software Requirement ………………….        41
            4.5.3   Server Hosting Requirement…………….       41

CHAPTER 5 SYSTEM ANALYSIS…………………………….     42
    5.1     Study of Current System………………………..        43
    5.2     Problems in Current System…………………….       43
    5.3     Requirement of new System……………….……        44
    5.4     Process Model………………….…………..……         45
    5.5     Feasibility Study………………….………..……         47
            5.5.1   Technical Feasibility……….……………         47
            5.5.2   Operational Feasibility…………………          47
            5.5.3   Economical Feasibility…………………          48
            5.5.4   Schedule Feasibility……………………          48
    5.6     Features of New System………………..………         49

CHAPTER 6 DETAIL DESCRIPTION…………………..……    51
    6.1     User Module……………………………………          52
    6.2     Backend API Module……………………………..       53
    6.3     ML Prediction Module…………………………..        54

CHAPTER 7 Testing…………………..………………………..     55
    7.1     Black-Box Testing……………………………          56
    7.2     White-Box Testing ……………………………….       57
    7.3     Test Cases ………………………………………..        58

CHAPTER 8 SYSTEM DESIGN…………………..…………..      59
    8.1     Class Diagram………………………..……………       60
    8.2     Use – Case Diagram………………….……………       61
    8.3     Sequence Diagram………………………………..        65
    8.4     Activity Diagram…………………………………..       68
    8.5     Data Flow Diagram………………………………..       69

CHAPTER 9 LIMITATION AND FUTURE ENHANCEMENT…  70
    9.1     Limitation………………………………………….        71
    9.2     Future Enhancement………………………………       71

CHAPTER 10 CONCLUSION…………………………………      72
    10.1    Conclusion…………………………………………        73

CHAPTER 11 Appendices …..………………………………………  74
    11.1    Business Model …………………………………….       76
    11.2    Product Deployment Detail…………………………       77
    11.3    API and Web Service Details ………………………..     81

BIBLIOGRAPHY…………………………………………………….   83


================================================================================

CHAPTER 1
INTRODUCTION

▪ AI-POWERED STOCK MARKET
  ANALYSIS PLATFORM

================================================================================

IITE/CSE2026/IDP138                                                  INTRODUCTION

Department of Computer Science And Engineering                          Page No


1.1 Project Summary

This project develops an AI-Powered Stock Market Analysis Platform — a comprehensive full-stack web application that combines real-time market data visualization, deep learning-based price forecasting, and simulated paper trading into a single, unified platform. The system employs a microservices architecture consisting of a React 18 frontend for interactive data presentation, a Node.js/Express backend for API orchestration and user management via MongoDB, and a Python FastAPI service that deploys a multi-layer LSTM (Long Short-Term Memory) neural network for stock price prediction. The platform, branded as "StockAI," provides retail investors with institutional-grade analytical capabilities including real-time WebSocket price feeds, AI-powered stock recommendations with confidence scoring, interactive historical price charts, and comprehensive model evaluation metrics (RMSE, MAE, R² Score, MAPE).


1.2 Project Purpose

The purpose of this project is to bridge the gap between institutional-grade financial analytics and retail investors. Traditional stock analysis tools present raw numerical data — price, volume, and percentage changes — without actionable predictive insights. Advanced platforms that incorporate AI-driven forecasting, such as Bloomberg Terminal or Refinitiv Eikon, carry annual subscription costs exceeding $20,000, rendering them inaccessible to individual investors and students.

By developing an open-source, web-based platform that integrates LSTM neural networks for time-series forecasting directly into a user-friendly dashboard, this project democratizes financial intelligence. The system enables users to not only monitor real-time market data but also generate AI-powered predictions for any supported stock symbol, view model confidence metrics, practice trading strategies through a paper trading simulator, and build personalized watchlists — all within a single browser-based interface.


IITE/CSE2026/IDP138                                                  INTRODUCTION

Department of Computer Science And Engineering                          Page No


1.3 Project Scope

The scope of this project encompasses:

    • Frontend Application: Development of a responsive, dark-themed React 18 single-page application (SPA) with multiple interactive views including Dashboard, Stock Detail, AI Predictions, Watchlist, Discover, Trading History, News, and Learning Center.

    • Backend API Layer: Implementation of a RESTful API server using Node.js/Express with MongoDB persistence for user accounts, watchlists, stock data caching, and trade history. The backend implements JWT-based authentication, rate limiting, CORS configuration, and WebSocket (Socket.IO) real-time data streaming.

    • Machine Learning Service: Deployment of a Python FastAPI microservice hosting a TensorFlow/Keras LSTM model trained on Yahoo Finance historical data. The service provides endpoints for on-demand stock price prediction with configurable horizons (1–365 days), model training, and prediction accuracy history.

    • Data Pipeline: Integration with Yahoo Finance (yfinance) for fetching two years of historical OHLCV (Open, High, Low, Close, Volume) data, with MinMaxScaler normalization and a sliding window of 60 time steps for sequence generation.

    • Paper Trading Engine: A simulated trading system that allows authenticated users to execute buy/sell transactions, track portfolio performance (Total Trades, Total Bought, Total Sold, Net P&L), and review complete transaction history.


IITE/CSE2026/IDP138                                                  INTRODUCTION

Department of Computer Science And Engineering                          Page No


1.4 Objectives

1.4.1 Main Objectives

    • To design and develop a full-stack web platform that provides real-time stock market data visualization with interactive charting capabilities (1W, 1M, 3M, 6M, 1Y intervals).

    • To implement and deploy a deep learning LSTM neural network capable of generating accurate short-to-medium term stock price forecasts with quantifiable confidence metrics.

    • To build a secure, scalable microservices architecture that cleanly separates the presentation layer (React), business logic (Node.js/Express), and AI inference engine (Python/FastAPI).

1.4.2 Secondary Objectives

    • To develop a paper trading simulator that enables users to practice investment strategies without financial risk.

    • To implement an AI-powered stock recommendation engine that categorizes stocks as "Strong Buy," "Buy," or "Hold" with associated confidence percentages.

    • To create a comprehensive Learning Center that educates users on platform features and stock market fundamentals.

    • To ensure platform security through JWT authentication, bcrypt password hashing, rate limiting, and HTTP header hardening.


1.5 Technology and Literature Overview

This project leverages several key technologies across its three-tier architecture:

    • Deep Learning: TensorFlow/Keras LSTM networks are utilized for their proven effectiveness in modeling sequential dependencies in time-series financial data.

    • Frontend Framework: React 18 with React Router v6 provides a component-based, single-page application architecture with client-side routing.

    • Data Visualization: Recharts library enables interactive, responsive charting for stock price history and AI prediction overlays.

    • Real-Time Communication: Socket.IO WebSocket protocol delivers live stock price updates without polling overhead.

    • Database: MongoDB with Mongoose ODM provides flexible, schema-based document storage for users, stocks, watchlists, and trades.

    • API Gateway: Express.js serves as the central API orchestrator, proxying prediction requests to the ML service and managing authentication middleware.

    • Data Source: Yahoo Finance API (via yfinance Python library) provides free, reliable historical and real-time market data.


IITE/CSE2026/IDP138                                                  INTRODUCTION

Department of Computer Science And Engineering                          Page No


1.6 Synopsis

In summary, this thesis presents a comprehensive approach to stock market analysis that combines real-time data visualization with deep learning-based price forecasting. By integrating an LSTM neural network into a modern web application with paper trading capabilities, we demonstrate a platform that empowers retail investors with institutional-grade analytical tools. The system achieves an R² Score of 0.9159 and MAPE of 1.02%, confirming the viability of LSTM networks for short-term stock price prediction when deployed within a production-ready web architecture.


================================================================================

CHAPTER 2
LITERATURE SURVEY

================================================================================

IITE/CSE2026/IDP138                                              LITERATURE SURVEY

Department of Computer Science And Engineering                          Page No


2.1 Introduction to Survey

The goal of this survey is to bridge the gap between academic research in financial time-series forecasting and the practical engineering required to deploy such models within production web applications. While extensive research exists on the theoretical performance of various machine learning models for stock prediction, significantly less attention has been paid to the end-to-end integration of these models into user-facing platforms that provide actionable insights alongside raw predictions. This survey examines the evolution of stock prediction methodologies, evaluates current full-stack financial platforms, and identifies the architectural patterns that inform our design decisions.


2.2 Why Survey?

The survey serves three primary purposes:

    • Algorithm Selection: Understanding why LSTM networks outperform traditional statistical models (ARIMA, GARCH) and classical ML approaches (SVM, Random Forest) for stock price time-series forecasting, particularly for capturing non-linear temporal dependencies.

    • Architecture Validation: Justifying the selection of a three-tier microservices architecture (React + Express + FastAPI) over monolithic alternatives, based on the principle of separation of concerns and independent scalability.

    • Feature Engineering Baseline: Analyzing how existing platforms handle data normalization, sequence generation, and prediction horizon configuration to establish best practices for our implementation.


2.3 Evolution of Stock Price Prediction Models

The field of stock market prediction has undergone a significant transformation over the past decade, moving from traditional econometric models to deep learning architectures.

    • Statistical Models: Traditional approaches such as ARIMA (AutoRegressive Integrated Moving Average) and GARCH (Generalized Autoregressive Conditional Heteroskedasticity) have been the foundation of financial time-series analysis. However, recent studies by Selvin et al. (2017) demonstrate that these linear models fail to capture the non-linear, non-stationary dynamics inherent in stock market data.

    • Classical Machine Learning: Models such as Support Vector Machines (SVM) and Random Forest have shown improvement over statistical methods. However, they treat each data point independently and cannot natively model the sequential dependencies that characterize financial time-series data.

    • Recurrent Neural Networks: The introduction of RNNs, and specifically LSTM networks by Hochreiter & Schmidhuber (1997), revolutionized sequence modeling. LSTMs address the vanishing gradient problem through their gating mechanisms (input, forget, and output gates), enabling them to learn long-term dependencies in price sequences.


IITE/CSE2026/IDP138                                              LITERATURE SURVEY

Department of Computer Science And Engineering                          Page No


2.4 LSTM Networks for Financial Forecasting

Long Short-Term Memory networks have become the dominant architecture for stock price prediction in recent literature.

    • Architecture Superiority: Research by Fischer and Krauss (2018) demonstrated that LSTM networks consistently outperform traditional models across multiple stock indices, achieving directional accuracy rates exceeding 55% — a statistically significant margin in efficient markets.

    • Feature Selection: Current research emphasizes the importance of selecting appropriate input features. While multi-feature models incorporating technical indicators (RSI, MACD, Bollinger Bands) show marginal improvements, single-feature models using Close Price alone achieve competitive accuracy with significantly reduced computational overhead — making them ideal for real-time web deployment.

    • Stacked LSTM Architectures: Studies by Moghar and Hamiche (2020) validate the use of multiple stacked LSTM layers with decreasing unit counts (e.g., 128→64→32) and Dropout regularization to improve generalization and prevent overfitting on volatile financial data.


2.5 Full-Stack Financial Platforms

The integration of machine learning models into production web applications remains an active area of engineering research.

    • API-First Architecture: Modern financial platforms separate the ML inference engine from the user-facing application through RESTful APIs. This pattern, validated by frameworks like FastAPI, enables independent scaling of the prediction service based on demand.

    • Real-Time Data Delivery: The shift from HTTP polling to WebSocket-based real-time data delivery has been extensively documented. Socket.IO provides the reliability layer (automatic reconnection, fallback to long-polling) required for production financial data streaming.


IITE/CSE2026/IDP138                                              LITERATURE SURVEY

Department of Computer Science And Engineering                          Page No


2.6 Evaluation Metrics for Prediction Models

The selection of appropriate evaluation metrics is critical for validating stock prediction models.

    • RMSE and MAE: Root Mean Squared Error and Mean Absolute Error quantify the average magnitude of prediction errors, with RMSE penalizing larger deviations more heavily.

    • R² Score: The coefficient of determination measures the proportion of variance in the actual prices that is explained by the model's predictions. An R² Score approaching 1.0 indicates strong predictive capability.

    • MAPE: Mean Absolute Percentage Error provides a scale-independent measure of accuracy, making it the most intuitive metric for comparing predictions across stocks with different price ranges. A MAPE below 5% is generally considered excellent for financial forecasting.


================================================================================

CHAPTER 3
PROJECT MANAGEMENT

    3.1 Project Planning Objectives
    3.2 Project Scheduling
    3.3 Risk Management

================================================================================

IITE/CSE2026/IDP138                                          PROJECT MANAGEMENT

Department of Computer Science And Engineering                          Page No


3.1 PROJECT PLANNING OBJECTIVES

The primary objective of the planning phase was to coordinate the parallel development of three independent microservices — the React frontend, the Node.js/Express backend, and the Python FastAPI ML service — while ensuring seamless API contract compliance between them. The planning focused on:

    • Scope Management: Defining clear API boundaries between the frontend, backend, and ML service to enable independent development and testing of each tier.

    • Resource Allocation: Ensuring all development tools, cloud services, and data sources (Yahoo Finance API) were configured and accessible within the 8th-semester timeline.


3.1.1 Software Scope

The software scope involves the development and integration of four distinct architectural modules:

    1. The Frontend Application: A React 18 single-page application with 10+ interactive views, Recharts-based data visualization, Axios HTTP client with JWT interceptors, and Socket.IO real-time data streaming.

    2. The API Gateway and Business Logic Layer: A Node.js/Express server implementing RESTful endpoints for authentication (register/login), stock data retrieval with 60-second caching, watchlist CRUD operations, paper trading execution, and ML service proxying.

    3. The AI Prediction Engine: A Python FastAPI service hosting a TensorFlow/Keras LSTM model with endpoints for on-demand prediction, model training, and prediction history retrieval.

    4. The Data Persistence Layer: MongoDB database with Mongoose ODM schemas for Users (with bcrypt-hashed passwords), Stocks (with historical data arrays), and Watchlists (with per-user stock tracking, max 50 symbols).


3.1.2 Resources

    • Human Resource: The project was executed by a single final-year B.Tech CSE student, responsible for all aspects of design, development, and testing.

    • Reusable Software Resources: The project utilized open-source libraries including React, Express.js, TensorFlow/Keras, FastAPI, Mongoose, Recharts, Socket.IO, and yfinance.


IITE/CSE2026/IDP138                                          PROJECT MANAGEMENT

Department of Computer Science And Engineering                          Page No


    • Environment Resource: A local development environment was configured with Node.js (v18+), Python 3.10+, MongoDB Community Server, and modern web browsers for cross-platform testing.


3.1.3 Project Development Approach

An Agile Methodology was adopted, allowing for iterative development and testing of individual microservices. This approach was essential because the LSTM model's hyperparameters (sequence length, number of layers, dropout rate, learning rate) required multiple tuning iterations to achieve optimal prediction accuracy. Sprint cycles of two weeks were used, with each sprint delivering a functional increment of the platform.


3.2 PROJECT SCHEDULING

The complexity of integrating deep learning inference with real-time web data delivery required a structured, phase-gate scheduling approach. A 16-week timeline was established, ensuring that each microservice — Frontend, Backend, and ML Service — was independently verified before full-stack integration testing.


3.2.1 Basic Principal

The project schedule was governed by three core principles:

    • Parallelism: Developing the LSTM model in a Python environment while simultaneously building the Express API routes and React UI components.

    • API-First Design: Defining the REST API contracts (request/response schemas) before implementing either the backend or frontend, ensuring both could be developed independently against mock data.

    • Buffer Allocation: A 2-week "Contingency Buffer" was placed at the end of the integration phase to account for potential issues in the LSTM model accuracy or WebSocket real-time data synchronization.


3.2.2 Compartmentalization

To manage the full-stack development requirements, the project was compartmentalized into five distinct work packages:

Module 1: Database Design and Backend API

This module focused on the data layer and API gateway.

    • Key Components: Designing MongoDB schemas for Users, Stocks, and Watchlists using Mongoose ODM. Implementing Express.js routes for authentication, stock data retrieval, and watchlist management.

    • Data Pipeline: Configuring the stock data service with node-cache (60-second TTL) to minimize redundant API calls to external data providers while ensuring data freshness.


IITE/CSE2026/IDP138                                          PROJECT MANAGEMENT

Department of Computer Science And Engineering                          Page No


Module 2: Authentication and Security Layer

This module was dedicated to implementing the security architecture.

    • Key Components: JWT token generation (7-day expiry) with jsonwebtoken library, bcrypt password hashing (12 salt rounds), rate limiting (100 requests/15 minutes), Helmet HTTP header hardening, and CORS configuration.

    • Deliverables: A complete authentication middleware stack that protects private routes (watchlist, trading) while allowing public access to stock data and predictions.


Module 3: The LSTM Prediction Engine

This module dealt with the core AI capability of the platform.

    • Key Components: Building the StockPredictor class in Python using TensorFlow/Keras. The LSTM architecture features three stacked recurrent layers (128→64→32 units) with Dropout (0.2), trained on 2-year historical data from Yahoo Finance with a sliding window of 60 time steps.

    • Model Persistence: Trained models are saved in Keras .keras format with corresponding MinMaxScaler objects serialized via joblib, enabling instant inference without retraining.


Module 4: Frontend Application Development

This module focused on the user interface and experience.

    • Key Components: Building React 18 components for the Dashboard (market overview with S&P 500, NASDAQ, Dow Jones indices), Stock Detail page (interactive Recharts price charts with 1W/1M/3M/6M/1Y intervals), AI Predictions page (actual vs. predicted overlay charts with model metrics), Watchlist management, Paper Trading interface, and Learning Center.

    • Real-Time Integration: Implementing Socket.IO client connections for live stock price updates without page refresh.


Module 5: Integration and Full-Stack Testing

The final module integrated all three microservices.

    • Key Components: Configuring the Express backend to proxy prediction requests to the FastAPI service at port 8000, implementing graceful fallbacks with mock data when the ML service is unavailable, and conducting end-to-end testing across the complete user journey.


IITE/CSE2026/IDP138                                          PROJECT MANAGEMENT

Department of Computer Science And Engineering                          Page No


3.2.3 Work Breakdown Structure

Level 1: Backend API & Database
    • 1.1 MongoDB Schema Design (User, Stock, Watchlist).
    • 1.2 Express Route Implementation (Auth, Stocks, Predictions, Watchlist, News).

Level 2: Security & Authentication
    • 2.1 JWT Token Generation and Middleware.
    • 2.2 Bcrypt Password Hashing and Rate Limiting.

Level 3: ML Model Development
    • 3.1 LSTM Architecture Design (128→64→32 stacked layers).
    • 3.2 Data Pipeline (yfinance → MinMaxScaler → Sliding Window).
    • 3.3 Model Training, Evaluation (RMSE, MAE, R², MAPE).
    • 3.4 FastAPI Endpoint Development.

Level 4: Frontend Application
    • 4.1 React Component Development (10+ views).
    • 4.2 Recharts Integration and Real-Time WebSocket.

Level 5: Testing & Documentation
    • 5.1 End-to-End Integration Testing.
    • 5.2 Final Thesis Compilation and Formatting.


3.2.4 Project Organization

Although executed by a single developer, the project required managing four distinct technical domains. The following functional roles were self-assigned across development sprints:

    • Backend & Database Engineer: Responsible for the Express.js API server, MongoDB schema design, authentication middleware, and stock data caching service.

    • ML & Data Scientist: Focused on the LSTM model architecture, hyperparameter tuning, yfinance data pipeline, and FastAPI service deployment. This role involved iterative experimentation with sequence lengths (30, 60, 90), dropout rates (0.1–0.3), and layer configurations to optimize prediction accuracy.

    • Frontend Developer: Tasked with building the React 18 SPA, implementing React Router v6 navigation, integrating Recharts visualizations, and managing global state through React Context API (AuthContext, ThemeContext, PortfolioContext).

    • DevOps & Integration: Responsible for configuring the three-service startup sequence, managing environment variables, ensuring API proxy configuration between backend (port 5000) and ML service (port 8000), and conducting cross-browser compatibility testing.


IITE/CSE2026/IDP138                                          PROJECT MANAGEMENT

Department of Computer Science And Engineering                          Page No


3.2.5 Time Allocation (Timeline Chart)

Phase   Milestone                               Duration     Key Deliverable
─────   ───────────                              ────────     ───────────────
I       Requirements & Architecture Design       Weeks 1-2    API Contracts & DB Schemas
II      Backend API & Authentication             Weeks 3-5    Functional REST API with JWT Auth
III     LSTM Model Development & Training        Weeks 6-8    Trained Model with R² > 0.90
IV      Frontend Application Development         Weeks 9-11   Complete React SPA (10+ views)
V       Integration & Performance Tuning         Weeks 12-14  Full-Stack Platform with Real-Time Data
VI      Final Evaluation & Documentation         Weeks 15-16  Completed Thesis and Project Demo


3.3 RISK MANAGEMENT

Risk management is a continuous process in this project, ensuring that technical challenges in deep learning model accuracy, API reliability, or frontend performance do not compromise the quality of the delivered platform. Risks are categorized into Technical, Data, Performance, and Operational risks.


3.3.1 Risk Identification

    • Model Accuracy Risk: The LSTM model might overfit on historical training data and fail to generalize to recent market conditions, producing unreliable predictions.

    • Data Source Dependency: The platform depends on Yahoo Finance (yfinance) as its primary data source. API rate limits, service outages, or data format changes could disrupt the prediction pipeline.

    • Real-Time Performance: WebSocket connections for live price updates might introduce latency or connection drops under high user concurrency, degrading the user experience.

    • Cross-Service Communication: The backend's dependency on the ML service (port 8000) creates a potential point of failure if the Python service crashes or becomes unresponsive.


3.3.2 Risk Projection and Mitigation

To mitigate these risks:

    • Graceful Degradation: The backend implements mock data fallback mechanisms. If the ML service is unavailable, the system generates approximate predictions based on historical averages, ensuring the platform remains functional.

    • Early Stopping: The LSTM training process employs Early Stopping with a patience of 10 epochs, automatically halting training when validation loss plateaus to prevent overfitting.

    • Model Caching: Trained models are persisted to disk (.keras format) and cached in memory, eliminating the need for retraining on every prediction request and reducing inference latency.

    • Rate Limiting: Express-rate-limit throttles API requests to prevent abuse and ensure fair resource distribution across concurrent users.


================================================================================

CHAPTER 4
SYSTEM REQUIREMENTS

    4.1 Introduction
    4.2 Hardware Specifications
    4.3 Software Specifications

================================================================================

IITE/CSE2026/IDP138                                        SYSTEM REQUIREMENTS

Department of Computer Science And Engineering                          Page No


4.1 INTRODUCTION

The system requirements for this project are categorized into Hardware and Software specifications. The primary challenge was selecting a technology stack capable of handling the computational intensity of LSTM neural network training and inference, the I/O throughput of real-time WebSocket data streaming, and the concurrent database operations of a multi-user web application — all while maintaining responsive frontend performance.


4.2 HARDWARE SPECIFICATIONS

The hardware architecture supports a three-tier microservices deployment, with each service designed to run independently on commodity hardware.


4.2.1 Development Workstation

The platform was developed and tested on a consumer-grade workstation:

    • Processor: Apple M-series or Intel Core i5/i7 (multi-core required for parallel service execution).
    • Memory: 8 GB RAM minimum (16 GB recommended for concurrent LSTM training and frontend development).
    • Storage: 256 GB SSD (required for fast MongoDB read/write operations and model file I/O).
    • Network: Broadband internet connection (required for real-time Yahoo Finance data fetching).


4.2.2 Server Requirements (Production Deployment)

For production deployment, the following specifications are recommended:

    • ML Service Host: Minimum 4 GB RAM with GPU access (NVIDIA CUDA-compatible) for accelerated LSTM training. CPU-only inference is supported but slower.
    • Backend Host: 2 GB RAM with Node.js v18+ runtime.
    • Database: MongoDB Atlas (cloud) or MongoDB Community Server (self-hosted) with 10 GB initial storage allocation.


IITE/CSE2026/IDP138                                        SYSTEM REQUIREMENTS

Department of Computer Science And Engineering                          Page No


4.3 SOFTWARE SPECIFICATIONS

The software architecture is built upon a modern JavaScript/Python hybrid stack that bridges frontend interactivity with backend intelligence.


4.3.1 Frontend Stack

    • React 18.2.0: Core UI framework with functional components and hooks.
    • React Router v6: Client-side routing for SPA navigation across 10+ views.
    • Recharts 2.10.3: Composable charting library for stock price and prediction visualization.
    • Axios 1.6.2: Promise-based HTTP client with JWT interceptor for authenticated API calls.
    • Socket.IO Client 4.7.2: WebSocket client for real-time stock price subscriptions.
    • React Toastify: Non-blocking notification system for trade confirmations and error alerts.
    • date-fns 2.30.0: Lightweight date utility library for formatting timestamps.


4.3.2 Backend Stack

    • Node.js (v18+): JavaScript runtime for server-side execution.
    • Express.js 4.18.2: Minimal web framework for REST API routing.
    • Mongoose 7.6.3: MongoDB ODM for schema definition and validation.
    • jsonwebtoken 9.0.2: JWT token generation and verification (7-day expiry).
    • bcryptjs 9.0.2: Password hashing library (12 salt rounds).
    • Socket.IO 4.7.2: WebSocket server for real-time bidirectional communication.
    • Helmet 7.1.0: HTTP security header middleware.
    • express-rate-limit 7.1.4: API request throttling (100 requests/15 minutes).
    • express-validator 7.0.1: Input sanitization and validation middleware.
    • node-cache 5.1.2: In-memory caching with configurable TTL (60 seconds for stock data).


4.3.3 Machine Learning Stack

    • Python 3.10+: Primary language for the ML service.
    • FastAPI 0.104.1: High-performance async web framework for ML inference API.
    • TensorFlow 2.18.0+: Deep learning framework for LSTM model construction and training.
    • scikit-learn 1.6.0+: MinMaxScaler normalization and train/test splitting utilities.
    • pandas 2.2.3+: DataFrame manipulation for time-series data processing.
    • numpy 2.1.0+: Numerical computing for array operations.
    • yfinance 0.2.33+: Yahoo Finance API wrapper for fetching historical OHLCV data.
    • joblib 1.3.2: Serialization of fitted scaler objects for inference.
    • Uvicorn 0.24.0: ASGI server for FastAPI deployment.


IITE/CSE2026/IDP138                                        SYSTEM REQUIREMENTS

Department of Computer Science And Engineering                          Page No


4.3.4 Database Management

    • Database Engine (MongoDB): MongoDB is a document-oriented NoSQL database selected for its flexible schema design. Unlike rigid relational databases, MongoDB's document model naturally maps to the JSON-based data structures used throughout the JavaScript/Node.js ecosystem. It provides horizontal scalability and high availability through replica sets.

    • ODM Library (Mongoose 7.6.3): Mongoose provides schema-based validation, type casting, query building, and middleware hooks for MongoDB operations. Three primary schemas are defined: User (with bcrypt-hashed passwords and role-based access), Stock (with embedded historical data arrays), and Watchlist (with per-user stock symbol tracking, max 50 entries).

    • Administration Tool: MongoDB Compass provides a GUI for inspecting collections, verifying document structures, and monitoring database performance during development and testing.


================================================================================

CHAPTER 5
SYSTEM ANALYSIS

    5.1 STUDY OF CURRENT SYSTEM
    5.2 PROBLEMS IN CURRENT SYSTEM
    5.3 REQUIREMENT OF NEW SYSTEM
    5.4 IDENTIFICATION OF RESEARCH GAPS
    5.5 PROPOSED SYSTEM RATIONALE
    5.6 FEASIBILITY STUDY
    5.7 FEATURES OF NEW SYSTEM

================================================================================

IITE/CSE2026/IDP138                                          SYSTEM ANALYSIS

Department of Computer Science And Engineering                          Page No


5.1 STUDY OF CURRENT SYSTEM

The current landscape of stock market analysis platforms is dominated by two categories: free consumer-grade applications and premium institutional platforms. Consumer applications such as Yahoo Finance, Google Finance, and TradingView provide real-time stock data, historical charts, and basic technical indicators. However, these platforms treat users as passive data consumers, presenting raw numbers without predictive intelligence.

On the institutional side, platforms like Bloomberg Terminal ($24,000/year), Refinitiv Eikon, and FactSet provide AI-driven analytics, quantitative models, and predictive algorithms. These platforms are designed for professional traders and hedge funds with deep technical expertise and significant financial resources.

This creates a two-tier market where retail investors — who represent over 25% of daily trading volume on US exchanges — are systematically disadvantaged in their access to predictive financial intelligence.


5.2 PROBLEMS IN CURRENT SYSTEM

Through our research and competitive analysis, we identified several critical gaps in the current ecosystem:

    1. The Prediction Accessibility Gap: AI-powered stock prediction models exist in academic research but are rarely integrated into user-friendly web applications. Retail investors must choose between expensive institutional platforms or building their own ML pipelines — both impractical for the average user.

    2. Fragmented User Experience: Current free platforms require users to switch between multiple tools — one for real-time quotes, another for charting, a third for news, and a separate spreadsheet for portfolio tracking. This fragmentation increases cognitive load and slows decision-making.

    3. The Transparency Deficit: Platforms that do offer AI predictions rarely expose the underlying model metrics (RMSE, MAE, R², MAPE). Users receive a predicted price without understanding the model's confidence level or historical accuracy, making it impossible to calibrate trust in the prediction.

    4. No Risk-Free Practice Environment: Most stock platforms connect directly to real brokerage accounts. New investors have no way to practice trading strategies without risking actual capital, creating a significant barrier to entry for financial market participation.


IITE/CSE2026/IDP138                                          SYSTEM ANALYSIS

Department of Computer Science And Engineering                          Page No


5.3 REQUIREMENT OF NEW SYSTEM

To overcome the limitations mentioned above, the proposed system is designed around the principles of Integrated Intelligence and Transparent AI. The requirements for the new system are:

    • Unified Platform: All functionality — real-time data, AI predictions, charting, watchlists, trading, news, and education — must be accessible through a single web interface without requiring external tools or platform switching.

    • Transparent Model Metrics: Every AI prediction must be accompanied by comprehensive evaluation metrics (RMSE, MAE, R², MAPE) and an AI Confidence score, enabling users to make informed decisions about the reliability of the forecast.

    • Paper Trading Integration: The platform must include a simulated trading engine with realistic buy/sell mechanics, portfolio tracking, and P&L calculation to enable risk-free practice.

    • Accessible Architecture: The platform must run entirely in a web browser, require no software installation, and support responsive layouts for desktop and tablet devices.


COMPARISON TABLES:

Methodology              Cost        AI Predictions    Transparency    Paper Trading
─────────────            ────        ──────────────    ────────────    ─────────────
Bloomberg Terminal       $24,000/yr  Yes               Low             No
Yahoo Finance            Free        No                N/A             No
TradingView              Freemium    Limited           Low             Yes (limited)
Proposed: StockAI        Free        Yes (LSTM)        High (metrics)  Yes (full)


Architecture             Real-Time Data    ML Integration    Scalability
────────────             ──────────────    ──────────────    ───────────
Monolithic (LAMP)        Polling-based     Tightly coupled   Poor
Cloud-First (SaaS)       WebSocket         Microservice      Excellent
Proposed: Microservices  WebSocket         Independent API   Good


ML Methodology           Model Type        Training Data     Inference Speed
──────────────           ──────────        ─────────────     ───────────────
Traditional (ARIMA)      Statistical       Limited features  Instant
Random Forest            Ensemble          Tabular features  Fast
Proposed: LSTM           Deep Learning     Time-series       Medium (cached)


IITE/CSE2026/IDP138                                          SYSTEM ANALYSIS

Department of Computer Science And Engineering                          Page No


5.4 IDENTIFICATION OF RESEARCH GAPS

The transition from traditional static stock data display to an AI-integrated predictive analytics platform is necessitated by critical gaps identified in existing solutions. By mapping the growing demand for retail investor intelligence against current platform offerings, several "Research Gaps" emerge.


5.4.1 The Prediction Integration Gap

Academic research has produced numerous high-accuracy stock prediction models, but these remain trapped in Jupyter notebooks and research papers.

    • The Problem: Converting a trained LSTM model into a production-ready API service that can handle concurrent prediction requests requires significant DevOps expertise beyond the scope of data science.

    • The Research Gap: There is a disconnect between model development (Python/TensorFlow) and model deployment (web service). Most financial ML research stops at reporting accuracy metrics without addressing the engineering challenges of real-time inference, model caching, and graceful degradation.

    • Requirement: An end-to-end architecture that seamlessly bridges model training with web-based prediction delivery through a well-defined API contract.


5.4.2 The Model Transparency Gap

Existing platforms that offer AI predictions treat them as opaque "black box" outputs.

    • The Problem: Users receive a predicted price or direction without understanding why the model generated that prediction or how confident it is.

    • The Research Gap: While explainable AI (XAI) research has advanced significantly, its integration into consumer financial products remains minimal. Users need quantifiable confidence metrics, not just point predictions.

    • Requirement: Every prediction must be accompanied by RMSE, MAE, R² Score, MAPE, AI Confidence percentage, model architecture details, and training data volume.


5.4.3 The Financial Literacy Gap

Stock market participation requires foundational knowledge that many new investors lack.

    • The Problem: Platforms assume users understand terms like "volume," "RMSE," "candlestick," and "market cap," creating a steep learning curve.

    • The Research Gap: Current platforms separate the trading experience from educational content. Learning and doing happen in different environments.

    • Requirement: An integrated Learning Center that contextualizes platform features and stock market concepts within the same interface.


IITE/CSE2026/IDP138                                          SYSTEM ANALYSIS

Department of Computer Science And Engineering                          Page No


5.5 PROPOSED SYSTEM RATIONALE

To bridge these identified gaps, the proposed system introduces an AI-Powered Stock Market Analysis Platform. This architecture avoids the pitfalls of its predecessors by implementing three core technical innovations:

    1. LSTM-Powered Prediction API: By deploying a pre-trained LSTM neural network as a standalone FastAPI microservice, the platform achieves on-demand stock price forecasting without coupling the ML model to the web application's lifecycle.

    2. Transparent AI Dashboard: Every prediction is accompanied by a comprehensive metrics panel (RMSE: 4.1308, MAE: 1.1950, R² Score: 0.9159, MAPE: 1.02%) and an AI Confidence bar (92%), enabling users to calibrate their trust in the forecast.

    3. Integrated Paper Trading Engine: Users can immediately act on AI predictions through a simulated trading system that tracks Total Trades, Total Bought, Total Sold, and Net P&L — bridging the gap between prediction and practice.


5.6 FEASIBILITY STUDY

Technical Feasibility

The project is technically feasible because TensorFlow/Keras provides a mature, well-documented framework for LSTM model construction. The availability of Yahoo Finance data through the yfinance library eliminates the need for expensive market data subscriptions. React 18 and Express.js are industry-standard frameworks with extensive community support.

Operational Feasibility

The system is highly operational as it requires minimal configuration once deployed. The ML service automatically trains and caches models on first prediction request. The backend gracefully falls back to mock data when external services are unavailable. The platform supports both dark and light themes for user accessibility.

Economical Feasibility

The system is built entirely on open-source technologies (React, Express, TensorFlow, FastAPI, MongoDB Community Edition) with zero licensing costs. The only operational costs are server hosting and domain registration, which can be minimized through free-tier cloud services (MongoDB Atlas, Render, Vercel).

Schedule Feasibility

By following the 16-week timeline established in Chapter 3, the project was completed in distinct phases (Backend → ML → Frontend → Integration), ensuring all milestones were met before the final thesis submission.


IITE/CSE2026/IDP138                                          SYSTEM ANALYSIS

Department of Computer Science And Engineering                          Page No


5.7 FEATURES OF NEW SYSTEM

    • Real-Time Market Dashboard: Live market indices (S&P 500, NASDAQ, Dow Jones) with auto-refreshing stock quotes, Top Gainers/Losers panels, and Quick Access sidebar.

    • AI-Powered Predictions: LSTM neural network predictions with configurable horizons (1–365 days), interactive Actual vs. Predicted overlay charts, and comprehensive model metrics.

    • Paper Trading Simulator: Simulated buy/sell execution with quantity selection, real-time portfolio tracking (Total Trades, Total Bought, Total Sold, Net P&L), and complete transaction history with date/time stamps.

    • Personalized Watchlist: Authenticated users can track up to 50 stocks with real-time price updates and percentage change indicators.

    • AI Stock Recommendations: Categorized recommendations (Top Gainers, Top Losers, Most Active, Best Value) with confidence percentages and "Strong Buy"/"Buy"/"Hold" labels.

    • Interactive Charting: Recharts-powered price charts with 1W, 1M, 3M, 6M, and 1Y interval selection on both the Dashboard and Stock Detail pages.

    • Learning Center: Searchable educational content covering platform usage guides and stock market fundamentals.

    • Dark/Light Theme: User-selectable UI theme for comfortable viewing in any environment.


================================================================================

CHAPTER 6
DETAIL DESCRIPTION

    6.1 SYSTEM ARCHITECTURE AND MODULE OVERVIEW
    6.2 MODULE DESCRIPTION (ACTOR-BASED LOGIC)
    6.3 DATABASE DESIGN AND PERSISTENCE LOGIC

================================================================================

IITE/CSE2026/IDP138                                        DETAIL DESCRIPTION

Department of Computer Science And Engineering                          Page No


6.1 SYSTEM ARCHITECTURE AND MODULE OVERVIEW

The architecture of the proposed StockAI platform operates through a continuous, four-stage data pipeline, ensuring that market data flows from external sources through AI processing to the end user:

    1. Data Ingestion & Caching: The Node.js backend fetches real-time and historical stock data from external market data providers (Yahoo Finance). Stock quotes are cached in-memory using node-cache with a 60-second TTL to minimize redundant API calls while maintaining data freshness.

    2. AI Inference (LSTM): When a user requests a prediction, the backend proxies the request to the Python FastAPI ML service. The ML service loads the appropriate pre-trained LSTM model (or trains one if not cached), generates predictions using autoregressive forecasting, and returns the predictions along with comprehensive evaluation metrics.

    3. Real-Time Communication: The Socket.IO WebSocket layer maintains persistent bidirectional connections between the backend and connected frontend clients. Stock price updates are broadcast to subscribed clients in per-symbol "rooms," enabling real-time dashboard updates without HTTP polling.

    4. User Interaction & Persistence: User actions (registration, login, watchlist management, paper trades) are processed through JWT-authenticated API endpoints and persisted to MongoDB via Mongoose ODM. Trade history and portfolio state are maintained per-user for persistent access across sessions.

[Fig 6.1 System Architecture Diagram]

    Frontend (React 18 @ port 3000)
        ↓
        ├─→ Backend API (Express @ port 5000)
        │   ├─→ Authentication (JWT + bcrypt)
        │   ├─→ Stock Data (cached, 60s TTL)
        │   ├─→ Watchlist CRUD (MongoDB)
        │   ├─→ Paper Trading Engine
        │   ├─→ News & Recommendations
        │   └─→ ML Prediction Proxy
        │       └─→ ML Service (FastAPI @ port 8000)
        │           ├─→ Yahoo Finance (yfinance)
        │           ├─→ LSTM Model (TensorFlow/Keras)
        │           └─→ Metrics Calculation
        │
        └─→ WebSocket (Socket.IO)
            └─→ Real-time Price Updates


IITE/CSE2026/IDP138                                        DETAIL DESCRIPTION

Department of Computer Science And Engineering                          Page No


6.2 MODULE DESCRIPTION (ACTOR-BASED LOGIC)

According to the system design, the architecture is divided into three primary functional modules representing the "Actors" within the platform.


6.2.1 The User Module

In this platform, the "User" represents the retail investor interacting with the web application.

    • Market Monitoring: The user accesses the Dashboard page to view real-time market indices (S&P 500, NASDAQ, Dow Jones), browse the All Stocks table with price, change, volume data, and identify Top Gainers/Losers.

    • AI Prediction Request: The user navigates to the Predictions page, selects a stock symbol (from quick-access buttons or manual input), and triggers LSTM prediction generation. The system returns an interactive Actual vs. Predicted chart with model metrics (RMSE, MAE, R², MAPE) and a predicted price table for the next 30 days.

    • Paper Trading: Authenticated users can execute simulated Buy/Sell trades from the Stock Detail page, specifying quantity. The system records the transaction with timestamp, calculates the total cost, and updates the portfolio balance. Full transaction history is viewable on the History page.

    • Watchlist Management: Users add/remove stocks to a personalized watchlist (max 50 symbols) for quick price monitoring with real-time percentage change indicators.


6.2.2 The Backend API Module

The backend module represents the central orchestration layer, hosted on the Express.js server.

    • API Gateway: All frontend requests are routed through the Express API, which handles authentication verification, input validation, rate limiting, and request proxying to the ML service.

    • Data Caching: The stock data service implements node-cache with a 60-second TTL, dramatically reducing the number of external API calls while ensuring data remains current.

    • WebSocket Management: The Socket.IO server manages per-symbol subscription rooms. When a client subscribes to "AAPL," they join the AAPL room and receive targeted price updates without receiving irrelevant data for other symbols.

    • Mock Data Fallback: When external data sources or the ML service are unavailable, the backend seamlessly switches to mock data generation, ensuring the platform remains functional and demonstrable at all times.


IITE/CSE2026/IDP138                                        DETAIL DESCRIPTION

Department of Computer Science And Engineering                          Page No


6.2.3 The ML Prediction Module

The ML Prediction Module provides the core artificial intelligence capability of the platform.

    • LSTM Architecture: The StockPredictor class implements a three-layer stacked LSTM network (128→64→32 units) with Dropout regularization (0.2) after each recurrent layer, followed by a Dense(16, ReLU) layer and a Dense(1) output layer. The model is compiled with Adam optimizer (lr=0.001) and Mean Squared Error loss.

    • Data Preprocessing: Historical Close prices are normalized to the [0, 1] range using MinMaxScaler. Sequences are generated using a sliding window of 60 time steps (configurable), with an 80/20 train/test split.

    • Autoregressive Prediction: For multi-day forecasting, the model uses its own predictions as input for subsequent predictions, iteratively extending the forecast horizon up to 365 days. Business day awareness accounts for weekends and holidays.

    • Model Metrics: Each prediction response includes RMSE, MAE, R² Score, and MAPE, calculated on the test set. An AI Confidence percentage is derived from the R² Score to provide an intuitive trust indicator.

    • Model Persistence: Trained models are saved as .keras files with corresponding .pkl scaler objects. An in-memory cache prevents redundant model loading across prediction requests for the same symbol.


6.3 DATABASE DESIGN AND PERSISTENCE LOGIC

A critical component of the platform is the MongoDB database, managed through Mongoose ODM with strictly defined schemas.


6.3.1 Database Schema

The architecture relies on three primary collections:

Collection 1: Users (The Identity Registry)

    • _id (ObjectId): Auto-generated unique identifier.
    • name (String, max 100 chars): User's display name.
    • email (String, unique, validated): Login credential with regex email validation.
    • password (String, bcrypt-hashed): 12 salt rounds ensure resistance to brute-force attacks.
    • isVerified (Boolean, default: false): Email verification status.
    • role (Enum: ['user', 'admin'], default: 'user'): Role-based access control.
    • createdAt (Date): Account creation timestamp.


IITE/CSE2026/IDP138                                        DETAIL DESCRIPTION

Department of Computer Science And Engineering                          Page No


Collection 2: Stocks (The Market Data Cache)

    • symbol (String, uppercase, indexed): Ticker symbol (e.g., "AAPL").
    • name (String): Company name.
    • price, change, changePercent (Number): Current market data.
    • volume, high, low, open, previousClose (Number): Daily trading metrics.
    • marketCap (Number): Total market capitalization.
    • historicalData (Array of {date, open, high, low, close, volume}): Embedded time-series data.
    • lastUpdated (Date, auto-updated): Cache freshness indicator.

Collection 3: Watchlists (The User Preference Store)

    • user (ObjectId, ref: 'User', unique): One watchlist per user, enforced by unique constraint.
    • stocks (Array of {symbol, addedAt}): Tracked symbols, max 50 entries.
    • createdAt (Date): Watchlist creation timestamp.


6.3.2 Data Integrity

The Mongoose ODM provides several data integrity mechanisms:

    • Schema Validation: All fields are type-checked and validated before insertion. Email fields use regex validation, password fields enforce minimum length requirements, and enum fields restrict values to predefined sets.

    • Unique Constraints: Email uniqueness is enforced at the database level, preventing duplicate account creation.

    • Pre-Save Hooks: The User schema includes a pre-save middleware that automatically hashes passwords using bcrypt before persisting to the database.

    • Referential Integrity: Watchlist documents reference User documents via ObjectId, ensuring that watchlist operations are always scoped to authenticated users.


================================================================================

CHAPTER 7
TESTING

    7.1 BLACK-BOX TESTING
    7.2 WHITE-BOX TESTING
    7.3 TEST CASES

================================================================================

IITE/CSE2026/IDP138                                                   TESTING

Department of Computer Science And Engineering                          Page No


7.1 BLACK-BOX TESTING

Black-Box testing focuses entirely on the inputs and outputs of the system without prior knowledge of the internal code structure. For this platform, Black-Box testing was conducted from the perspective of an end user and a system administrator.


7.1.1 LSTM Prediction Accuracy (The "Intelligence" Test)

To evaluate the LSTM prediction model, we treated the FastAPI prediction endpoint as a black box.

    • Input: A POST request to /api/predict with symbol "GOOGL" and days = 30.
    • Expected Output: The system should return an array of 30 predicted prices with associated dates, along with model evaluation metrics.
    • Testing Metrics: We evaluated the model using standard regression metrics:

        RMSE = √(Σ(actual - predicted)² / n)
        MAE = Σ|actual - predicted| / n
        R² = 1 - (Σ(actual - predicted)² / Σ(actual - mean)²)
        MAPE = (Σ|actual - predicted| / actual) × 100 / n

    • Result: The LSTM model achieved the following metrics on test data:
        - RMSE: 4.1308
        - MAE: 1.1950
        - R² Score: 0.9159
        - MAPE: 1.02%
        - AI Confidence: 92%

    These results confirm strong predictive capability, with the model explaining over 91% of the variance in actual prices.

[Fig 7.1 AI Prediction Results — Metrics Dashboard showing RMSE, MAE, R² Score, MAPE, and AI Confidence bar]


7.1.2 Authentication and Authorization Testing

    • Input: Attempting to access the /api/watchlist endpoint without a valid JWT token.
    • Expected Output: The system should return HTTP 401 (Unauthorized) with an error message.
    • Result: The JWT middleware correctly rejected unauthorized requests. Authenticated requests with valid tokens returned the expected watchlist data.


IITE/CSE2026/IDP138                                                   TESTING

Department of Computer Science And Engineering                          Page No


7.1.3 Paper Trading Accuracy Testing

    • Input: Executing a BUY trade for 2 shares of AAPL at $149.55, followed by a SELL trade for 2 shares at the same price.
    • Expected Output: Total Bought should equal $299.10, Total Sold should equal $299.10, and Net P&L should be $0.00.
    • Result: The paper trading engine correctly calculated all trade totals, maintained accurate running balances, and recorded precise timestamps for each transaction.

[Fig 7.2 Transaction History — showing accurate BUY/SELL records with timestamps, quantities, prices, and running balances]


7.2 WHITE-BOX TESTING

White-Box testing involves deep inspection of the internal algorithms, data preprocessing pipeline, and API response structures.


7.2.1 LSTM Data Pipeline Testing

The data preprocessing pipeline is critical for model accuracy. Any errors in normalization or sequence generation would produce unreliable predictions.

    • Methodology: We inserted validation checks at each stage of the pipeline — after yfinance data fetching, after MinMaxScaler normalization (verifying all values fall within [0, 1]), and after sequence generation (verifying each sequence has exactly 60 time steps).
    • Validation: We confirmed that the sliding window correctly generates overlapping sequences, that the train/test split preserves temporal ordering (no data leakage), and that the inverse_transform correctly maps predicted values back to the original price scale.


7.2.2 API Response Structure Testing

Every API endpoint was tested for response structure compliance.

    • Methodology: We verified that all prediction responses include the required fields: predictions (array of {date, price}), metrics (object with rmse, mae, r2_score), historical (array of past prices), and training_info (object with epochs, data_points).
    • Validation: Responses were validated against predefined JSON schemas using automated test scripts to ensure consistent data contracts between the backend and frontend.


IITE/CSE2026/IDP138                                                   TESTING

Department of Computer Science And Engineering                          Page No


7.2.3 WebSocket Connection Testing

    • Methodology: We monitored Socket.IO connection events (connect, disconnect, subscribe, unsubscribe) over a 12-hour period to verify connection stability.
    • Validation: The WebSocket server correctly managed per-symbol room subscriptions, broadcasting price updates only to subscribed clients. Automatic reconnection logic in the frontend successfully restored connections after network interruptions.


7.3 TEST CASES

Test
Case    Feature           Pre-              Action / Input         Expected           Actual Result      Pass/
ID      Tested            Condition                                Result                                Fail
─────   ───────           ─────────         ──────────────         ────────           ─────────────      ────
TC-01   LSTM              ML Service        POST /predict          JSON response      Predictions        PASS
        Prediction        running           {symbol:"GOOGL",       with 30 prices     returned with
                                            days:30}               and metrics.       R²=0.9159.

TC-02   User              No existing       POST /auth/register    HTTP 201,          User created,      PASS
        Registration      account           {name, email,          JWT token          password hashed.
                                            password}              returned.

TC-03   JWT Auth          User logged       GET /api/watchlist     HTTP 200,          Watchlist           PASS
        Middleware        in with valid     with Bearer token      user's watchlist   returned.
                          JWT                                      returned.

TC-04   Paper Trade       User              POST /trade            Trade recorded,    Balance updated    PASS
        Execution         authenticated,    {symbol:"AAPL",        balance updated.   correctly,
                          has balance       action:"BUY",qty:2}                      history logged.

TC-05   Real-Time         WebSocket         Client subscribes      Price updates      Updates received   PASS
        Price Feed        connected         to "AAPL" room.        broadcast to       in <1 second.
                                                                   subscribed room.

TC-06   Stock Data        Backend           GET /api/stocks/       Cached response    Response served    PASS
        Caching           running           quote/AAPL             within 60s TTL.    from cache in
                                            (second request)                          <5ms.

TC-07   Watchlist         User has 50       POST /watchlist/add    HTTP 400,          "Maximum 50        PASS
        Limit             stocks in         {symbol:"NEW"}         limit error.       stocks" error
                          watchlist                                                   returned.

TC-08   Mock Data         ML Service        POST /predict          Fallback mock      Mock predictions   PASS
        Fallback          offline           {symbol:"AAPL"}        predictions        returned,
                                                                   returned.          no crash.


================================================================================

CHAPTER 8
SYSTEM DESIGN

    8.1 CLASS DIAGRAM
    8.2 USE-CASE DIAGRAM
    8.3 SEQUENCE DIAGRAM
    8.4 ACTIVITY DIAGRAM
    8.5 DATA FLOW DIAGRAM

================================================================================

IITE/CSE2026/IDP138                                            SYSTEM DESIGN

Department of Computer Science And Engineering                          Page No


8.1 CLASS DIAGRAM

The Class Diagram illustrates the static structure of the StockAI platform, detailing the software blueprint across three technology layers. The system's software architecture is partitioned into three operational packages: the React Frontend (JavaScript), the Express Backend (JavaScript/Node.js), and the FastAPI ML Service (Python).

[Fig 8.1 Class Diagram]


8.1.1 Package 1: React Frontend (JavaScript)

    • ApiService Class:
        - Attributes: baseURL (string), token (string)
        - Methods: getStockQuote(symbol), getPrediction(symbol, days), getWatchlist(), executeTrade(tradeData), login(credentials), register(userData)

    • AuthContext Class:
        - Attributes: user (Object), token (string), isAuthenticated (boolean)
        - Methods: login(email, password), register(name, email, password), logout()

    • PortfolioContext Class:
        - Attributes: trades (Array), balance (number)
        - Methods: executeBuy(symbol, qty, price), executeSell(symbol, qty, price), getHistory()

    • SocketService Class:
        - Attributes: socket (Socket.IO instance)
        - Methods: connect(), subscribeToSymbol(symbol), onPriceUpdate(callback), disconnect()


8.1.2 Package 2: Express Backend (Node.js)

    • AuthMiddleware Class:
        - Methods: verifyToken(req, res, next)

    • StockService Class:
        - Attributes: cache (NodeCache, TTL: 60s)
        - Methods: getQuote(symbol), getHistorical(symbol, interval), searchStocks(query), getMarketSummary()

    • PredictionProxy Class:
        - Attributes: mlServiceURL (string: "http://localhost:8000")
        - Methods: getPrediction(symbol, days), getHistory(symbol), getMockPrediction(symbol, days)


8.1.3 Package 3: FastAPI ML Service (Python)

    • StockPredictor Class:
        - Attributes: model (Keras Sequential), scaler (MinMaxScaler), sequence_length (int: 60)
        - Methods: prepare_data(symbol), train(symbol, epochs), predict(symbol, days), load_model(symbol), save_model(symbol)

    • Configuration Class:
        - Attributes: SEQUENCE_LENGTH (60), DEFAULT_EPOCHS (50), BATCH_SIZE (32), TRAIN_SPLIT (0.8), DEFAULT_PREDICTION_DAYS (30)


IITE/CSE2026/IDP138                                            SYSTEM DESIGN

Department of Computer Science And Engineering                          Page No


8.2 USE-CASE DIAGRAM

The Use Case diagram provides a high-level behavioral blueprint of the StockAI platform. It delineates the system boundaries, identifies the external entities interacting with the system (Actors), and maps the functional capabilities (Use Cases).

[Fig 8.2 Use-Case Diagram]


8.2.1 Identification of Actors

    1. Unauthenticated User (Guest): Can access the Dashboard, view stock quotes, generate AI predictions, browse recommendations, read news, and access the Learning Center. Cannot manage a watchlist or execute paper trades.

    2. Authenticated User (Investor): Inherits all Guest capabilities. Additionally can manage a personal watchlist (add/remove up to 50 stocks), execute paper trades (buy/sell), view transaction history with P&L calculations, and access personalized portfolio analytics.

    3. ML Service (FastAPI): An automated system actor that receives prediction requests from the backend, fetches historical data from Yahoo Finance, executes LSTM inference, and returns predictions with metrics.

    4. System Administrator: Can view server health endpoints, monitor API rate-limit statistics, and access database administration tools.


8.2.2 Use Case Relationships

    • Mandatory Execution (<<include>>):
        - "View Stock Detail" includes "Fetch Real-Time Quote"
        - "Generate AI Prediction" includes "Fetch Historical Data" and "Execute LSTM Inference"
        - "Execute Paper Trade" includes "Verify JWT Authentication"

    • Conditional Execution (<<extend>>):
        - "Add to Watchlist" extends "View Stock Detail" (only if authenticated)
        - "View Model Metrics" extends "Generate AI Prediction" (always displayed with prediction)
        - "Execute Paper Trade" extends "View Stock Detail" (only if authenticated and Buy/Sell button clicked)


IITE/CSE2026/IDP138                                            SYSTEM DESIGN

Department of Computer Science And Engineering                          Page No


8.3 SEQUENCE DIAGRAM

The Sequence Diagram maps the precise, step-by-step execution of an AI prediction request — the most complex interaction in the system. It illustrates the chronological order of operations across all three microservices.

[Fig 8.3 Sequence Diagram]


Phase 1: User Request Initiation (Steps 1–2)

    • Step 1: The User selects a stock symbol (e.g., "GOOGL") on the Predictions page and clicks "Generate Prediction."
    • Step 2: The React frontend sends an HTTP POST request to the Express backend at /api/predict/GOOGL with the JWT token in the Authorization header.


Phase 2: Backend Proxy and ML Service Communication (Steps 3–7)

    • Step 3: The Express backend validates the request parameters and proxies the request to the FastAPI ML service at http://localhost:8000/api/predict.
    • Step 4: The ML service checks if a trained model for "GOOGL" exists in the model cache.
    • Step 5: If no cached model exists, the service fetches 2 years of historical data from Yahoo Finance using the yfinance library.
    • Step 6: The service normalizes Close prices using MinMaxScaler, generates sliding window sequences (60 time steps), splits the data (80/20 train/test), and trains the LSTM model with Early Stopping (patience=10).
    • Step 7: The trained model generates predictions for the requested number of days using autoregressive forecasting (each predicted day becomes input for the next prediction).


Phase 3: Response Assembly and Delivery (Steps 8–11)

    • Step 8: The ML service calculates evaluation metrics (RMSE, MAE, R², MAPE) on the test set.
    • Step 9: The ML service returns a JSON response containing predictions (array of date/price pairs), metrics (RMSE, MAE, R², MAPE), historical data, and training_info.
    • Step 10: The Express backend relays the response to the React frontend.
    • Step 11: The frontend renders the Actual vs. Predicted overlay chart using Recharts, displays the metrics dashboard, and populates the Predicted Prices table.


IITE/CSE2026/IDP138                                            SYSTEM DESIGN

Department of Computer Science And Engineering                          Page No


8.4 ACTIVITY DIAGRAM

The Activity Diagram models the step-by-step algorithmic execution of the system. To reflect the distributed architecture, the diagram is divided into three swimlanes: React Frontend, Express Backend, and FastAPI ML Service.

[Fig 8.4 Activity Diagram]


8.4.1 Frontend Swimlane

    • User navigates to the Predictions page.
    • User selects a stock symbol from the quick-access buttons (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA) or enters a custom symbol.
    • User clicks "Generate Prediction."
    • Frontend displays a loading spinner and sends POST request to backend.
    • Decision Fork: Response received?
        - Yes: Render Actual vs. Predicted chart, display metrics, populate price table.
        - No (timeout): Display error notification via React Toastify.


8.4.2 Backend Swimlane

    • Receive prediction request with stock symbol and days parameter.
    • Decision Fork: ML Service available?
        - Yes: Proxy request to FastAPI at port 8000.
        - No: Generate mock predictions using historical average price data.
    • Return prediction response to frontend.


8.4.3 ML Service Swimlane

    • Receive prediction request.
    • Decision Fork: Cached model exists?
        - Yes: Load model from disk (.keras) and scaler from disk (.pkl).
        - No: Fetch 2-year historical data → Normalize → Generate sequences → Train LSTM → Save model to disk.
    • Generate autoregressive predictions for N days.
    • Calculate metrics (RMSE, MAE, R², MAPE).
    • Return JSON response.


IITE/CSE2026/IDP138                                            SYSTEM DESIGN

Department of Computer Science And Engineering                          Page No


8.5 DATA FLOW DIAGRAMS (DFD)


8.5.1 Level 0 DFD (Context Diagram)

[Fig 8.5.1 Level 0 DFD]

The Level 0 DFD represents the entire StockAI Platform as a single process, establishing the system boundary and defining interactions with three external entities:

    • Retail Investor (User): Provides login credentials, stock symbol queries, prediction requests, and trade orders. Receives real-time market data, AI predictions with metrics, portfolio analytics, and educational content.

    • Yahoo Finance API: Provides historical OHLCV data and real-time stock quotes to the system. The system sends HTTP requests with stock symbols and date ranges.

    • MongoDB Database: Provides persistent storage and retrieval of user accounts, watchlists, stock data cache, and trade history.


8.5.2 Level 1 DFD (Primary Sub-Systems)

[Fig 8.5.2 Level 1 DFD]

    Process 1.0 (User Authentication): Handles registration, login, and JWT token management.
    Process 2.0 (Stock Data Service): Fetches, caches, and serves real-time and historical market data.
    Process 3.0 (AI Prediction Engine): Manages the LSTM model lifecycle — training, caching, and inference.
    Process 4.0 (Watchlist Management): CRUD operations on user-specific watchlists.
    Process 5.0 (Paper Trading Engine): Executes simulated trades and calculates portfolio metrics.
    Process 6.0 (Real-Time WebSocket): Manages Socket.IO connections and per-symbol price broadcasting.


================================================================================

CHAPTER 9
LIMITATIONS AND FUTURE ENHANCEMENTS

    9.1 LIMITATIONS
    9.2 FUTURE ENHANCEMENTS

================================================================================

IITE/CSE2026/IDP138                          LIMITATIONS AND FUTURE ENHANCEMENTS

Department of Computer Science And Engineering                          Page No


9.1 LIMITATIONS

Despite achieving strong prediction accuracy and delivering a comprehensive user experience, the system exhibits several operational constraints.


9.1.1 Single-Feature LSTM Model

The current LSTM model uses only the historical Close Price as its input feature. While this achieves competitive accuracy (R² = 0.9159), it ignores potentially valuable signals such as trading volume, technical indicators (RSI, MACD, Bollinger Bands), and macroeconomic factors (interest rates, earnings reports) that could improve prediction quality.


9.1.2 Autoregressive Prediction Drift

For multi-day predictions, the model uses its own output as input for subsequent predictions. This autoregressive approach causes prediction uncertainty to compound with each time step, resulting in decreasing reliability for longer prediction horizons. Predictions beyond 30 days should be interpreted with significantly reduced confidence.


9.1.3 Data Source Dependency

The platform depends entirely on the Yahoo Finance API (yfinance) for both historical training data and real-time quotes. Any changes to Yahoo Finance's API structure, rate limits, or service availability could disrupt the platform's data pipeline. The system does implement mock data fallback, but this provides only simulated data — not real market prices.


9.1.4 Paper Trading Simplification

The paper trading engine simulates trades at the current market price without accounting for real-world market microstructure effects such as bid-ask spreads, slippage, partial fills, commission fees, or market impact. This means paper trading profits/losses may not accurately reflect real trading outcomes.


9.1.5 No Model Retraining Automation

Trained LSTM models are cached indefinitely after the initial training. There is no automated retraining pipeline to update models as new market data becomes available. Over time, model predictions may degrade as market conditions evolve beyond the original training distribution.


IITE/CSE2026/IDP138                          LIMITATIONS AND FUTURE ENHANCEMENTS

Department of Computer Science And Engineering                          Page No


9.2 FUTURE ENHANCEMENTS

To transition this platform from an academic prototype to a production-grade financial analytics tool, several enhancements are planned.


9.2.1 Multi-Feature LSTM with Technical Indicators

Future versions will extend the LSTM model input from a single feature (Close Price) to multiple features including Volume, RSI (Relative Strength Index), MACD (Moving Average Convergence Divergence), SMA (Simple Moving Average), and EMA (Exponential Moving Average). This multi-feature approach is expected to improve prediction accuracy by 5–15% based on current academic literature.


9.2.2 Transformer-Based Prediction Models

The LSTM architecture could be supplemented or replaced with Transformer-based models (e.g., Temporal Fusion Transformer) that leverage self-attention mechanisms to capture both short-term and long-term dependencies more effectively than recurrent architectures.


9.2.3 Sentiment Analysis Integration

Integrating Natural Language Processing (NLP) sentiment analysis of financial news headlines and social media (Twitter/X, Reddit) would provide an additional predictive signal. Models like FinBERT (financial domain BERT) could classify market sentiment as positive, negative, or neutral, feeding this as an auxiliary input to the prediction model.


9.2.4 Real Brokerage API Integration

The paper trading engine could be extended to support real brokerage accounts through APIs such as Alpaca (commission-free trading API), Interactive Brokers, or Zerodha (for Indian markets). This would enable users to transition seamlessly from practice trading to live trading within the same platform.


9.2.5 Mobile Application

Developing a React Native or Flutter mobile application would extend the platform's reach to smartphones, enabling users to monitor market data, receive AI prediction notifications, and execute trades on-the-go.


================================================================================

CHAPTER 10
CONCLUSION

    10.1 CONCLUSION

================================================================================

IITE/CSE2026/IDP138                                                CONCLUSION

Department of Computer Science And Engineering                          Page No


10.1 CONCLUSION

The exponential growth in retail stock market participation has created an urgent demand for intelligent, accessible, and transparent financial analysis tools. Traditional platforms either present raw data without actionable insights or lock advanced analytics behind prohibitive subscription barriers, systematically disadvantaging individual investors in an increasingly algorithm-driven market.

This thesis successfully designed, implemented, and validated an AI-Powered Stock Market Analysis Platform — a full-stack web application that integrates deep learning-based price forecasting, real-time market data visualization, and simulated paper trading into a unified, browser-based experience.


10.1.1 Summary of Engineering Contributions

The successful deployment of this platform validates several core engineering paradigms:

    • Deep Learning for Financial Forecasting: The multi-layer LSTM neural network (128→64→32 stacked architecture with Dropout regularization) achieves an R² Score of 0.9159 and a MAPE of 1.02% on historical test data, confirming that deep learning models can generate meaningful short-term stock price forecasts when properly architected and trained.

    • Microservices Architecture: The three-tier architecture (React + Express + FastAPI) demonstrates that complex AI inference systems can be cleanly integrated into modern web applications through well-defined API contracts. The independent scalability of each service ensures that high-demand ML inference does not degrade frontend responsiveness.

    • Transparent AI: By exposing comprehensive model metrics (RMSE, MAE, R², MAPE) and an AI Confidence percentage alongside every prediction, the platform empowers users to make calibrated decisions rather than blindly trusting opaque algorithmic outputs.

    • Real-Time Data Delivery: The Socket.IO WebSocket integration proves that financial-grade real-time data streaming can be achieved in a web browser environment without specialized client software, democratizing access to live market feeds.

    • Risk-Free Practice: The paper trading simulator bridges the gap between financial literacy and active market participation, enabling users to practice investment strategies with realistic trade mechanics (buy/sell execution, portfolio P&L tracking, transaction history) without risking actual capital.


IITE/CSE2026/IDP138                                                CONCLUSION

Department of Computer Science And Engineering                          Page No


10.1.2 Final Verdict

The experimental results confirm that the proposed platform successfully delivers institutional-grade analytical capabilities — real-time market monitoring, AI-powered price forecasting, and portfolio management — through a free, accessible web application. The system's achievement of an R² Score exceeding 0.91 validates the LSTM architecture for short-term price prediction, while the comprehensive UI (Dashboard, Predictions, Watchlist, Discover, History, News, Learn) provides a complete investment analysis workflow.

Ultimately, this thesis proves that the convergence of modern web frameworks (React, Express), deep learning infrastructure (TensorFlow, FastAPI), and thoughtful UX design can democratize financial intelligence for retail investors. As algorithmic trading continues to dominate global markets, platforms like StockAI will be essential to ensuring that individual investors have access to the same analytical tools — transparent, intelligent, and free — that were previously reserved for institutional professionals.


================================================================================

CHAPTER 11
APPENDICES

    11.1 BUSINESS MODEL
    11.2 PRODUCT DEPLOYMENT DETAIL
    11.3 API AND WEB SERVICE DETAILS

================================================================================

IITE/CSE2026/IDP138                                               APPENDICES

Department of Computer Science And Engineering                          Page No


11.1 BUSINESS MODEL

The StockAI platform is designed as a freemium educational and analytical tool targeting retail investors and finance students. The platform is entirely free for individual users, with potential monetization through:

    • Premium Features (Future): Advanced prediction models (Transformer, ensemble methods), extended prediction horizons (365+ days), and custom portfolio optimization algorithms could be offered as a paid tier.

    • API Access (Future): The LSTM prediction engine could be exposed as a paid API service for third-party financial applications and fintech startups.

    • Educational Partnerships: The Learning Center could be expanded with structured courses in partnership with universities and financial education providers.

    • Affiliate Revenue: Integration with real brokerage APIs (Alpaca, Zerodha) could generate referral commissions when users transition from paper trading to live accounts.


IITE/CSE2026/IDP138                                               APPENDICES

Department of Computer Science And Engineering                          Page No


11.2 PRODUCT DEPLOYMENT DETAIL


11.2.1 Local Development Setup

The platform requires three services running simultaneously:

Backend Service (Port 5000):
    $ cd backend
    $ npm install
    $ cp .env.example .env    # Configure MongoDB URI, JWT secret
    $ npm run dev              # Starts Express server with nodemon

ML Service (Port 8000):
    $ cd ml-service
    $ python -m venv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt
    $ python app.py            # Starts FastAPI server with uvicorn

Frontend Application (Port 3000):
    $ cd frontend
    $ npm install
    $ npm start                # Starts React development server


11.2.2 Environment Variables

Backend (.env):
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/stock_ai_platform
    JWT_SECRET=<secure_random_string>
    JWT_EXPIRE=7d
    ML_SERVICE_URL=http://localhost:8000
    CLIENT_URL=http://localhost:3000
    NODE_ENV=development

ML Service (config.py):
    SEQUENCE_LENGTH = 60
    DEFAULT_EPOCHS = 50
    BATCH_SIZE = 32
    TRAIN_SPLIT = 0.8
    DEFAULT_PREDICTION_DAYS = 30
    HISTORICAL_PERIOD = "2y"
    HOST = "0.0.0.0"
    PORT = 8000


11.2.3 Project Directory Structure

/stock-ai-platform
├── /backend
│   ├── config/              (Database, Socket.IO initialization)
│   ├── middleware/           (JWT auth, rate limiting)
│   ├── models/              (User, Stock, Watchlist Mongoose schemas)
│   ├── routes/              (auth, stocks, predictions, watchlist, news)
│   ├── services/            (stockService with caching)
│   ├── server.js            (Express app entry point)
│   ├── package.json
│   └── .env
│
├── /frontend
│   ├── src/
│   │   ├── components/      (Navbar, StockChart, TradeModal)
│   │   ├── context/         (AuthContext, ThemeContext, PortfolioContext)
│   │   ├── pages/           (Dashboard, Predictions, Watchlist, etc.)
│   │   ├── services/        (api.js, socket.js)
│   │   ├── App.js           (React Router setup)
│   │   └── index.js         (React root)
│   ├── public/
│   └── package.json
│
└── /ml-service
    ├── app.py               (FastAPI endpoints)
    ├── model.py             (StockPredictor class — LSTM)
    ├── config.py            (Configuration constants)
    ├── utils.py             (Data generation, metrics)
    ├── requirements.txt
    └── models/              (Persisted .keras models & scalers)


IITE/CSE2026/IDP138                                               APPENDICES

Department of Computer Science And Engineering                          Page No


11.2.4 Application Screenshots

[Fig 11.1 — Market Overview Dashboard: Shows S&P 500, NASDAQ, Dow Jones indices with real-time prices, Quick Access sidebar, and interactive AAPL price chart with 1W/1M/3M/6M/1Y selectors]

[Fig 11.2 — All Stocks Dashboard: Tabular view of all supported stocks showing Symbol, Name, Price, Change, Change %, Volume, and Add to Watchlist action button]

[Fig 11.3 — Stock Detail Page (AAPL): Shows current price ($306.54), change (-1.32%), Buy/Sell buttons, Add to Watchlist, Get AI Prediction, and 1-month interactive price chart]

[Fig 11.4 — AI Predictions Page: GOOGL prediction with Actual vs Predicted overlay chart, RMSE (4.1308), MAE (1.1950), R² Score (0.9159), MAPE (1.02%), AI Confidence (92%), Model Information panel, and Predicted Prices table for next 30 days]

[Fig 11.5 — Stock Recommendations (Discover): AI-powered stock cards showing Top Gainers with "Strong Buy"/"Buy" labels, confidence percentages, volumes, and "Buy Now" buttons]

[Fig 11.6 — Transaction History: Displays Total Trades (6), Total Bought ($4,216.10), Total Sold ($2,255.80), Net P&L (-$1,960.30), with detailed trade log showing Date/Time, Type, Symbol, Quantity, Price, Total, and Balance After]

[Fig 11.7 — Watchlist: Shows tracked stocks (AAPL, META) with current prices and percentage change indicators, Refresh button, and delete functionality]

[Fig 11.8 — Login Page: StockAI branded login form with Email Address and Password fields, Continue button, and "Create one" registration link]

[Fig 11.9 — Learning Center: Searchable educational content with expandable cards for Dashboard, Stock Detail Page, AI Predictions, Watchlist, and Buy & Sell (Paper Trading)]


IITE/CSE2026/IDP138                                               APPENDICES

Department of Computer Science And Engineering                          Page No


11.3 API AND WEB SERVICE DETAILS


11.3.1 Backend REST API Endpoints (Express @ port 5000)

Route                              Method   Auth    Purpose
─────                              ──────   ────    ───────
/api/auth/register                 POST     -       Register new user
/api/auth/login                    POST     -       Login, receive JWT token
/api/auth/me                       GET      JWT     Get current user profile
/api/stocks/quote/:symbol          GET      -       Real-time stock quote
/api/stocks/historical/:symbol     GET      -       Historical price data
/api/stocks/search/:query          GET      -       Search stocks by name/symbol
/api/stocks/market-summary         GET      -       Market indices (S&P, NASDAQ, DJ)
/api/predict/:symbol               POST     -       Get LSTM predictions
/api/predict/history/:symbol       GET      -       Prediction accuracy history
/api/watchlist                     GET      JWT     Get user's watchlist
/api/watchlist/add                 POST     JWT     Add stock to watchlist
/api/watchlist/remove/:symbol      DELETE   JWT     Remove stock from watchlist
/api/news                          GET      -       Market news articles
/api/health                        GET      -       Server health check


11.3.2 ML Service API Endpoints (FastAPI @ port 8000)

Endpoint                           Method   Purpose
────────                           ──────   ───────
/api/predict                       POST     Generate LSTM price predictions
/api/train                         POST     Train/retrain model for a symbol
/api/predict/history/{symbol}      GET      Actual vs. predicted (90 days)
/api/models                        GET      List all trained models
/api/health                        GET      ML service health check


11.3.3 LSTM Model Architecture

    Input Shape: (sequence_length=60, features=1)
    Layer 1: LSTM(128 units, return_sequences=True) → Dropout(0.2)
    Layer 2: LSTM(64 units, return_sequences=True) → Dropout(0.2)
    Layer 3: LSTM(32 units, return_sequences=False) → Dropout(0.2)
    Layer 4: Dense(16 units, activation='relu')
    Output:  Dense(1 unit)

    Optimizer: Adam (learning_rate=0.001)
    Loss Function: Mean Squared Error
    Training Metric: Mean Absolute Error
    Regularization: Early Stopping (patience=10, restore_best_weights=True)
    Validation Split: 10%
    Training Data: 2 years of historical Close prices (yfinance)
    Normalization: MinMaxScaler (range: 0 to 1)


================================================================================

BIBLIOGRAPHY

================================================================================

BIBLIOGRAPHY

[1] S. Hochreiter and J. Schmidhuber, "Long Short-Term Memory," Neural Computation, vol. 9, no. 8, pp. 1735–1780, 1997.

[2] T. Fischer and C. Krauss, "Deep learning with long short-term memory networks for financial market predictions," European Journal of Operational Research, vol. 270, no. 2, pp. 654–669, 2018.

[3] S. Selvin, R. Vinayakumar, E. A. Gopalakrishnan, V. K. Menon, and K. P. Soman, "Stock price prediction using LSTM, RNN and CNN-sliding window model," in 2017 International Conference on Advances in Computing, Communications and Informatics (ICACCI), pp. 1643–1647, 2017.

[4] A. Moghar and M. Hamiche, "Stock Market Prediction Using LSTM Recurrent Neural Network," Procedia Computer Science, vol. 170, pp. 1168–1173, 2020.

[5] W. Bao, J. Yue, and Y. Rao, "A deep learning framework for financial time series using stacked autoencoders and long-short term memory," PLOS ONE, vol. 12, no. 7, e0180944, 2017.

[6] React Documentation, "React – A JavaScript library for building user interfaces," Meta Platforms, Inc. Available: https://react.dev/

[7] Express.js Documentation, "Express – Fast, unopinionated, minimalist web framework for Node.js." Available: https://expressjs.com/

[8] TensorFlow Documentation, "TensorFlow – An end-to-end open source machine learning platform," Google Brain Team. Available: https://www.tensorflow.org/

[9] FastAPI Documentation, "FastAPI – Modern, fast (high-performance), web framework for building APIs with Python." Available: https://fastapi.tiangolo.com/

[10] MongoDB Documentation, "MongoDB – The application data platform." Available: https://www.mongodb.com/docs/

[11] Socket.IO Documentation, "Socket.IO – Bidirectional and low-latency communication for every platform." Available: https://socket.io/docs/

[12] yfinance Documentation, "Download market data from Yahoo! Finance's API." Available: https://pypi.org/project/yfinance/

[13] Recharts Documentation, "A composable charting library built on React components." Available: https://recharts.org/

[14] X. Ding, Y. Zhang, T. Liu, and J. Duan, "Deep learning for event-driven stock prediction," in Proceedings of the Twenty-Fourth International Joint Conference on Artificial Intelligence (IJCAI), pp. 2327–2333, 2015.

[15] M. Roondiwala, H. Patel, and S. Varma, "Predicting Stock Prices Using LSTM," International Journal of Science and Research (IJSR), vol. 6, no. 4, pp. 1754–1756, 2017.

================================================================================

LIST OF FIGURES

Figure No.    Title                                                     Page No
──────────    ─────                                                     ────────
Fig 6.1       System Architecture Diagram                                52
Fig 7.1       AI Prediction Results — Metrics Dashboard                  56
Fig 7.2       Transaction History                                        57
Fig 8.1       Class Diagram                                              60
Fig 8.2       Use-Case Diagram                                           61
Fig 8.3       Sequence Diagram                                           65
Fig 8.4       Activity Diagram                                           68
Fig 8.5.1     Level 0 DFD (Context Diagram)                              69
Fig 8.5.2     Level 1 DFD (Primary Sub-Systems)                          70
Fig 11.1      Market Overview Dashboard                                  78
Fig 11.2      All Stocks Dashboard                                       78
Fig 11.3      Stock Detail Page (AAPL)                                   78
Fig 11.4      AI Predictions Page (GOOGL)                                79
Fig 11.5      Stock Recommendations (Discover)                           79
Fig 11.6      Transaction History                                        79
Fig 11.7      Watchlist                                                  80
Fig 11.8      Login Page                                                 80
Fig 11.9      Learning Center                                            80


================================================================================

LIST OF TABLES

Table No.     Title                                                     Page No
──────────    ─────                                                     ────────
Table 5.1     Platform Comparison (Cost, AI, Transparency)               44
Table 5.2     Architecture Comparison                                    44
Table 5.3     ML Methodology Comparison                                  44
Table 7.1     LSTM Model Evaluation Metrics                              56
Table 7.2     Test Cases                                                 58
Table 11.1    Backend REST API Endpoints                                 81
Table 11.2    ML Service API Endpoints                                   82
Table 11.3    LSTM Model Architecture                                    82


================================================================================

ABBREVIATIONS

Abbreviation    Full Form
────────────    ─────────
AI              Artificial Intelligence
API             Application Programming Interface
ARIMA           AutoRegressive Integrated Moving Average
CORS            Cross-Origin Resource Sharing
CRUD            Create, Read, Update, Delete
CSS             Cascading Style Sheets
DFD             Data Flow Diagram
DOM             Document Object Model
EMA             Exponential Moving Average
FastAPI         Fast Application Programming Interface (Python)
GARCH           Generalized Autoregressive Conditional Heteroskedasticity
HTML            HyperText Markup Language
HTTP            HyperText Transfer Protocol
JSON            JavaScript Object Notation
JWT             JSON Web Token
LSTM            Long Short-Term Memory
MACD            Moving Average Convergence Divergence
MAE             Mean Absolute Error
MAPE            Mean Absolute Percentage Error
ML              Machine Learning
MongoDB         Document-Oriented NoSQL Database
NLP             Natural Language Processing
NoSQL           Not Only Structured Query Language
ODM             Object Document Mapper
OHLCV           Open, High, Low, Close, Volume
P&L             Profit and Loss
R²              Coefficient of Determination
REST            Representational State Transfer
RMSE            Root Mean Squared Error
RSI             Relative Strength Index
SMA             Simple Moving Average
SPA             Single Page Application
SQL             Structured Query Language
TTL             Time To Live
UI              User Interface
UML             Unified Modeling Language
UX              User Experience
WebSocket       Full-Duplex Communication Protocol

================================================================================

END OF THESIS

================================================================================
