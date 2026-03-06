import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogOut, Package, BarChart2, Search, Zap, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import './App.css'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import OwnerDashboard from './pages/OwnerDashboard'
import WorkflowBuilder from './pages/WorkflowBuilder'
import Login from './pages/Login'
function App() {
  const [cartCount, setCartCount] = useState(0)
  const [role, setRole] = useState(localStorage.getItem('userRole') || null)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    setRole(null)
    navigate('/login')
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <Zap size={28} className="brand-icon" />
          <span>Autoflow AI</span>
        </div>

        <div className="nav-links">
          {role && <Link to="/" className="nav-link">Home</Link>}
          {role && <Link to="/products" className="nav-link">Products</Link>}
          {role === 'owner' && <Link to="/owner-dashboard" className="nav-link owner-link">Owner Dashboard</Link>}
        </div>

        <div className="nav-actions">
          {role && (
            <Link to="/cart" className="cart-icon-container">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          {role ? (
            <button onClick={handleLogout} className="btn-outline ml-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={role ? <Home /> : <Login setRole={setRole} />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/products" element={<Products setCartCount={setCartCount} />} />
          <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/workflow-builder" element={<WorkflowBuilder />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 SmartShop Automation System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
