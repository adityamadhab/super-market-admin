import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import { Dashborad } from './pages/Dashboard';
import Category from './pages/Category';
import { Product } from './pages/Product';
import { Payments } from './pages/Payments';
import { Logout } from './pages/Logout';
import { Order } from './pages/Order';
import axios from 'axios';

axios.defaults.baseURL = "https://api.debugify.org/api/v1";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashborad />} />
      <Route path="/category" element={<Category />} />
      <Route path="/product" element={<Product />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
