import React, { createContext, useContext, useState, useCallback } from 'react';

const PortfolioContext = createContext(null);

const BALANCE_KEY = 'stockai_balance';
const PORTFOLIO_KEY = 'stockai_portfolio';
const TRANSACTIONS_KEY = 'stockai_transactions';
const DEFAULT_BALANCE = 10000;

const loadState = () => {
  try {
    const balanceRaw = localStorage.getItem(BALANCE_KEY);
    const balance = balanceRaw !== null ? parseFloat(balanceRaw) : DEFAULT_BALANCE;
    if (isNaN(balance)) return { balance: DEFAULT_BALANCE, portfolio: {}, transactions: [] };
    const portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '{}');
    const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
    return { balance, portfolio, transactions };
  } catch {
    return { balance: DEFAULT_BALANCE, portfolio: {}, transactions: [] };
  }
};

const saveBalance = (balance) => {
  localStorage.setItem(BALANCE_KEY, String(balance));
};

const savePortfolio = (portfolio) => {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

const saveTransactions = (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export function PortfolioProvider({ children }) {
  const [balance, setBalance] = useState(() => loadState().balance);
  const [portfolio, setPortfolio] = useState(() => loadState().portfolio);
  const [transactions, setTransactions] = useState(() => loadState().transactions);

  const buyStock = useCallback((symbol, name, quantity, price) => {
    if (!symbol || quantity <= 0 || price <= 0) {
      return { success: false, message: 'Invalid trade parameters' };
    }

    const total = quantity * price;

    if (balance < total) {
      return { success: false, message: 'Insufficient balance' };
    }

    const balanceBefore = balance;
    const newBalance = parseFloat((balance - total).toFixed(2));

    // Update portfolio position
    const existing = portfolio[symbol];
    let updatedPosition;

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      const newTotalInvested = existing.totalInvested + total;
      const newAvgPrice = newTotalInvested / newQuantity;
      updatedPosition = {
        symbol,
        name: name || existing.name,
        quantity: newQuantity,
        avgPrice: parseFloat(newAvgPrice.toFixed(4)),
        totalInvested: parseFloat(newTotalInvested.toFixed(2)),
      };
    } else {
      updatedPosition = {
        symbol,
        name,
        quantity,
        avgPrice: parseFloat(price.toFixed(4)),
        totalInvested: parseFloat(total.toFixed(2)),
      };
    }

    const newPortfolio = { ...portfolio, [symbol]: updatedPosition };

    // Record transaction
    const transaction = {
      id: Date.now() + Math.random(),
      type: 'buy',
      symbol,
      name: name || symbol,
      quantity,
      price: parseFloat(price.toFixed(4)),
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      balanceBefore: parseFloat(balanceBefore.toFixed(2)),
      balanceAfter: parseFloat(newBalance.toFixed(2)),
    };

    const newTransactions = [transaction, ...transactions];

    // Persist everything
    setBalance(newBalance);
    setPortfolio(newPortfolio);
    setTransactions(newTransactions);

    saveBalance(newBalance);
    savePortfolio(newPortfolio);
    saveTransactions(newTransactions);

    return { success: true };
  }, [balance, portfolio, transactions]);

  const sellStock = useCallback((symbol, quantity, price) => {
    if (!symbol || quantity <= 0 || price <= 0) {
      return { success: false, message: 'Invalid trade parameters' };
    }

    const position = portfolio[symbol];
    if (!position || position.quantity < quantity) {
      return { success: false, message: 'Not enough shares' };
    }

    const total = quantity * price;
    const balanceBefore = balance;
    const newBalance = parseFloat((balance + total).toFixed(2));

    // Update portfolio position
    const newQuantity = position.quantity - quantity;
    let newPortfolio;

    if (newQuantity === 0) {
      // Remove position entirely
      newPortfolio = { ...portfolio };
      delete newPortfolio[symbol];
    } else {
      // Reduce the position - keep same avgPrice, reduce totalInvested proportionally
      const proportionRemaining = newQuantity / position.quantity;
      const newTotalInvested = position.totalInvested * proportionRemaining;
      newPortfolio = {
        ...portfolio,
        [symbol]: {
          ...position,
          quantity: newQuantity,
          totalInvested: parseFloat(newTotalInvested.toFixed(2)),
        },
      };
    }

    // Record transaction
    const transaction = {
      id: Date.now() + Math.random(),
      type: 'sell',
      symbol,
      name: position.name || symbol,
      quantity,
      price: parseFloat(price.toFixed(4)),
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      balanceBefore: parseFloat(balanceBefore.toFixed(2)),
      balanceAfter: parseFloat(newBalance.toFixed(2)),
    };

    const newTransactions = [transaction, ...transactions];

    // Persist everything
    setBalance(newBalance);
    setPortfolio(newPortfolio);
    setTransactions(newTransactions);

    saveBalance(newBalance);
    savePortfolio(newPortfolio);
    saveTransactions(newTransactions);

    return { success: true };
  }, [balance, portfolio, transactions]);

  const getPortfolioValue = useCallback((currentPrices = {}) => {
    let totalValue = 0;
    Object.values(portfolio).forEach((position) => {
      const currentPrice = currentPrices[position.symbol] || position.avgPrice;
      totalValue += position.quantity * currentPrice;
    });
    return parseFloat(totalValue.toFixed(2));
  }, [portfolio]);

  const getPosition = useCallback((symbol) => {
    return portfolio[symbol] || null;
  }, [portfolio]);

  const getTotalProfitLoss = useCallback((currentPrices = {}) => {
    let totalPL = 0;
    Object.values(portfolio).forEach((position) => {
      const currentPrice = currentPrices[position.symbol] || position.avgPrice;
      const currentValue = position.quantity * currentPrice;
      const costBasis = position.totalInvested;
      totalPL += currentValue - costBasis;
    });
    return parseFloat(totalPL.toFixed(2));
  }, [portfolio]);

  const resetPortfolio = useCallback(() => {
    setBalance(DEFAULT_BALANCE);
    setPortfolio({});
    setTransactions([]);

    saveBalance(DEFAULT_BALANCE);
    savePortfolio({});
    saveTransactions([]);
  }, []);

  const value = {
    balance,
    portfolio,
    transactions,
    buyStock,
    sellStock,
    getPortfolioValue,
    getPosition,
    getTotalProfitLoss,
    resetPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

export default PortfolioContext;
