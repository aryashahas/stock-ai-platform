const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

/**
 * Mock stock data with realistic base prices and company information.
 */
const MOCK_STOCKS = {
  // ═══════════════════════════════════════════════
  // TECHNOLOGY
  // ═══════════════════════════════════════════════
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175.0, marketCap: 2750000000000, sector: 'Technology' },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140.0, marketCap: 1750000000000, sector: 'Technology' },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 375.0, marketCap: 2800000000000, sector: 'Technology' },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 185.0, marketCap: 1900000000000, sector: 'Consumer Cyclical' },
  META: { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 350.0, marketCap: 900000000000, sector: 'Technology' },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 500.0, marketCap: 1230000000000, sector: 'Technology' },
  NFLX: { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 480.0, marketCap: 210000000000, sector: 'Communication Services' },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 240.0, marketCap: 760000000000, sector: 'Automotive' },
  AMD: { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', basePrice: 155.0, marketCap: 250000000000, sector: 'Technology' },
  INTC: { symbol: 'INTC', name: 'Intel Corporation', basePrice: 42.0, marketCap: 178000000000, sector: 'Technology' },
  CRM: { symbol: 'CRM', name: 'Salesforce Inc.', basePrice: 265.0, marketCap: 257000000000, sector: 'Technology' },
  ORCL: { symbol: 'ORCL', name: 'Oracle Corporation', basePrice: 125.0, marketCap: 340000000000, sector: 'Technology' },
  ADBE: { symbol: 'ADBE', name: 'Adobe Inc.', basePrice: 540.0, marketCap: 245000000000, sector: 'Technology' },
  CSCO: { symbol: 'CSCO', name: 'Cisco Systems Inc.', basePrice: 52.0, marketCap: 213000000000, sector: 'Technology' },
  AVGO: { symbol: 'AVGO', name: 'Broadcom Inc.', basePrice: 920.0, marketCap: 430000000000, sector: 'Technology' },
  QCOM: { symbol: 'QCOM', name: 'Qualcomm Inc.', basePrice: 155.0, marketCap: 173000000000, sector: 'Technology' },
  TXN: { symbol: 'TXN', name: 'Texas Instruments Inc.', basePrice: 172.0, marketCap: 157000000000, sector: 'Technology' },
  NOW: { symbol: 'NOW', name: 'ServiceNow Inc.', basePrice: 700.0, marketCap: 144000000000, sector: 'Technology' },
  IBM: { symbol: 'IBM', name: 'International Business Machines', basePrice: 168.0, marketCap: 153000000000, sector: 'Technology' },
  SHOP: { symbol: 'SHOP', name: 'Shopify Inc.', basePrice: 68.0, marketCap: 88000000000, sector: 'Technology' },
  SQ: { symbol: 'SQ', name: 'Block Inc.', basePrice: 72.0, marketCap: 43000000000, sector: 'Technology' },
  SNAP: { symbol: 'SNAP', name: 'Snap Inc.', basePrice: 14.0, marketCap: 23000000000, sector: 'Technology' },
  UBER: { symbol: 'UBER', name: 'Uber Technologies Inc.', basePrice: 62.0, marketCap: 128000000000, sector: 'Technology' },
  LYFT: { symbol: 'LYFT', name: 'Lyft Inc.', basePrice: 16.0, marketCap: 6200000000, sector: 'Technology' },
  PLTR: { symbol: 'PLTR', name: 'Palantir Technologies Inc.', basePrice: 22.0, marketCap: 48000000000, sector: 'Technology' },
  NET: { symbol: 'NET', name: 'Cloudflare Inc.', basePrice: 78.0, marketCap: 26000000000, sector: 'Technology' },
  CRWD: { symbol: 'CRWD', name: 'CrowdStrike Holdings Inc.', basePrice: 195.0, marketCap: 47000000000, sector: 'Technology' },
  ZS: { symbol: 'ZS', name: 'Zscaler Inc.', basePrice: 195.0, marketCap: 28000000000, sector: 'Technology' },
  PANW: { symbol: 'PANW', name: 'Palo Alto Networks Inc.', basePrice: 290.0, marketCap: 94000000000, sector: 'Technology' },
  SNOW: { symbol: 'SNOW', name: 'Snowflake Inc.', basePrice: 170.0, marketCap: 55000000000, sector: 'Technology' },
  DDOG: { symbol: 'DDOG', name: 'Datadog Inc.', basePrice: 110.0, marketCap: 36000000000, sector: 'Technology' },
  MDB: { symbol: 'MDB', name: 'MongoDB Inc.', basePrice: 400.0, marketCap: 29000000000, sector: 'Technology' },
  TWLO: { symbol: 'TWLO', name: 'Twilio Inc.', basePrice: 65.0, marketCap: 12000000000, sector: 'Technology' },
  ZM: { symbol: 'ZM', name: 'Zoom Video Communications', basePrice: 70.0, marketCap: 21000000000, sector: 'Technology' },
  DOCU: { symbol: 'DOCU', name: 'DocuSign Inc.', basePrice: 55.0, marketCap: 11000000000, sector: 'Technology' },
  AMAT: { symbol: 'AMAT', name: 'Applied Materials Inc.', basePrice: 160.0, marketCap: 132000000000, sector: 'Technology' },
  LRCX: { symbol: 'LRCX', name: 'Lam Research Corporation', basePrice: 720.0, marketCap: 95000000000, sector: 'Technology' },
  KLAC: { symbol: 'KLAC', name: 'KLA Corporation', basePrice: 530.0, marketCap: 72000000000, sector: 'Technology' },
  MRVL: { symbol: 'MRVL', name: 'Marvell Technology Inc.', basePrice: 60.0, marketCap: 52000000000, sector: 'Technology' },
  MU: { symbol: 'MU', name: 'Micron Technology Inc.', basePrice: 80.0, marketCap: 88000000000, sector: 'Technology' },
  HPQ: { symbol: 'HPQ', name: 'HP Inc.', basePrice: 30.0, marketCap: 30000000000, sector: 'Technology' },
  DELL: { symbol: 'DELL', name: 'Dell Technologies Inc.', basePrice: 78.0, marketCap: 56000000000, sector: 'Technology' },

  // ═══════════════════════════════════════════════
  // FINANCE & BANKING
  // ═══════════════════════════════════════════════
  JPM: { symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 195.0, marketCap: 570000000000, sector: 'Financial Services' },
  BAC: { symbol: 'BAC', name: 'Bank of America Corporation', basePrice: 35.0, marketCap: 277000000000, sector: 'Financial Services' },
  WFC: { symbol: 'WFC', name: 'Wells Fargo & Company', basePrice: 48.0, marketCap: 178000000000, sector: 'Financial Services' },
  GS: { symbol: 'GS', name: 'Goldman Sachs Group Inc.', basePrice: 420.0, marketCap: 140000000000, sector: 'Financial Services' },
  MS: { symbol: 'MS', name: 'Morgan Stanley', basePrice: 95.0, marketCap: 155000000000, sector: 'Financial Services' },
  C: { symbol: 'C', name: 'Citigroup Inc.', basePrice: 52.0, marketCap: 100000000000, sector: 'Financial Services' },
  V: { symbol: 'V', name: 'Visa Inc.', basePrice: 280.0, marketCap: 570000000000, sector: 'Financial Services' },
  MA: { symbol: 'MA', name: 'Mastercard Inc.', basePrice: 420.0, marketCap: 395000000000, sector: 'Financial Services' },
  PYPL: { symbol: 'PYPL', name: 'PayPal Holdings Inc.', basePrice: 65.0, marketCap: 70000000000, sector: 'Financial Services' },
  AXP: { symbol: 'AXP', name: 'American Express Company', basePrice: 185.0, marketCap: 138000000000, sector: 'Financial Services' },
  SCHW: { symbol: 'SCHW', name: 'Charles Schwab Corporation', basePrice: 68.0, marketCap: 125000000000, sector: 'Financial Services' },
  BLK: { symbol: 'BLK', name: 'BlackRock Inc.', basePrice: 780.0, marketCap: 117000000000, sector: 'Financial Services' },
  SPGI: { symbol: 'SPGI', name: 'S&P Global Inc.', basePrice: 440.0, marketCap: 138000000000, sector: 'Financial Services' },
  COF: { symbol: 'COF', name: 'Capital One Financial', basePrice: 130.0, marketCap: 50000000000, sector: 'Financial Services' },
  USB: { symbol: 'USB', name: 'U.S. Bancorp', basePrice: 42.0, marketCap: 66000000000, sector: 'Financial Services' },
  PNC: { symbol: 'PNC', name: 'PNC Financial Services', basePrice: 155.0, marketCap: 62000000000, sector: 'Financial Services' },
  COIN: { symbol: 'COIN', name: 'Coinbase Global Inc.', basePrice: 155.0, marketCap: 37000000000, sector: 'Financial Services' },
  HOOD: { symbol: 'HOOD', name: 'Robinhood Markets Inc.', basePrice: 12.0, marketCap: 11000000000, sector: 'Financial Services' },

  // ═══════════════════════════════════════════════
  // HEALTHCARE & PHARMA
  // ═══════════════════════════════════════════════
  JNJ: { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 160.0, marketCap: 385000000000, sector: 'Healthcare' },
  UNH: { symbol: 'UNH', name: 'UnitedHealth Group Inc.', basePrice: 530.0, marketCap: 490000000000, sector: 'Healthcare' },
  PFE: { symbol: 'PFE', name: 'Pfizer Inc.', basePrice: 28.0, marketCap: 158000000000, sector: 'Healthcare' },
  ABBV: { symbol: 'ABBV', name: 'AbbVie Inc.', basePrice: 155.0, marketCap: 274000000000, sector: 'Healthcare' },
  MRK: { symbol: 'MRK', name: 'Merck & Co. Inc.', basePrice: 110.0, marketCap: 278000000000, sector: 'Healthcare' },
  LLY: { symbol: 'LLY', name: 'Eli Lilly and Company', basePrice: 590.0, marketCap: 560000000000, sector: 'Healthcare' },
  TMO: { symbol: 'TMO', name: 'Thermo Fisher Scientific', basePrice: 540.0, marketCap: 210000000000, sector: 'Healthcare' },
  ABT: { symbol: 'ABT', name: 'Abbott Laboratories', basePrice: 108.0, marketCap: 188000000000, sector: 'Healthcare' },
  BMY: { symbol: 'BMY', name: 'Bristol-Myers Squibb', basePrice: 52.0, marketCap: 106000000000, sector: 'Healthcare' },
  AMGN: { symbol: 'AMGN', name: 'Amgen Inc.', basePrice: 285.0, marketCap: 152000000000, sector: 'Healthcare' },
  GILD: { symbol: 'GILD', name: 'Gilead Sciences Inc.', basePrice: 82.0, marketCap: 102000000000, sector: 'Healthcare' },
  MDT: { symbol: 'MDT', name: 'Medtronic PLC', basePrice: 82.0, marketCap: 109000000000, sector: 'Healthcare' },
  CVS: { symbol: 'CVS', name: 'CVS Health Corporation', basePrice: 72.0, marketCap: 93000000000, sector: 'Healthcare' },
  MRNA: { symbol: 'MRNA', name: 'Moderna Inc.', basePrice: 105.0, marketCap: 40000000000, sector: 'Healthcare' },
  BIIB: { symbol: 'BIIB', name: 'Biogen Inc.', basePrice: 250.0, marketCap: 36000000000, sector: 'Healthcare' },
  REGN: { symbol: 'REGN', name: 'Regeneron Pharmaceuticals', basePrice: 850.0, marketCap: 95000000000, sector: 'Healthcare' },
  VRTX: { symbol: 'VRTX', name: 'Vertex Pharmaceuticals', basePrice: 390.0, marketCap: 100000000000, sector: 'Healthcare' },
  ZTS: { symbol: 'ZTS', name: 'Zoetis Inc.', basePrice: 180.0, marketCap: 82000000000, sector: 'Healthcare' },

  // ═══════════════════════════════════════════════
  // ENERGY
  // ═══════════════════════════════════════════════
  XOM: { symbol: 'XOM', name: 'Exxon Mobil Corporation', basePrice: 108.0, marketCap: 450000000000, sector: 'Energy' },
  CVX: { symbol: 'CVX', name: 'Chevron Corporation', basePrice: 160.0, marketCap: 305000000000, sector: 'Energy' },
  COP: { symbol: 'COP', name: 'ConocoPhillips', basePrice: 118.0, marketCap: 140000000000, sector: 'Energy' },
  SLB: { symbol: 'SLB', name: 'Schlumberger Limited', basePrice: 52.0, marketCap: 74000000000, sector: 'Energy' },
  EOG: { symbol: 'EOG', name: 'EOG Resources Inc.', basePrice: 125.0, marketCap: 73000000000, sector: 'Energy' },
  MPC: { symbol: 'MPC', name: 'Marathon Petroleum Corp.', basePrice: 155.0, marketCap: 62000000000, sector: 'Energy' },
  PSX: { symbol: 'PSX', name: 'Phillips 66', basePrice: 120.0, marketCap: 52000000000, sector: 'Energy' },
  VLO: { symbol: 'VLO', name: 'Valero Energy Corporation', basePrice: 140.0, marketCap: 48000000000, sector: 'Energy' },
  OXY: { symbol: 'OXY', name: 'Occidental Petroleum', basePrice: 62.0, marketCap: 55000000000, sector: 'Energy' },
  HAL: { symbol: 'HAL', name: 'Halliburton Company', basePrice: 38.0, marketCap: 34000000000, sector: 'Energy' },
  ENPH: { symbol: 'ENPH', name: 'Enphase Energy Inc.', basePrice: 130.0, marketCap: 18000000000, sector: 'Energy' },
  FSLR: { symbol: 'FSLR', name: 'First Solar Inc.', basePrice: 185.0, marketCap: 20000000000, sector: 'Energy' },
  NEE: { symbol: 'NEE', name: 'NextEra Energy Inc.', basePrice: 72.0, marketCap: 148000000000, sector: 'Utilities' },
  DUK: { symbol: 'DUK', name: 'Duke Energy Corporation', basePrice: 98.0, marketCap: 76000000000, sector: 'Utilities' },
  SO: { symbol: 'SO', name: 'Southern Company', basePrice: 72.0, marketCap: 78000000000, sector: 'Utilities' },

  // ═══════════════════════════════════════════════
  // CONSUMER / RETAIL
  // ═══════════════════════════════════════════════
  WMT: { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 165.0, marketCap: 445000000000, sector: 'Consumer Defensive' },
  COST: { symbol: 'COST', name: 'Costco Wholesale Corp.', basePrice: 575.0, marketCap: 255000000000, sector: 'Consumer Defensive' },
  HD: { symbol: 'HD', name: 'The Home Depot Inc.', basePrice: 340.0, marketCap: 340000000000, sector: 'Consumer Cyclical' },
  LOW: { symbol: 'LOW', name: "Lowe's Companies Inc.", basePrice: 230.0, marketCap: 135000000000, sector: 'Consumer Cyclical' },
  TGT: { symbol: 'TGT', name: 'Target Corporation', basePrice: 135.0, marketCap: 62000000000, sector: 'Consumer Defensive' },
  NKE: { symbol: 'NKE', name: 'NIKE Inc.', basePrice: 105.0, marketCap: 160000000000, sector: 'Consumer Cyclical' },
  SBUX: { symbol: 'SBUX', name: 'Starbucks Corporation', basePrice: 100.0, marketCap: 115000000000, sector: 'Consumer Cyclical' },
  MCD: { symbol: 'MCD', name: "McDonald's Corporation", basePrice: 290.0, marketCap: 210000000000, sector: 'Consumer Cyclical' },
  KO: { symbol: 'KO', name: 'Coca-Cola Company', basePrice: 60.0, marketCap: 260000000000, sector: 'Consumer Defensive' },
  PEP: { symbol: 'PEP', name: 'PepsiCo Inc.', basePrice: 178.0, marketCap: 245000000000, sector: 'Consumer Defensive' },
  PG: { symbol: 'PG', name: 'Procter & Gamble Co.', basePrice: 155.0, marketCap: 365000000000, sector: 'Consumer Defensive' },
  CL: { symbol: 'CL', name: 'Colgate-Palmolive Company', basePrice: 78.0, marketCap: 65000000000, sector: 'Consumer Defensive' },
  EL: { symbol: 'EL', name: 'Estee Lauder Companies', basePrice: 155.0, marketCap: 56000000000, sector: 'Consumer Defensive' },
  LULU: { symbol: 'LULU', name: 'Lululemon Athletica Inc.', basePrice: 420.0, marketCap: 52000000000, sector: 'Consumer Cyclical' },
  ETSY: { symbol: 'ETSY', name: 'Etsy Inc.', basePrice: 78.0, marketCap: 9800000000, sector: 'Consumer Cyclical' },
  BABA: { symbol: 'BABA', name: 'Alibaba Group Holdings', basePrice: 82.0, marketCap: 210000000000, sector: 'Consumer Cyclical' },
  JD: { symbol: 'JD', name: 'JD.com Inc.', basePrice: 28.0, marketCap: 42000000000, sector: 'Consumer Cyclical' },
  EBAY: { symbol: 'EBAY', name: 'eBay Inc.', basePrice: 45.0, marketCap: 24000000000, sector: 'Consumer Cyclical' },
  DG: { symbol: 'DG', name: 'Dollar General Corporation', basePrice: 135.0, marketCap: 30000000000, sector: 'Consumer Defensive' },
  DLTR: { symbol: 'DLTR', name: 'Dollar Tree Inc.', basePrice: 140.0, marketCap: 30000000000, sector: 'Consumer Defensive' },
  YUM: { symbol: 'YUM', name: 'Yum! Brands Inc.', basePrice: 135.0, marketCap: 38000000000, sector: 'Consumer Cyclical' },
  CMG: { symbol: 'CMG', name: 'Chipotle Mexican Grill', basePrice: 2200.0, marketCap: 60000000000, sector: 'Consumer Cyclical' },
  ABNB: { symbol: 'ABNB', name: 'Airbnb Inc.', basePrice: 145.0, marketCap: 92000000000, sector: 'Consumer Cyclical' },

  // ═══════════════════════════════════════════════
  // INDUSTRIALS & AEROSPACE
  // ═══════════════════════════════════════════════
  BA: { symbol: 'BA', name: 'Boeing Company', basePrice: 210.0, marketCap: 128000000000, sector: 'Industrials' },
  CAT: { symbol: 'CAT', name: 'Caterpillar Inc.', basePrice: 285.0, marketCap: 146000000000, sector: 'Industrials' },
  GE: { symbol: 'GE', name: 'General Electric Company', basePrice: 120.0, marketCap: 130000000000, sector: 'Industrials' },
  HON: { symbol: 'HON', name: 'Honeywell International', basePrice: 200.0, marketCap: 133000000000, sector: 'Industrials' },
  RTX: { symbol: 'RTX', name: 'RTX Corporation', basePrice: 90.0, marketCap: 130000000000, sector: 'Industrials' },
  LMT: { symbol: 'LMT', name: 'Lockheed Martin Corporation', basePrice: 460.0, marketCap: 115000000000, sector: 'Industrials' },
  NOC: { symbol: 'NOC', name: 'Northrop Grumman Corp.', basePrice: 470.0, marketCap: 72000000000, sector: 'Industrials' },
  GD: { symbol: 'GD', name: 'General Dynamics Corp.', basePrice: 250.0, marketCap: 68000000000, sector: 'Industrials' },
  DE: { symbol: 'DE', name: 'Deere & Company', basePrice: 400.0, marketCap: 118000000000, sector: 'Industrials' },
  UPS: { symbol: 'UPS', name: 'United Parcel Service Inc.', basePrice: 155.0, marketCap: 133000000000, sector: 'Industrials' },
  FDX: { symbol: 'FDX', name: 'FedEx Corporation', basePrice: 265.0, marketCap: 66000000000, sector: 'Industrials' },
  MMM: { symbol: 'MMM', name: '3M Company', basePrice: 105.0, marketCap: 58000000000, sector: 'Industrials' },
  EMR: { symbol: 'EMR', name: 'Emerson Electric Co.', basePrice: 100.0, marketCap: 59000000000, sector: 'Industrials' },

  // ═══════════════════════════════════════════════
  // COMMUNICATION & ENTERTAINMENT
  // ═══════════════════════════════════════════════
  DIS: { symbol: 'DIS', name: 'The Walt Disney Company', basePrice: 92.0, marketCap: 168000000000, sector: 'Communication Services' },
  CMCSA: { symbol: 'CMCSA', name: 'Comcast Corporation', basePrice: 44.0, marketCap: 178000000000, sector: 'Communication Services' },
  T: { symbol: 'T', name: 'AT&T Inc.', basePrice: 17.0, marketCap: 121000000000, sector: 'Communication Services' },
  VZ: { symbol: 'VZ', name: 'Verizon Communications', basePrice: 36.0, marketCap: 152000000000, sector: 'Communication Services' },
  TMUS: { symbol: 'TMUS', name: 'T-Mobile US Inc.', basePrice: 145.0, marketCap: 170000000000, sector: 'Communication Services' },
  SPOT: { symbol: 'SPOT', name: 'Spotify Technology S.A.', basePrice: 180.0, marketCap: 35000000000, sector: 'Communication Services' },
  ROKU: { symbol: 'ROKU', name: 'Roku Inc.', basePrice: 85.0, marketCap: 12000000000, sector: 'Communication Services' },
  WBD: { symbol: 'WBD', name: 'Warner Bros. Discovery', basePrice: 11.0, marketCap: 27000000000, sector: 'Communication Services' },
  PARA: { symbol: 'PARA', name: 'Paramount Global', basePrice: 15.0, marketCap: 10000000000, sector: 'Communication Services' },
  EA: { symbol: 'EA', name: 'Electronic Arts Inc.', basePrice: 135.0, marketCap: 37000000000, sector: 'Communication Services' },
  TTWO: { symbol: 'TTWO', name: 'Take-Two Interactive', basePrice: 155.0, marketCap: 27000000000, sector: 'Communication Services' },
  RBLX: { symbol: 'RBLX', name: 'Roblox Corporation', basePrice: 42.0, marketCap: 25000000000, sector: 'Communication Services' },
  PINS: { symbol: 'PINS', name: 'Pinterest Inc.', basePrice: 30.0, marketCap: 20000000000, sector: 'Communication Services' },

  // ═══════════════════════════════════════════════
  // REAL ESTATE
  // ═══════════════════════════════════════════════
  AMT: { symbol: 'AMT', name: 'American Tower Corp.', basePrice: 195.0, marketCap: 90000000000, sector: 'Real Estate' },
  PLD: { symbol: 'PLD', name: 'Prologis Inc.', basePrice: 125.0, marketCap: 116000000000, sector: 'Real Estate' },
  CCI: { symbol: 'CCI', name: 'Crown Castle Inc.', basePrice: 110.0, marketCap: 48000000000, sector: 'Real Estate' },
  SPG: { symbol: 'SPG', name: 'Simon Property Group', basePrice: 120.0, marketCap: 44000000000, sector: 'Real Estate' },
  O: { symbol: 'O', name: 'Realty Income Corporation', basePrice: 55.0, marketCap: 41000000000, sector: 'Real Estate' },

  // ═══════════════════════════════════════════════
  // MATERIALS & MINING
  // ═══════════════════════════════════════════════
  LIN: { symbol: 'LIN', name: 'Linde PLC', basePrice: 400.0, marketCap: 195000000000, sector: 'Materials' },
  APD: { symbol: 'APD', name: 'Air Products & Chemicals', basePrice: 290.0, marketCap: 64000000000, sector: 'Materials' },
  SHW: { symbol: 'SHW', name: 'Sherwin-Williams Co.', basePrice: 270.0, marketCap: 70000000000, sector: 'Materials' },
  FCX: { symbol: 'FCX', name: 'Freeport-McMoRan Inc.', basePrice: 42.0, marketCap: 60000000000, sector: 'Materials' },
  NEM: { symbol: 'NEM', name: 'Newmont Corporation', basePrice: 42.0, marketCap: 33000000000, sector: 'Materials' },
  GOLD: { symbol: 'GOLD', name: 'Barrick Gold Corporation', basePrice: 18.0, marketCap: 32000000000, sector: 'Materials' },

  // ═══════════════════════════════════════════════
  // POPULAR ETFs (traded like stocks)
  // ═══════════════════════════════════════════════
  SPY: { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', basePrice: 450.0, marketCap: 430000000000, sector: 'ETF' },
  QQQ: { symbol: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 380.0, marketCap: 200000000000, sector: 'ETF' },
  IWM: { symbol: 'IWM', name: 'iShares Russell 2000 ETF', basePrice: 195.0, marketCap: 58000000000, sector: 'ETF' },
  DIA: { symbol: 'DIA', name: 'SPDR Dow Jones Industrial ETF', basePrice: 350.0, marketCap: 32000000000, sector: 'ETF' },
  VTI: { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', basePrice: 230.0, marketCap: 340000000000, sector: 'ETF' },
  VOO: { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', basePrice: 415.0, marketCap: 380000000000, sector: 'ETF' },
  ARKK: { symbol: 'ARKK', name: 'ARK Innovation ETF', basePrice: 45.0, marketCap: 8000000000, sector: 'ETF' },

  // ═══════════════════════════════════════════════
  // INDIAN MARKET (NSE/BSE - via US ADRs & symbols)
  // ═══════════════════════════════════════════════
  INFY: { symbol: 'INFY', name: 'Infosys Limited', basePrice: 18.0, marketCap: 75000000000, sector: 'Technology' },
  WIT: { symbol: 'WIT', name: 'Wipro Limited', basePrice: 5.0, marketCap: 27000000000, sector: 'Technology' },
  HDB: { symbol: 'HDB', name: 'HDFC Bank Limited', basePrice: 62.0, marketCap: 155000000000, sector: 'Financial Services' },
  IBN: { symbol: 'IBN', name: 'ICICI Bank Limited', basePrice: 25.0, marketCap: 88000000000, sector: 'Financial Services' },
  SIFY: { symbol: 'SIFY', name: 'Sify Technologies Limited', basePrice: 2.0, marketCap: 500000000, sector: 'Technology' },
  TTM: { symbol: 'TTM', name: 'Tata Motors Limited', basePrice: 28.0, marketCap: 38000000000, sector: 'Automotive' },
  RDY: { symbol: 'RDY', name: "Dr. Reddy's Laboratories", basePrice: 68.0, marketCap: 11000000000, sector: 'Healthcare' },

  // ═══════════════════════════════════════════════
  // AUTOMOTIVE
  // ═══════════════════════════════════════════════
  F: { symbol: 'F', name: 'Ford Motor Company', basePrice: 12.0, marketCap: 48000000000, sector: 'Automotive' },
  GM: { symbol: 'GM', name: 'General Motors Company', basePrice: 38.0, marketCap: 52000000000, sector: 'Automotive' },
  RIVN: { symbol: 'RIVN', name: 'Rivian Automotive Inc.', basePrice: 18.0, marketCap: 17000000000, sector: 'Automotive' },
  LCID: { symbol: 'LCID', name: 'Lucid Group Inc.', basePrice: 5.0, marketCap: 12000000000, sector: 'Automotive' },
  NIO: { symbol: 'NIO', name: 'NIO Inc.', basePrice: 8.0, marketCap: 14000000000, sector: 'Automotive' },
  XPEV: { symbol: 'XPEV', name: 'XPeng Inc.', basePrice: 15.0, marketCap: 13000000000, sector: 'Automotive' },
  LI: { symbol: 'LI', name: 'Li Auto Inc.', basePrice: 35.0, marketCap: 37000000000, sector: 'Automotive' },
  RACE: { symbol: 'RACE', name: 'Ferrari N.V.', basePrice: 340.0, marketCap: 62000000000, sector: 'Automotive' },
  TM: { symbol: 'TM', name: 'Toyota Motor Corporation', basePrice: 185.0, marketCap: 250000000000, sector: 'Automotive' },

  // ═══════════════════════════════════════════════
  // FOOD & BEVERAGE
  // ═══════════════════════════════════════════════
  MDLZ: { symbol: 'MDLZ', name: 'Mondelez International', basePrice: 72.0, marketCap: 98000000000, sector: 'Consumer Defensive' },
  KHC: { symbol: 'KHC', name: 'Kraft Heinz Company', basePrice: 36.0, marketCap: 44000000000, sector: 'Consumer Defensive' },
  GIS: { symbol: 'GIS', name: 'General Mills Inc.', basePrice: 68.0, marketCap: 40000000000, sector: 'Consumer Defensive' },
  K: { symbol: 'K', name: "Kellanova", basePrice: 58.0, marketCap: 20000000000, sector: 'Consumer Defensive' },
  HSY: { symbol: 'HSY', name: 'Hershey Company', basePrice: 210.0, marketCap: 43000000000, sector: 'Consumer Defensive' },
  STZ: { symbol: 'STZ', name: 'Constellation Brands Inc.', basePrice: 250.0, marketCap: 46000000000, sector: 'Consumer Defensive' },
  BUD: { symbol: 'BUD', name: 'Anheuser-Busch InBev', basePrice: 58.0, marketCap: 115000000000, sector: 'Consumer Defensive' },

  // ═══════════════════════════════════════════════
  // TRAVEL & LEISURE
  // ═══════════════════════════════════════════════
  MAR: { symbol: 'MAR', name: 'Marriott International', basePrice: 210.0, marketCap: 62000000000, sector: 'Consumer Cyclical' },
  HLT: { symbol: 'HLT', name: 'Hilton Worldwide Holdings', basePrice: 175.0, marketCap: 46000000000, sector: 'Consumer Cyclical' },
  BKNG: { symbol: 'BKNG', name: 'Booking Holdings Inc.', basePrice: 3200.0, marketCap: 118000000000, sector: 'Consumer Cyclical' },
  EXPE: { symbol: 'EXPE', name: 'Expedia Group Inc.', basePrice: 125.0, marketCap: 18000000000, sector: 'Consumer Cyclical' },
  RCL: { symbol: 'RCL', name: 'Royal Caribbean Cruises', basePrice: 120.0, marketCap: 31000000000, sector: 'Consumer Cyclical' },
  CCL: { symbol: 'CCL', name: 'Carnival Corporation', basePrice: 16.0, marketCap: 20000000000, sector: 'Consumer Cyclical' },
  DAL: { symbol: 'DAL', name: 'Delta Air Lines Inc.', basePrice: 42.0, marketCap: 27000000000, sector: 'Industrials' },
  UAL: { symbol: 'UAL', name: 'United Airlines Holdings', basePrice: 48.0, marketCap: 16000000000, sector: 'Industrials' },
  AAL: { symbol: 'AAL', name: 'American Airlines Group', basePrice: 14.0, marketCap: 9200000000, sector: 'Industrials' },
  LUV: { symbol: 'LUV', name: 'Southwest Airlines Co.', basePrice: 30.0, marketCap: 18000000000, sector: 'Industrials' },

  // ═══════════════════════════════════════════════
  // INSURANCE
  // ═══════════════════════════════════════════════
  BRK_B: { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', basePrice: 365.0, marketCap: 790000000000, sector: 'Financial Services' },
  ALL: { symbol: 'ALL', name: 'Allstate Corporation', basePrice: 140.0, marketCap: 38000000000, sector: 'Financial Services' },
  MET: { symbol: 'MET', name: 'MetLife Inc.', basePrice: 68.0, marketCap: 52000000000, sector: 'Financial Services' },
  PRU: { symbol: 'PRU', name: 'Prudential Financial Inc.', basePrice: 100.0, marketCap: 37000000000, sector: 'Financial Services' },
  AIG: { symbol: 'AIG', name: 'American International Group', basePrice: 65.0, marketCap: 46000000000, sector: 'Financial Services' },

  // ═══════════════════════════════════════════════
  // MISCELLANEOUS / OTHER
  // ═══════════════════════════════════════════════
  SOFI: { symbol: 'SOFI', name: 'SoFi Technologies Inc.', basePrice: 9.0, marketCap: 8500000000, sector: 'Financial Services' },
  AFRM: { symbol: 'AFRM', name: 'Affirm Holdings Inc.', basePrice: 28.0, marketCap: 8700000000, sector: 'Technology' },
  U: { symbol: 'U', name: 'Unity Software Inc.', basePrice: 35.0, marketCap: 13000000000, sector: 'Technology' },
  PATH: { symbol: 'PATH', name: 'UiPath Inc.', basePrice: 18.0, marketCap: 10000000000, sector: 'Technology' },
  AI: { symbol: 'AI', name: 'C3.ai Inc.', basePrice: 28.0, marketCap: 3200000000, sector: 'Technology' },
  IONQ: { symbol: 'IONQ', name: 'IonQ Inc.', basePrice: 15.0, marketCap: 3200000000, sector: 'Technology' },
  SMCI: { symbol: 'SMCI', name: 'Super Micro Computer Inc.', basePrice: 300.0, marketCap: 16000000000, sector: 'Technology' },
  ARM: { symbol: 'ARM', name: 'Arm Holdings PLC', basePrice: 65.0, marketCap: 68000000000, sector: 'Technology' },
  MELI: { symbol: 'MELI', name: 'MercadoLibre Inc.', basePrice: 1450.0, marketCap: 73000000000, sector: 'Consumer Cyclical' },
  SE: { symbol: 'SE', name: 'Sea Limited', basePrice: 45.0, marketCap: 26000000000, sector: 'Consumer Cyclical' },
};

/**
 * Validate whether a stock symbol exists.
 * Checks Alpha Vantage API first, then falls back to known mock stocks.
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<{valid: boolean, name: string|null}>}
 */
const validateSymbol = async (symbol) => {
  const upperSymbol = symbol.toUpperCase();

  // Check known stocks first
  if (MOCK_STOCKS[upperSymbol]) {
    return { valid: true, name: MOCK_STOCKS[upperSymbol].name };
  }

  // Try Alpha Vantage search
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: upperSymbol,
          apikey: apiKey,
        },
        timeout: 8000,
      });

      const matches = response.data.bestMatches || [];
      const exactMatch = matches.find(
        (m) => m['1. symbol'].toUpperCase() === upperSymbol
      );
      if (exactMatch) {
        return { valid: true, name: exactMatch['2. name'] };
      }
    }
  } catch (error) {
    console.warn(`[StockService] Validation API error for ${upperSymbol}: ${error.message}`);
  }

  // With demo API key, only allow known mock stocks
  return { valid: false, name: null };
};

/**
 * Generate a realistic mock quote for a given symbol.
 * Only generates for known/validated symbols.
 * @param {string} symbol - Stock ticker symbol.
 * @returns {object|null} Mock stock quote data, or null if unknown.
 */
const generateMockQuote = (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const stockInfo = MOCK_STOCKS[upperSymbol];

  if (!stockInfo) {
    return null;
  }

  return generateQuoteFromBase(
    stockInfo.symbol,
    stockInfo.name,
    stockInfo.basePrice,
    stockInfo.marketCap
  );
};

/**
 * Generate a quote from a base price with realistic fluctuations.
 */
const generateQuoteFromBase = (symbol, name, basePrice, marketCap) => {
  const fluctuation = (Math.random() - 0.5) * 0.04;
  const price = parseFloat((basePrice * (1 + fluctuation)).toFixed(2));
  const change = parseFloat((price - basePrice).toFixed(2));
  const changePercent = parseFloat(((change / basePrice) * 100).toFixed(4));
  const dayRange = basePrice * 0.02;
  const open = parseFloat((basePrice + (Math.random() - 0.5) * dayRange).toFixed(2));
  const high = parseFloat((Math.max(price, open) + Math.random() * dayRange * 0.5).toFixed(2));
  const low = parseFloat((Math.min(price, open) - Math.random() * dayRange * 0.5).toFixed(2));
  const previousClose = parseFloat((basePrice + (Math.random() - 0.3) * dayRange * 0.5).toFixed(2));
  const volume = Math.floor(Math.random() * 50000000) + 5000000;

  return {
    symbol,
    name,
    price,
    change,
    changePercent,
    volume,
    high,
    low,
    open,
    previousClose,
    marketCap,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Fetch a stock quote from Alpha Vantage with fallback to mock data.
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<object>} Stock quote data.
 */
const fetchStockQuote = async (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `quote_${upperSymbol}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: upperSymbol,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      const globalQuote = response.data['Global Quote'];

      if (globalQuote && globalQuote['01. symbol']) {
        const quote = {
          symbol: globalQuote['01. symbol'],
          name: MOCK_STOCKS[upperSymbol]?.name || `${upperSymbol}`,
          price: parseFloat(globalQuote['05. price']),
          change: parseFloat(globalQuote['09. change']),
          changePercent: parseFloat(globalQuote['10. change percent']?.replace('%', '')),
          volume: parseInt(globalQuote['06. volume'], 10),
          high: parseFloat(globalQuote['03. high']),
          low: parseFloat(globalQuote['04. low']),
          open: parseFloat(globalQuote['02. open']),
          previousClose: parseFloat(globalQuote['08. previous close']),
          marketCap: MOCK_STOCKS[upperSymbol]?.marketCap || null,
          lastUpdated: globalQuote['07. latest trading day'],
        };

        cache.set(cacheKey, quote);
        return quote;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Alpha Vantage API error for ${upperSymbol}: ${error.message}`);
  }

  const mockQuote = generateMockQuote(upperSymbol);
  if (!mockQuote) {
    return null; // Symbol not recognized
  }
  cache.set(cacheKey, mockQuote);
  return mockQuote;
};

/**
 * Generate realistic mock historical data for a given symbol.
 * @param {string} symbol - Stock ticker symbol.
 * @param {number} days - Number of days of historical data.
 * @returns {Array<object>} Array of historical data points.
 */
const generateMockHistorical = (symbol, days = 365) => {
  const upperSymbol = symbol.toUpperCase();
  const stockInfo = MOCK_STOCKS[upperSymbol];
  const basePrice = stockInfo ? stockInfo.basePrice : 100 + Math.random() * 200;

  const historicalData = [];
  let currentPrice = basePrice * 0.7;
  const trend = (basePrice - currentPrice) / days;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dailyVolatility = 0.02;
    const randomChange = (Math.random() - 0.48) * dailyVolatility * currentPrice;
    currentPrice = Math.max(1, currentPrice + trend + randomChange);

    const dayRange = currentPrice * 0.025;
    const open = parseFloat((currentPrice + (Math.random() - 0.5) * dayRange).toFixed(2));
    const close = parseFloat(currentPrice.toFixed(2));
    const high = parseFloat((Math.max(open, close) + Math.random() * dayRange * 0.6).toFixed(2));
    const low = parseFloat((Math.min(open, close) - Math.random() * dayRange * 0.6).toFixed(2));
    const volume = Math.floor(Math.random() * 40000000) + 10000000;

    historicalData.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return historicalData;
};

/**
 * Fetch historical data from Alpha Vantage with fallback to mock data.
 * @param {string} symbol - Stock ticker symbol.
 * @param {number} days - Number of days of data.
 * @returns {Promise<Array>} Historical data array.
 */
const fetchHistoricalData = async (symbol, days = 365) => {
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `historical_${upperSymbol}_${days}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: upperSymbol,
          outputsize: days > 100 ? 'full' : 'compact',
          apikey: apiKey,
        },
        timeout: 15000,
      });

      const timeSeries = response.data['Time Series (Daily)'];

      if (timeSeries) {
        const historicalData = Object.entries(timeSeries)
          .slice(0, days)
          .map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'], 10),
          }))
          .reverse();

        cache.set(cacheKey, historicalData, 300);
        return historicalData;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Historical data API error for ${upperSymbol}: ${error.message}`);
  }

  const mockData = generateMockHistorical(upperSymbol, days);
  cache.set(cacheKey, mockData, 300);
  return mockData;
};

/**
 * Search stocks by name or symbol.
 * @param {string} query - Search query.
 * @returns {Promise<Array>} Matching stocks.
 */
const searchStocks = async (query) => {
  const upperQuery = query.toUpperCase();
  const cacheKey = `search_${upperQuery}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      const matches = response.data.bestMatches;

      if (matches && matches.length > 0) {
        const results = matches.map((match) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          currency: match['8. currency'],
        }));

        cache.set(cacheKey, results, 600);
        return results;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Search API error: ${error.message}`);
  }

  const results = Object.values(MOCK_STOCKS)
    .filter(
      (stock) =>
        stock.symbol.includes(upperQuery) ||
        stock.name.toUpperCase().includes(upperQuery)
    )
    .map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'United States',
      currency: 'USD',
    }));

  cache.set(cacheKey, results, 600);
  return results;
};

/**
 * Get a market summary with major indices and top stocks.
 * @returns {Promise<object>} Market summary data.
 */
const getMarketSummary = async () => {
  const cacheKey = 'market_summary';

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const topSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA', 'JPM', 'V', 'JNJ', 'WMT', 'XOM', 'BA', 'DIS', 'KO', 'NKE', 'AMD', 'CRM', 'PYPL'];

  const quotes = await Promise.all(topSymbols.map((symbol) => fetchStockQuote(symbol)));

  const gainers = [...quotes].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const losers = [...quotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  const indices = [
    {
      symbol: '^DJI',
      name: 'Dow Jones Industrial Average',
      price: parseFloat((35000 + (Math.random() - 0.5) * 400).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 300).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.5).toFixed(2)),
    },
    {
      symbol: '^GSPC',
      name: 'S&P 500',
      price: parseFloat((4500 + (Math.random() - 0.5) * 50).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 40).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.2).toFixed(2)),
    },
    {
      symbol: '^IXIC',
      name: 'NASDAQ Composite',
      price: parseFloat((14000 + (Math.random() - 0.5) * 150).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 120).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.8).toFixed(2)),
    },
  ];

  const summary = {
    indices,
    topStocks: quotes,
    gainers,
    losers,
    lastUpdated: new Date().toISOString(),
  };

  cache.set(cacheKey, summary, 30);
  return summary;
};

module.exports = {
  fetchStockQuote,
  fetchHistoricalData,
  generateMockQuote,
  generateMockHistorical,
  searchStocks,
  getMarketSummary,
  validateSymbol,
  MOCK_STOCKS,
};
