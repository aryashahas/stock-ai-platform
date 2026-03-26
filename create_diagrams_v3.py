#!/usr/bin/env python3
"""Create all 7 UML/DFD diagrams using matplotlib for clean rendering."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

OUT = '/Users/aryashah/final-year-claudedemo/stock-ai-platform/diagrams/'
os.makedirs(OUT, exist_ok=True)

# Common styling
BOX_COLOR = '#DCE8F8'
BOX_BORDER = '#4472C4'
ENTITY_COLOR = '#FFF2CC'
ENTITY_BORDER = '#D6A800'
STORE_COLOR = '#E8D5F5'
ML_COLOR = '#D5F5E3'
TITLE_SIZE = 14
HEAD_SIZE = 9
BODY_SIZE = 7


def add_box(ax, x, y, w, h, title, lines=None, color=BOX_COLOR, border=BOX_BORDER, title_size=HEAD_SIZE):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02",
                          facecolor=color, edgecolor=border, linewidth=1.2)
    ax.add_patch(box)
    ax.text(x + w/2, y + h - 0.15, title, ha='center', va='top', fontsize=title_size, fontweight='bold')
    if lines:
        ax.plot([x+0.05, x+w-0.05], [y+h-0.3, y+h-0.3], color=border, linewidth=0.5)
        for i, line in enumerate(lines):
            ax.text(x + 0.08, y + h - 0.45 - i*0.18, line, ha='left', va='top', fontsize=BODY_SIZE, family='monospace')


def add_arrow(ax, x1, y1, x2, y2, label='', color='black'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.2))
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my + 0.08, label, ha='center', va='bottom', fontsize=6, style='italic')


def add_ellipse(ax, x, y, w, h, text, color=BOX_COLOR):
    e = mpatches.Ellipse((x, y), w, h, facecolor=color, edgecolor=BOX_BORDER, linewidth=1)
    ax.add_patch(e)
    ax.text(x, y, text, ha='center', va='center', fontsize=7, fontweight='bold')


# ============================================================
# 1. CLASS DIAGRAM
# ============================================================
def class_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(16, 8))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 8)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Class Diagram - StockAI Platform', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Package backgrounds
    ax.add_patch(FancyBboxPatch((0.2, 0.3), 4.8, 7.2, boxstyle="round,pad=0.1", facecolor='#F0F5FF', edgecolor='#4472C4', linewidth=1.5, linestyle='--'))
    ax.text(2.6, 7.35, 'React Frontend (JavaScript)', ha='center', fontsize=9, fontweight='bold', color='#4472C4')

    ax.add_patch(FancyBboxPatch((5.5, 0.3), 4.5, 7.2, boxstyle="round,pad=0.1", facecolor='#FFF8F0', edgecolor='#D4760A', linewidth=1.5, linestyle='--'))
    ax.text(7.75, 7.35, 'Express Backend (Node.js)', ha='center', fontsize=9, fontweight='bold', color='#D4760A')

    ax.add_patch(FancyBboxPatch((10.5, 0.3), 5.2, 7.2, boxstyle="round,pad=0.1", facecolor='#F0FFF0', edgecolor='#2E8B57', linewidth=1.5, linestyle='--'))
    ax.text(13.1, 7.35, 'FastAPI ML Service (Python)', ha='center', fontsize=9, fontweight='bold', color='#2E8B57')

    # Frontend classes
    add_box(ax, 0.4, 4.2, 2.2, 2.8, 'ApiService', [
        '- baseURL: string', '- token: string', '',
        '+ getQuote(symbol)', '+ getPrediction(sym, days)',
        '+ getWatchlist()', '+ executeTrade(data)', '+ login(creds)', '+ register(data)'
    ])
    add_box(ax, 2.8, 4.2, 2.0, 2.8, 'AuthContext', [
        '- user: Object', '- token: string', '- isAuthenticated: bool', '',
        '+ login(email, pwd)', '+ register(name, email, pwd)', '+ logout()'
    ])
    add_box(ax, 0.4, 0.5, 2.2, 2.8, 'PortfolioContext', [
        '- trades: Array', '- balance: number', '',
        '+ executeBuy(sym, qty, price)', '+ executeSell(sym, qty, price)', '+ getHistory()'
    ])
    add_box(ax, 2.8, 0.5, 2.0, 2.8, 'SocketService', [
        '- socket: IO instance', '',
        '+ connect()', '+ subscribe(symbol)', '+ onPriceUpdate(callback)', '+ disconnect()'
    ])

    # Backend classes
    add_box(ax, 5.7, 4.5, 2.0, 2.3, 'AuthMiddleware', [
        '', '+ verifyToken(req, res, next)', '+ hashPassword(pwd)'
    ])
    add_box(ax, 7.9, 4.5, 1.9, 2.3, 'StockService', [
        '- cache: NodeCache(60s)', '',
        '+ getQuote(sym)', '+ getHistorical(sym, interval)', '+ searchStocks(q)'
    ])
    add_box(ax, 5.7, 0.5, 4.1, 2.8, 'PredictionProxy', [
        '- mlServiceURL: "http://localhost:8000"', '',
        '+ getPrediction(symbol, days)', '+ getHistory(symbol)',
        '+ getMockPrediction(symbol, days)'
    ])

    # ML Service classes
    add_box(ax, 10.7, 4.0, 2.5, 3.2, 'StockPredictor', [
        '- model: Keras Sequential', '- scaler: MinMaxScaler',
        '- seq_length: int = 60', '',
        '+ prepare_data(symbol)', '+ train(symbol, epochs)',
        '+ predict(symbol, days)', '+ load_model(symbol)', '+ save_model(symbol)'
    ])
    add_box(ax, 13.5, 4.5, 2.0, 2.2, 'Configuration', [
        'SEQ_LENGTH = 60', 'EPOCHS = 50', 'BATCH_SIZE = 32',
        'TRAIN_SPLIT = 0.8', 'PRED_DAYS = 30', 'PERIOD = "2y"'
    ])
    add_box(ax, 10.7, 0.5, 4.8, 2.2, 'MongoDB Collections', [
        'Users: {_id, name, email, password(bcrypt), role}',
        'Stocks: {symbol, price, change, volume, historicalData[]}',
        'Watchlists: {user(ObjectId ref), stocks[{symbol, addedAt}]}'
    ], color=STORE_COLOR, border='#7B4FA0')

    # Arrows between packages
    add_arrow(ax, 4.9, 5.5, 5.7, 5.5, 'HTTP / WS')
    add_arrow(ax, 9.8, 2.0, 10.7, 2.0, 'REST API')

    fig.tight_layout()
    fig.savefig(OUT + 'class_diagram.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('1. Class diagram done')


# ============================================================
# 2. USE-CASE DIAGRAM
# ============================================================
def usecase_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(10, 14))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Use-Case Diagram - StockAI Platform', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # System boundary
    ax.add_patch(FancyBboxPatch((2.5, 0.3), 5.5, 13.2, boxstyle="round,pad=0.15",
                                 facecolor='#FAFCFF', edgecolor='#4472C4', linewidth=2, linestyle='--'))
    ax.text(5.25, 13.3, 'StockAI Platform System Boundary', ha='center', fontsize=10, fontweight='bold', color='#4472C4')

    # Actors
    def draw_actor(ax, x, y, name):
        ax.plot(x, y+0.4, 'o', markersize=10, color='black')
        ax.plot([x, x], [y+0.15, y-0.3], 'k-', linewidth=1.5)
        ax.plot([x-0.25, x+0.25], [y, y], 'k-', linewidth=1.5)
        ax.plot([x, x-0.2], [y-0.3, y-0.6], 'k-', linewidth=1.5)
        ax.plot([x, x+0.2], [y-0.3, y-0.6], 'k-', linewidth=1.5)
        ax.text(x, y-0.8, name, ha='center', fontsize=8, fontweight='bold')

    draw_actor(ax, 1.2, 10, 'Guest\nUser')
    draw_actor(ax, 1.2, 4.5, 'Authenticated\nUser')
    draw_actor(ax, 9, 9, 'ML Service\n(FastAPI)')
    draw_actor(ax, 9, 2, 'System\nAdmin')

    # Use cases
    usecases_guest = [
        (5.25, 12.5, 'View Dashboard'),
        (5.25, 11.5, 'View Stock Detail'),
        (5.25, 10.5, 'Generate AI Prediction'),
        (5.25, 9.5, 'Browse Recommendations'),
        (5.25, 8.5, 'Read News'),
        (5.25, 7.5, 'Access Learning Center'),
    ]
    usecases_auth = [
        (5.25, 6.0, 'Manage Watchlist'),
        (5.25, 5.0, 'Execute Paper Trade'),
        (5.25, 4.0, 'View Transaction History'),
        (5.25, 3.0, 'View Portfolio P&L'),
    ]
    usecases_admin = [
        (5.25, 1.5, 'View Server Health'),
        (5.25, 0.7, 'Monitor API Stats'),
    ]

    for x, y, text in usecases_guest + usecases_auth + usecases_admin:
        e = mpatches.Ellipse((x, y), 3.5, 0.7, facecolor='#E8F0FE', edgecolor='#4472C4', linewidth=1)
        ax.add_patch(e)
        ax.text(x, y, text, ha='center', va='center', fontsize=7.5)

    # Connections - Guest
    for _, y, _ in usecases_guest:
        ax.plot([1.5, 3.5], [9.8, y], 'k-', linewidth=0.5, alpha=0.5)
    # Connections - Auth
    for _, y, _ in usecases_auth:
        ax.plot([1.5, 3.5], [4.3, y], 'k-', linewidth=0.5, alpha=0.5)
    # ML Service
    ax.plot([8.7, 7.0], [8.8, 10.5], 'k--', linewidth=0.7, alpha=0.5)
    ax.text(8.0, 9.8, '<<include>>', fontsize=5.5, style='italic', rotation=30)
    # Admin
    for _, y, _ in usecases_admin:
        ax.plot([8.7, 7.0], [1.8, y], 'k-', linewidth=0.5, alpha=0.5)

    fig.tight_layout()
    fig.savefig(OUT + 'usecase_diagram.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('2. Use-case diagram done')


# ============================================================
# 3. SEQUENCE DIAGRAM
# ============================================================
def sequence_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(16, 10))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Sequence Diagram - AI Prediction Request', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Lifelines
    actors = [('User', 1.5), ('React\nFrontend', 4), ('Express\nBackend', 7.5),
              ('FastAPI\nML Service', 11), ('Yahoo\nFinance', 14.5)]

    for name, x in actors:
        add_box(ax, x-0.7, 9.0, 1.4, 0.6, name.replace('\n', ' '), title_size=7)
        ax.plot([x, x], [9.0, 0.3], 'k--', linewidth=0.5, alpha=0.4)

    # Activation bars
    for x, y1, y2 in [(4, 1.2, 8.5), (7.5, 1.8, 7.5), (11, 2.5, 6.8)]:
        ax.add_patch(FancyBboxPatch((x-0.08, y1), 0.16, y2-y1, facecolor='#D0DFFF', edgecolor='#4472C4', linewidth=0.5))

    # Messages
    msgs = [
        (1.5, 4, 8.6, '1. Select symbol, click "Generate Prediction"'),
        (4, 7.5, 8.0, '2. POST /api/predict/GOOGL'),
        (7.5, 11, 7.4, '3. Proxy request to FastAPI /predict'),
        (11, 14.5, 6.8, '4. Fetch 2yr history (yfinance)'),
        (14.5, 11, 6.2, '5. Return OHLCV data'),
        (11, 11, 5.6, '6. Normalize data, generate sequences'),
        (11, 11, 5.0, '7. Train LSTM model (if no cache)'),
        (11, 11, 4.4, '8. Autoregressive prediction (N days)'),
        (11, 11, 3.8, '9. Calculate RMSE, MAE, R2, MAPE'),
        (11, 7.5, 3.2, '10. Return predictions + metrics JSON'),
        (7.5, 4, 2.6, '11. Relay response to frontend'),
        (4, 1.5, 2.0, '12. Render charts, metrics, price table'),
    ]

    for x1, x2, y, text in msgs:
        if x1 == x2:
            # Self message
            ax.add_patch(FancyBboxPatch((x1+0.1, y-0.12), 2.8, 0.25, facecolor='#F5F8FF', edgecolor='#888', linewidth=0.5))
            ax.text(x1+0.2, y, text, fontsize=5.5, va='center')
        else:
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle='->', color='black', lw=1))
            mx = min(x1, x2) + 0.15
            ax.text(mx, y+0.1, text, fontsize=5.5, va='bottom')

    fig.tight_layout()
    fig.savefig(OUT + 'sequence_diagram.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('3. Sequence diagram done')


# ============================================================
# 4. ACTIVITY DIAGRAM
# ============================================================
def activity_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(12, 16))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 16)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Activity Diagram - Prediction Flow', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Swimlanes
    for i, (name, color) in enumerate([('React Frontend', '#E8F0FE'), ('Express Backend', '#FFF2CC'), ('FastAPI ML Service', '#D5F5E3')]):
        x = i * 4
        ax.add_patch(plt.Rectangle((x, 0), 4, 15.5, facecolor=color, edgecolor='black', linewidth=1, alpha=0.3))
        ax.add_patch(plt.Rectangle((x, 15.0), 4, 0.5, facecolor=color, edgecolor='black', linewidth=1, alpha=0.8))
        ax.text(x+2, 15.25, name, ha='center', va='center', fontsize=9, fontweight='bold')

    def act_box(ax, x, y, text, w=3, h=0.6):
        ax.add_patch(FancyBboxPatch((x-w/2, y-h/2), w, h, boxstyle="round,pad=0.05",
                                     facecolor=BOX_COLOR, edgecolor=BOX_BORDER, linewidth=1))
        ax.text(x, y, text, ha='center', va='center', fontsize=7)

    def diamond(ax, x, y, text):
        s = 0.35
        pts = np.array([[x, y+s], [x+s*1.3, y], [x, y-s], [x-s*1.3, y], [x, y+s]])
        ax.plot(pts[:,0], pts[:,1], 'k-', linewidth=1)
        ax.fill(pts[:,0], pts[:,1], color='white')
        ax.text(x, y-s-0.15, text, ha='center', va='top', fontsize=6)

    def varrow(ax, x, y1, y2):
        ax.annotate('', xy=(x, y2), xytext=(x, y1), arrowprops=dict(arrowstyle='->', lw=1))
    def harrow(ax, x1, y, x2):
        ax.annotate('', xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle='->', lw=1))

    # Start
    ax.plot(2, 14.6, 'ko', markersize=12)

    # Frontend
    varrow(ax, 2, 14.4, 14.0)
    act_box(ax, 2, 13.7, 'User selects stock symbol')
    varrow(ax, 2, 13.4, 12.9)
    act_box(ax, 2, 12.6, 'Click "Generate Prediction"')
    varrow(ax, 2, 12.3, 11.8)
    act_box(ax, 2, 11.5, 'Show loading spinner')
    harrow(ax, 3.5, 11.5, 4.5)

    # Backend
    act_box(ax, 6, 11.5, 'Receive prediction request')
    varrow(ax, 6, 11.2, 10.6)
    diamond(ax, 6, 10.3, 'ML Service available?')
    ax.text(6.5, 10.3, 'Yes', fontsize=6, fontweight='bold')
    harrow(ax, 6.5, 10.3, 8.5)
    ax.text(6, 9.7, 'No', fontsize=6, fontweight='bold')
    varrow(ax, 6, 9.95, 9.3)
    act_box(ax, 6, 9.0, 'Generate mock predictions')

    # ML Service
    act_box(ax, 10, 10.3, 'Check model cache')
    varrow(ax, 10, 10.0, 9.4)
    diamond(ax, 10, 9.1, 'Cached?')
    ax.text(10.5, 9.1, 'No', fontsize=6, fontweight='bold')
    varrow(ax, 10, 8.75, 8.2)
    act_box(ax, 10, 7.9, 'Fetch yfinance data\nNormalize, train LSTM', h=0.8)
    varrow(ax, 10, 7.5, 6.9)
    act_box(ax, 10, 6.6, 'Generate autoregressive\npredictions (N days)', h=0.8)
    varrow(ax, 10, 6.2, 5.6)
    act_box(ax, 10, 5.3, 'Calculate metrics\n(RMSE, MAE, R2, MAPE)', h=0.8)
    varrow(ax, 10, 4.9, 4.3)
    act_box(ax, 10, 4.0, 'Return JSON response')

    # Response back
    harrow(ax, 8.5, 4.0, 7.5)
    act_box(ax, 6, 3.5, 'Relay to frontend')
    harrow(ax, 4.5, 3.5, 3.5)

    act_box(ax, 2, 2.8, 'Render Actual vs Predicted chart')
    varrow(ax, 2, 2.5, 1.9)
    act_box(ax, 2, 1.6, 'Display metrics & price table')

    # End
    varrow(ax, 2, 1.3, 0.7)
    ax.plot(2, 0.5, 'ko', markersize=12)
    ax.plot(2, 0.5, 'o', markersize=16, markeredgecolor='black', markerfacecolor='none', markeredgewidth=2)

    fig.tight_layout()
    fig.savefig(OUT + 'activity_diagram.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print('4. Activity diagram done')


# ============================================================
# 5. LEVEL 0 DFD
# ============================================================
def dfd_level0():
    fig, ax = plt.subplots(1, 1, figsize=(14, 7))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Level 0 DFD (Context Diagram)', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Central process
    e = mpatches.Ellipse((7, 3.5), 5, 2.5, facecolor='#DCE8F8', edgecolor='#4472C4', linewidth=2)
    ax.add_patch(e)
    ax.text(7, 3.7, '0.0', ha='center', fontsize=10, fontweight='bold')
    ax.text(7, 3.2, 'StockAI Platform', ha='center', fontsize=10)

    # Entities
    add_box(ax, 0.3, 2.5, 2.5, 1.5, 'Retail Investor', ['(End User)'], color=ENTITY_COLOR, border=ENTITY_BORDER)
    add_box(ax, 5.5, 5.8, 3, 0.8, 'Yahoo Finance API', color=ML_COLOR, border='#2E8B57', title_size=8)
    add_box(ax, 11.2, 2.5, 2.5, 1.5, 'MongoDB Database', ['(Persistence)'], color=STORE_COLOR, border='#7B4FA0')

    # Arrows
    add_arrow(ax, 2.8, 3.8, 4.5, 3.8, 'Queries, Credentials, Trades')
    add_arrow(ax, 4.5, 3.0, 2.8, 3.0, 'Predictions, Data, P&L')
    add_arrow(ax, 6.5, 5.8, 6.5, 4.75, 'API Requests')
    add_arrow(ax, 7.5, 4.75, 7.5, 5.8, 'OHLCV Data')
    add_arrow(ax, 9.5, 3.8, 11.2, 3.8, 'Store Users, Stocks, WL')
    add_arrow(ax, 11.2, 3.0, 9.5, 3.0, 'Retrieve Data')

    fig.tight_layout()
    fig.savefig(OUT + 'dfd_level0.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('5. Level 0 DFD done')


# ============================================================
# 6. LEVEL 1 DFD
# ============================================================
def dfd_level1():
    fig, ax = plt.subplots(1, 1, figsize=(15, 9))
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 9)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Level 1 DFD (Primary Sub-Systems)', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Entities
    add_box(ax, 0.2, 5, 2, 1.2, 'Retail Investor', color=ENTITY_COLOR, border=ENTITY_BORDER)
    add_box(ax, 0.2, 1, 2, 1.0, 'Yahoo Finance', color=ML_COLOR, border='#2E8B57')

    # Processes
    procs = [(4.5, 7.5, '1.0\nUser Auth'), (4.5, 5.5, '2.0\nStock Data Service'),
             (9, 7.5, '3.0\nAI Prediction'), (9, 5.5, '4.0\nWatchlist Mgmt'),
             (9, 3.5, '5.0\nPaper Trading'), (4.5, 3.5, '6.0\nWebSocket')]
    for x, y, text in procs:
        add_ellipse(ax, x, y, 2.8, 1.2, text, color=BOX_COLOR)

    # Data stores
    stores = [(13, 7.5, 'D1: Users'), (13, 5.8, 'D2: Stocks'),
              (13, 4.1, 'D3: Watchlists'), (13, 2.4, 'D4: Model Cache')]
    for x, y, text in stores:
        add_box(ax, x-1, y-0.35, 2.8, 0.7, text, color=STORE_COLOR, border='#7B4FA0', title_size=7)

    # Connections
    add_arrow(ax, 2.2, 5.8, 3.1, 7.3)
    add_arrow(ax, 2.2, 5.4, 3.1, 5.5)
    add_arrow(ax, 5.9, 7.5, 7.6, 7.5)
    add_arrow(ax, 5.9, 5.5, 7.6, 5.5)
    add_arrow(ax, 10.4, 7.5, 12, 7.5)
    add_arrow(ax, 10.4, 5.5, 12, 5.8)
    add_arrow(ax, 10.4, 3.5, 12, 4.1)
    add_arrow(ax, 9, 6.9, 9, 6.1)
    add_arrow(ax, 4.5, 4.9, 4.5, 4.1)
    add_arrow(ax, 2.2, 1.5, 3.1, 3.5)

    fig.tight_layout()
    fig.savefig(OUT + 'dfd_level1.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('6. Level 1 DFD done')


# ============================================================
# 7. LEVEL 2 DFD
# ============================================================
def dfd_level2():
    fig, ax = plt.subplots(1, 1, figsize=(14, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Level 2 DFD - Process 3.0: AI Prediction Engine', fontsize=TITLE_SIZE, fontweight='bold', pad=15)

    # Input/Output entities
    add_box(ax, 0.2, 5.0, 2.5, 1.0, 'From Backend', ['(Prediction Request)'], color=ENTITY_COLOR, border=ENTITY_BORDER)
    add_box(ax, 0.2, 1.5, 2.5, 1.0, 'To Backend', ['(Response JSON)'], color=ENTITY_COLOR, border=ENTITY_BORDER)

    # Sub-processes
    add_ellipse(ax, 5, 6.5, 2.8, 1.2, '3.1\nParse Request', color=BOX_COLOR)
    add_ellipse(ax, 5, 4.5, 2.8, 1.2, '3.2\nCheck Cache', color=BOX_COLOR)
    add_ellipse(ax, 9.5, 5.5, 2.8, 1.2, '3.3\nTrain LSTM', color=BOX_COLOR)
    add_ellipse(ax, 9.5, 3.0, 2.8, 1.2, '3.4\nGenerate\nPredictions', color=BOX_COLOR)
    add_ellipse(ax, 5, 2.0, 2.8, 1.2, '3.5\nCalculate Metrics', color=BOX_COLOR)

    # Data stores
    add_box(ax, 11.5, 6.5, 2.2, 0.8, 'D4: Models', ['.keras files'], color=STORE_COLOR, border='#7B4FA0')
    add_box(ax, 11.5, 4.5, 2.2, 0.8, 'D5: Scalers', ['.pkl files'], color=STORE_COLOR, border='#7B4FA0')

    # Yahoo Finance
    add_box(ax, 12, 2.0, 1.8, 0.8, 'Yahoo\nFinance', color=ML_COLOR, border='#2E8B57', title_size=7)

    # Arrows
    add_arrow(ax, 2.7, 5.5, 3.6, 6.3, 'Symbol + Days')
    add_arrow(ax, 5, 5.9, 5, 5.1, 'Parsed Request')
    add_arrow(ax, 6.4, 4.5, 8.1, 5.3, 'Cache Miss')
    add_arrow(ax, 10.9, 5.5, 11.5, 6.5)
    add_arrow(ax, 10.9, 5.2, 11.5, 4.9)
    add_arrow(ax, 9.5, 4.9, 9.5, 3.6, 'Trained Model')
    add_arrow(ax, 8.1, 3.0, 6.4, 2.2, 'Predictions[]')
    add_arrow(ax, 3.6, 2.0, 2.7, 2.0, 'JSON Response')
    add_arrow(ax, 12, 2.8, 10.5, 3.5, 'OHLCV Data')

    fig.tight_layout()
    fig.savefig(OUT + 'dfd_level2.png', dpi=180, bbox_inches='tight', facecolor='white')
    plt.close()
    print('7. Level 2 DFD done')


if __name__ == '__main__':
    class_diagram()
    usecase_diagram()
    sequence_diagram()
    activity_diagram()
    dfd_level0()
    dfd_level1()
    dfd_level2()
    print(f'\nAll 7 diagrams saved to {OUT}')
