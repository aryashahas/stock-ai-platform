#!/usr/bin/env python3
"""Create all UML/DFD diagrams - v2 with proper spacing to avoid overlaps."""
from fpdf import FPDF
import os

SS_DIR = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/diagrams/'
os.makedirs(SS_DIR, exist_ok=True)


def draw_box(pdf, x, y, w, h, title, lines=None, fill=False):
    if fill:
        pdf.set_fill_color(230, 240, 250)
        pdf.rect(x, y, w, h, 'DF')
    else:
        pdf.rect(x, y, w, h)
    pdf.set_font('Helvetica', 'B', 7)
    pdf.set_xy(x+1, y+2)
    pdf.cell(w-2, 4, title, 0, 0, 'C')
    pdf.line(x, y+7, x+w, y+7)
    if lines:
        pdf.set_font('Helvetica', '', 6)
        for i, line in enumerate(lines):
            pdf.set_xy(x+2, y+8+i*3.2)
            pdf.cell(w-4, 3, line, 0, 0, 'L')


def arrow_h(pdf, x1, y, x2):
    pdf.line(x1, y, x2, y)
    d = 2 if x2 > x1 else -2
    pdf.line(x2, y, x2-d, y-1.2)
    pdf.line(x2, y, x2-d, y+1.2)


def arrow_v(pdf, x, y1, y2):
    pdf.line(x, y1, x, y2)
    d = 2 if y2 > y1 else -2
    pdf.line(x, y2, x-1.2, y2-d)
    pdf.line(x, y2, x+1.2, y2-d)


# =========================================
# 1. CLASS DIAGRAM - Landscape, well spaced
# =========================================
def create_class_diagram():
    pdf = FPDF('L', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, 'Class Diagram - StockAI Platform', 0, 1, 'C')

    # Package 1: React Frontend
    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_fill_color(245, 250, 255)
    pdf.rect(8, 18, 88, 85, 'DF')
    pdf.set_xy(8, 18)
    pdf.cell(88, 5, 'React Frontend (JavaScript)', 0, 0, 'C')

    draw_box(pdf, 12, 25, 38, 35, 'ApiService', [
        '- baseURL: string', '- token: string', '--------',
        '+ getQuote(sym)', '+ getPrediction(sym,d)',
        '+ getWatchlist()', '+ executeTrade(data)',
    ])
    draw_box(pdf, 54, 25, 38, 35, 'AuthContext', [
        '- user: Object', '- token: string',
        '- isAuthenticated: bool', '--------',
        '+ login(email, pwd)', '+ register(data)',
        '+ logout()',
    ])
    draw_box(pdf, 12, 65, 38, 32, 'PortfolioContext', [
        '- trades: Array', '- balance: number', '--------',
        '+ executeBuy(sym,q,p)', '+ executeSell(sym,q,p)',
        '+ getHistory()',
    ])
    draw_box(pdf, 54, 65, 38, 32, 'SocketService', [
        '- socket: IO instance', '--------',
        '+ connect()', '+ subscribe(sym)',
        '+ onPriceUpdate(cb)', '+ disconnect()',
    ])

    # Package 2: Express Backend
    pdf.set_fill_color(255, 248, 240)
    pdf.rect(104, 18, 82, 85, 'DF')
    pdf.set_xy(104, 18)
    pdf.set_font('Helvetica', 'B', 8)
    pdf.cell(82, 5, 'Express Backend (Node.js)', 0, 0, 'C')

    draw_box(pdf, 108, 25, 34, 25, 'AuthMiddleware', [
        '--------',
        '+ verifyToken(req,res,next)',
        '+ hashPassword(pwd)',
    ])
    draw_box(pdf, 148, 25, 34, 28, 'StockService', [
        '- cache: NodeCache(60s)', '--------',
        '+ getQuote(sym)', '+ getHistorical(sym)',
        '+ searchStocks(q)',
    ])
    draw_box(pdf, 108, 58, 74, 28, 'PredictionProxy', [
        '- mlServiceURL: "http://localhost:8000"', '--------',
        '+ getPrediction(symbol, days)',
        '+ getHistory(symbol)',
        '+ getMockPrediction(symbol, days)',
    ])

    # Package 3: FastAPI ML Service
    pdf.set_fill_color(240, 255, 240)
    pdf.rect(194, 18, 96, 85, 'DF')
    pdf.set_xy(194, 18)
    pdf.set_font('Helvetica', 'B', 8)
    pdf.cell(96, 5, 'FastAPI ML Service (Python)', 0, 0, 'C')

    draw_box(pdf, 198, 25, 44, 38, 'StockPredictor', [
        '- model: Keras Sequential', '- scaler: MinMaxScaler',
        '- seq_length: int = 60', '--------',
        '+ prepare_data(sym)', '+ train(sym, epochs)',
        '+ predict(sym, days)', '+ load_model(sym)',
    ])
    draw_box(pdf, 248, 25, 38, 30, 'Configuration', [
        'SEQ_LENGTH = 60', 'EPOCHS = 50',
        'BATCH_SIZE = 32', 'TRAIN_SPLIT = 0.8',
        'PRED_DAYS = 30', 'PERIOD = "2y"',
    ])

    # MongoDB at bottom
    pdf.set_fill_color(230, 230, 250)
    draw_box(pdf, 198, 70, 86, 25, 'MongoDB Collections', [
        'Users: {_id, name, email, password, role}',
        'Stocks: {symbol, price, change, historicalData[]}',
        'Watchlists: {user(ref), stocks[{sym, addedAt}]}',
    ], fill=True)

    # Arrows
    pdf.set_line_width(0.5)
    arrow_h(pdf, 96, 50, 104)
    pdf.set_font('Helvetica', 'I', 6)
    pdf.set_xy(95, 44); pdf.cell(12, 3, 'HTTP/WS', 0, 0, 'C')

    arrow_h(pdf, 186, 70, 194)
    pdf.set_xy(186, 64); pdf.cell(12, 3, 'REST API', 0, 0, 'C')

    pdf.output(SS_DIR + 'class_diagram.pdf')
    print('Class diagram done')


# =========================================
# 2. USE-CASE DIAGRAM
# =========================================
def create_usecase_diagram():
    pdf = FPDF('P', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, 'Use-Case Diagram - StockAI Platform', 0, 1, 'C')

    # System boundary
    pdf.set_fill_color(250, 252, 255)
    pdf.rect(50, 18, 115, 245, 'DF')
    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_xy(50, 19); pdf.cell(115, 4, 'StockAI System Boundary', 0, 0, 'C')

    def actor(pdf, x, y, name):
        pdf.circle(x, y-5, 2.5)
        pdf.line(x, y-2.5, x, y+4)
        pdf.line(x-3.5, y, x+3.5, y)
        pdf.line(x, y+4, x-2.5, y+8)
        pdf.line(x, y+4, x+2.5, y+8)
        pdf.set_font('Helvetica', 'B', 6.5)
        pdf.set_xy(x-14, y+9)
        pdf.cell(28, 3, name, 0, 0, 'C')

    def usecase(pdf, x, y, text):
        pdf.ellipse(x-25, y-6, 50, 12)
        pdf.set_font('Helvetica', '', 6.5)
        pdf.set_xy(x-24, y-4)
        pdf.cell(48, 8, text, 0, 0, 'C')

    actor(pdf, 22, 80, 'Guest User')
    actor(pdf, 22, 190, 'Auth User')
    actor(pdf, 188, 80, 'ML Service')
    actor(pdf, 188, 230, 'Admin')

    # Guest use cases
    guc = [(107, 32, 'View Dashboard'), (107, 50, 'View Stock Detail'),
           (107, 68, 'Generate AI Prediction'), (107, 86, 'Browse Recommendations'),
           (107, 104, 'Read News'), (107, 122, 'Access Learning Center')]
    for x, y, t in guc:
        usecase(pdf, x, y, t)
        pdf.line(34, 78, 82, y)

    # Auth use cases
    auc = [(107, 150, 'Manage Watchlist'), (107, 170, 'Execute Paper Trade'),
           (107, 190, 'View Transaction History'), (107, 210, 'View Portfolio P&L')]
    for x, y, t in auc:
        usecase(pdf, x, y, t)
        pdf.line(34, 188, 82, y)

    # ML connections
    pdf.set_dash_pattern(1.5, 1)
    pdf.line(176, 78, 132, 68)
    pdf.set_dash_pattern()

    # Admin
    usecase(pdf, 107, 235, 'View Server Health')
    usecase(pdf, 107, 252, 'Monitor API Stats')
    pdf.line(176, 230, 132, 235)
    pdf.line(176, 232, 132, 252)

    # Extend label
    pdf.set_font('Helvetica', 'I', 5)
    pdf.set_xy(60, 140); pdf.cell(25, 3, '<<extend>>', 0, 0, 'C')

    pdf.output(SS_DIR + 'usecase_diagram.pdf')
    print('Use-case diagram done')


# =========================================
# 3. SEQUENCE DIAGRAM - Landscape, no overlap
# =========================================
def create_sequence_diagram():
    pdf = FPDF('L', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 7, 'Sequence Diagram - AI Prediction Request', 0, 1, 'C')

    # Actors - spread widely to avoid overlap
    actors = [('User', 30), ('React\nFrontend', 75), ('Express\nBackend', 130),
              ('FastAPI\nML Service', 190), ('Yahoo\nFinance', 245)]
    for name, x in actors:
        draw_box(pdf, x-16, 12, 32, 10, name.replace('\n',' '))
        pdf.set_dash_pattern(1, 1)
        pdf.line(x, 22, x, 180)
        pdf.set_dash_pattern()

    # Activation bars
    pdf.set_fill_color(210, 225, 255)
    pdf.rect(73, 30, 4, 125, 'F')
    pdf.rect(128, 38, 4, 100, 'F')
    pdf.rect(188, 46, 4, 85, 'F')

    # Messages with CLEAR vertical spacing (12mm between each)
    def msg(pdf, x1, x2, y, text):
        arrow_h(pdf, x1, y, x2)
        pdf.set_font('Helvetica', '', 5.5)
        mx = min(x1, x2) + 3
        pdf.set_xy(mx, y-4)
        pdf.cell(abs(x2-x1)-6, 3, text, 0, 0, 'L')

    def self_msg(pdf, x, y, text):
        pdf.set_fill_color(240, 245, 255)
        pdf.rect(x+2, y-3, 40, 7, 'DF')
        pdf.set_font('Helvetica', '', 5)
        pdf.set_xy(x+3, y-2)
        pdf.cell(38, 5, text, 0, 0, 'L')

    y = 32
    msg(pdf, 30, 75, y, '1. Select symbol, click Predict'); y += 11
    msg(pdf, 75, 130, y, '2. POST /api/predict/GOOGL'); y += 11
    msg(pdf, 130, 190, y, '3. Proxy to FastAPI /predict'); y += 11
    msg(pdf, 190, 245, y, '4. Fetch 2yr history (yfinance)'); y += 11
    msg(pdf, 245, 190, y, '5. Return OHLCV data'); y += 11
    self_msg(pdf, 190, y, '6. Normalize, generate sequences'); y += 11
    self_msg(pdf, 190, y, '7. Train LSTM (if no cache)'); y += 11
    self_msg(pdf, 190, y, '8. Autoregressive prediction'); y += 11
    self_msg(pdf, 190, y, '9. Calculate RMSE, MAE, R2, MAPE'); y += 11
    msg(pdf, 190, 130, y, '10. Return predictions + metrics'); y += 11
    msg(pdf, 130, 75, y, '11. Relay JSON response'); y += 11
    msg(pdf, 75, 30, y, '12. Render charts & metrics')

    pdf.output(SS_DIR + 'sequence_diagram.pdf')
    print('Sequence diagram done')


# =========================================
# 4. ACTIVITY DIAGRAM - Better spacing
# =========================================
def create_activity_diagram():
    pdf = FPDF('P', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 7, 'Activity Diagram - Prediction Flow', 0, 1, 'C')

    sw = 62
    # Swimlane headers
    for i, name in enumerate(['React Frontend', 'Express Backend', 'FastAPI ML Service']):
        x = 12 + i * sw
        pdf.set_fill_color(240, 245, 255)
        pdf.rect(x, 14, sw, 8, 'DF')
        pdf.set_font('Helvetica', 'B', 7)
        pdf.set_xy(x, 14); pdf.cell(sw, 8, name, 0, 0, 'C')
    # Swimlane borders
    for i in range(4):
        pdf.line(12 + i * sw, 14, 12 + i * sw, 270)

    def act(pdf, x, y, text, w=48, h=12):
        pdf.set_fill_color(220, 235, 250)
        pdf.rect(x, y, w, h, 'DF')
        pdf.set_font('Helvetica', '', 6)
        pdf.set_xy(x+1, y+1)
        pdf.multi_cell(w-2, 3.5, text, 0, 'C')

    def diamond(pdf, x, y, text):
        s = 5
        pts = [(x, y-s), (x+s*1.5, y), (x, y+s), (x-s*1.5, y)]
        pdf.polygon(pts)
        pdf.set_font('Helvetica', '', 5)
        pdf.set_xy(x-12, y+6)
        pdf.cell(24, 3, text, 0, 0, 'C')

    # Start
    pdf.set_fill_color(0)
    pdf.circle(43, 28, 2.5, 'F')
    arrow_v(pdf, 43, 31, 35)

    # Frontend
    act(pdf, 19, 35, 'User selects stock\nsymbol')
    arrow_v(pdf, 43, 47, 52)
    act(pdf, 19, 52, 'Click "Generate\nPrediction"')
    arrow_v(pdf, 43, 64, 69)
    act(pdf, 19, 69, 'Show loading\nspinner')

    # -> Backend
    arrow_h(pdf, 67, 75, 78)

    # Backend
    act(pdf, 78, 69, 'Receive prediction\nrequest', 52)
    arrow_v(pdf, 104, 81, 88)
    diamond(pdf, 104, 94, 'ML available?')
    # Yes ->
    pdf.set_font('Helvetica', 'B', 5)
    pdf.set_xy(112, 89); pdf.cell(8, 3, 'Yes', 0, 0, 'L')
    arrow_h(pdf, 112, 94, 140)
    # No v
    pdf.set_xy(96, 101); pdf.cell(8, 3, 'No', 0, 0, 'R')
    arrow_v(pdf, 104, 99, 106)
    act(pdf, 78, 106, 'Generate mock\npredictions', 52)

    # ML Service
    act(pdf, 140, 88, 'Check model cache', 50)
    arrow_v(pdf, 165, 100, 108)
    diamond(pdf, 165, 114, 'Cached?')
    pdf.set_font('Helvetica', 'B', 5)
    pdf.set_xy(173, 109); pdf.cell(8, 3, 'No', 0, 0, 'L')
    arrow_v(pdf, 165, 119, 128)
    act(pdf, 140, 128, 'Fetch yfinance data\nNormalize, train LSTM', 50)
    arrow_v(pdf, 165, 140, 148)
    act(pdf, 140, 148, 'Generate predictions\n(autoregressive)', 50)
    arrow_v(pdf, 165, 160, 168)
    act(pdf, 140, 168, 'Calculate metrics\nRMSE, MAE, R2, MAPE', 50)
    arrow_v(pdf, 165, 180, 186)
    act(pdf, 140, 186, 'Return JSON response', 50)

    # Response back
    arrow_h(pdf, 140, 192, 130)
    act(pdf, 78, 196, 'Relay response\nto frontend', 52)
    arrow_h(pdf, 78, 202, 67)

    # Frontend renders
    act(pdf, 19, 210, 'Render Actual vs.\nPredicted chart')
    arrow_v(pdf, 43, 222, 228)
    act(pdf, 19, 228, 'Display metrics &\npredicted prices table')

    # End
    arrow_v(pdf, 43, 240, 248)
    pdf.set_fill_color(0)
    pdf.circle(43, 252, 2.5, 'F')
    pdf.circle(43, 252, 4)

    pdf.output(SS_DIR + 'activity_diagram.pdf')
    print('Activity diagram done')


# =========================================
# 5. LEVEL 0 DFD
# =========================================
def create_dfd_level0():
    pdf = FPDF('L', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, 'Level 0 DFD (Context Diagram)', 0, 1, 'C')

    # Central process
    pdf.set_fill_color(220, 240, 255)
    pdf.ellipse(100, 65, 90, 45, 'DF')
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_xy(105, 78); pdf.cell(80, 5, '0.0', 0, 0, 'C')
    pdf.set_xy(105, 85); pdf.cell(80, 5, 'StockAI Platform', 0, 0, 'C')

    # Entities
    pdf.set_fill_color(255, 240, 220)
    draw_box(pdf, 5, 60, 50, 20, 'Retail Investor', ['(End User)'], fill=True)
    pdf.set_fill_color(220, 255, 220)
    draw_box(pdf, 120, 15, 50, 18, 'Yahoo Finance API', ['(External Data)'], fill=True)
    pdf.set_fill_color(240, 230, 255)
    draw_box(pdf, 235, 60, 50, 20, 'MongoDB Database', ['(Persistence)'], fill=True)

    # Arrows
    pdf.set_line_width(0.4)
    arrow_h(pdf, 55, 67, 102)
    pdf.set_font('Helvetica', '', 6)
    pdf.set_xy(58, 61); pdf.cell(40, 3, 'Queries, Credentials, Trades', 0, 0, 'L')

    arrow_h(pdf, 102, 77, 55)
    pdf.set_xy(58, 79); pdf.cell(40, 3, 'Predictions, Market Data, P&L', 0, 0, 'L')

    arrow_v(pdf, 150, 33, 66)
    pdf.set_xy(152, 44); pdf.cell(30, 3, 'OHLCV Data', 0, 0, 'L')
    arrow_v(pdf, 140, 66, 33)
    pdf.set_xy(108, 44); pdf.cell(30, 3, 'API Requests', 0, 0, 'R')

    arrow_h(pdf, 190, 67, 235)
    pdf.set_xy(195, 61); pdf.cell(35, 3, 'Store Users, Stocks, WL', 0, 0, 'L')
    arrow_h(pdf, 235, 77, 190)
    pdf.set_xy(195, 79); pdf.cell(35, 3, 'Retrieve Data', 0, 0, 'L')

    pdf.output(SS_DIR + 'dfd_level0.pdf')
    print('Level 0 DFD done')


# =========================================
# 6. LEVEL 1 DFD
# =========================================
def create_dfd_level1():
    pdf = FPDF('L', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 7, 'Level 1 DFD (Primary Sub-Systems)', 0, 1, 'C')

    # Entities
    pdf.set_fill_color(255, 240, 220)
    draw_box(pdf, 3, 40, 35, 14, 'Retail Investor', [], fill=True)
    pdf.set_fill_color(220, 255, 220)
    draw_box(pdf, 3, 140, 35, 14, 'Yahoo Finance', [], fill=True)

    def process(pdf, x, y, num, name):
        pdf.set_fill_color(220, 240, 255)
        pdf.ellipse(x-20, y-9, 40, 18, 'DF')
        pdf.set_font('Helvetica', 'B', 7)
        pdf.set_xy(x-18, y-7); pdf.cell(36, 4, num, 0, 0, 'C')
        pdf.set_font('Helvetica', '', 6)
        pdf.set_xy(x-18, y-1); pdf.cell(36, 4, name, 0, 0, 'C')

    process(pdf, 80, 30, '1.0', 'User Auth')
    process(pdf, 80, 65, '2.0', 'Stock Data Service')
    process(pdf, 175, 30, '3.0', 'AI Prediction')
    process(pdf, 175, 65, '4.0', 'Watchlist Mgmt')
    process(pdf, 175, 100, '5.0', 'Paper Trading')
    process(pdf, 80, 100, '6.0', 'WebSocket')

    # Data stores
    pdf.set_fill_color(240, 230, 255)
    draw_box(pdf, 240, 22, 45, 11, 'D1: Users', [], fill=True)
    draw_box(pdf, 240, 48, 45, 11, 'D2: Stocks', [], fill=True)
    draw_box(pdf, 240, 74, 45, 11, 'D3: Watchlists', [], fill=True)
    draw_box(pdf, 240, 100, 45, 11, 'D4: Model Cache', [], fill=True)

    # Connections
    arrow_h(pdf, 38, 45, 60)
    arrow_h(pdf, 38, 65, 60)
    arrow_h(pdf, 100, 30, 155)
    arrow_h(pdf, 100, 65, 155)
    arrow_h(pdf, 195, 30, 240)
    arrow_h(pdf, 195, 65, 240)
    arrow_h(pdf, 195, 100, 240)
    arrow_v(pdf, 80, 74, 91)
    arrow_h(pdf, 38, 147, 60)
    arrow_v(pdf, 175, 39, 56)

    pdf.output(SS_DIR + 'dfd_level1.pdf')
    print('Level 1 DFD done')


# =========================================
# 7. LEVEL 2 DFD
# =========================================
def create_dfd_level2():
    pdf = FPDF('L', 'mm', 'A4')
    pdf.add_page()
    pdf.set_draw_color(0)
    pdf.set_line_width(0.3)
    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 7, 'Level 2 DFD - Process 3.0: AI Prediction Engine', 0, 1, 'C')

    # Input entity
    pdf.set_fill_color(255, 240, 220)
    pdf.set_dash_pattern(2, 1)
    draw_box(pdf, 5, 50, 45, 14, 'From Backend', ['(Prediction Request)'], fill=True)
    pdf.set_dash_pattern()

    def process(pdf, x, y, num, name):
        pdf.set_fill_color(220, 240, 255)
        pdf.ellipse(x-22, y-9, 44, 18, 'DF')
        pdf.set_font('Helvetica', 'B', 7)
        pdf.set_xy(x-20, y-7); pdf.cell(40, 4, num, 0, 0, 'C')
        pdf.set_font('Helvetica', '', 6)
        pdf.set_xy(x-20, y); pdf.cell(40, 4, name, 0, 0, 'C')

    process(pdf, 100, 35, '3.1', 'Parse Request')
    process(pdf, 100, 75, '3.2', 'Check Model Cache')
    process(pdf, 200, 55, '3.3', 'Train LSTM Model')
    process(pdf, 200, 100, '3.4', 'Generate Predictions')
    process(pdf, 100, 120, '3.5', 'Calculate Metrics')

    # Data stores
    pdf.set_fill_color(240, 230, 255)
    draw_box(pdf, 240, 30, 42, 12, 'D4: Model Cache', ['.keras files'], fill=True)
    draw_box(pdf, 240, 75, 42, 12, 'D5: Scaler Cache', ['.pkl files'], fill=True)

    # Yahoo
    pdf.set_fill_color(220, 255, 220)
    draw_box(pdf, 200, 140, 40, 12, 'Yahoo Finance', ['(yfinance)'], fill=True)

    # Output
    pdf.set_fill_color(255, 240, 220)
    pdf.set_dash_pattern(2, 1)
    draw_box(pdf, 5, 115, 45, 14, 'To Backend', ['(Predictions + Metrics)'], fill=True)
    pdf.set_dash_pattern()

    # Arrows
    arrow_h(pdf, 50, 57, 78)
    pdf.set_font('Helvetica', '', 5.5)
    pdf.set_xy(52, 52); pdf.cell(25, 3, 'Symbol + Days', 0, 0, 'L')

    arrow_v(pdf, 100, 44, 66)
    arrow_h(pdf, 122, 75, 178)
    pdf.set_xy(135, 70); pdf.cell(20, 3, 'Cache Miss', 0, 0, 'L')

    arrow_h(pdf, 222, 45, 240)
    arrow_h(pdf, 240, 85, 222)
    arrow_v(pdf, 200, 64, 91)
    pdf.set_xy(202, 72); pdf.cell(20, 3, 'Trained Model', 0, 0, 'L')
    arrow_h(pdf, 178, 100, 122)
    pdf.set_xy(135, 95); pdf.cell(25, 3, 'Predictions[]', 0, 0, 'L')
    arrow_h(pdf, 78, 120, 50)
    pdf.set_xy(52, 115); pdf.cell(25, 3, 'JSON Response', 0, 0, 'L')
    arrow_v(pdf, 220, 140, 109)
    pdf.set_xy(222, 120); pdf.cell(18, 3, 'OHLCV', 0, 0, 'L')

    pdf.output(SS_DIR + 'dfd_level2.pdf')
    print('Level 2 DFD done')


if __name__ == '__main__':
    create_class_diagram()
    create_usecase_diagram()
    create_sequence_diagram()
    create_activity_diagram()
    create_dfd_level0()
    create_dfd_level1()
    create_dfd_level2()

    # Convert to PNG
    from pdf2image import convert_from_path
    for f in os.listdir(SS_DIR):
        if f.endswith('.pdf'):
            pages = convert_from_path(SS_DIR + f, dpi=250)
            pages[0].save(SS_DIR + f.replace('.pdf', '.png'), 'PNG')
            print(f'  {f} -> PNG')
    print(f'\nAll 7 diagrams ready in {SS_DIR}')
