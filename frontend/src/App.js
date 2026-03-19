import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StockDetail from './pages/StockDetail';
import Watchlist from './pages/Watchlist';
import Predictions from './pages/Predictions';
import History from './pages/History';
import Recommendations from './pages/Recommendations';
import News from './pages/News';
import Learn from './pages/Learn';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/history" element={<History />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/news" element={<News />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
