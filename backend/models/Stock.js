const mongoose = require('mongoose');

const historicalDataPointSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    open: {
      type: Number,
      required: true,
    },
    high: {
      type: Number,
      required: true,
    },
    low: {
      type: Number,
      required: true,
    },
    close: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
  },
  change: {
    type: Number,
  },
  changePercent: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  open: {
    type: Number,
  },
  previousClose: {
    type: Number,
  },
  marketCap: {
    type: Number,
  },
  historicalData: [historicalDataPointSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Update the lastUpdated timestamp before each save.
 */
stockSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

/**
 * Index for efficient querying by symbol and date range.
 */
stockSchema.index({ symbol: 1, lastUpdated: -1 });

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
