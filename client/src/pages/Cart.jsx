import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Trash2, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react'
import './Cart.css'

export default function Cart({ setCartCount }) {
    const [cartItems, setCartItems] = useState([])
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' })
    const [loading, setLoading] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart')) || []
        setCartItems(items)
        updateCartCount(items)
    }, [])

    const updateCartCount = (items) => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0)
        setCartCount(count)
    }

    const removeItem = (productId) => {
        const newCart = cartItems.filter(item => item.product !== productId)
        setCartItems(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
        updateCartCount(newCart)
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const newCart = cartItems.map(item => {
            if (item.product === productId) {
                // Using max available stock would be better, but assuming front-end validation
                return { ...item, quantity: newQuantity }
            }
            return item
        })
        setCartItems(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
        updateCartCount(newCart)
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    const handleCheckout = async (e) => {
        e.preventDefault()
        if (cartItems.length === 0) return;

        setLoading(true)
        setError('')

        try {
            const orderData = {
                customerInfo,
                items: cartItems.map(i => ({ product: i.product, quantity: i.quantity, price: i.price }))
            }

            const res = await axios.post('http://localhost:5000/api/orders', orderData)

            setOrderSuccess(res.data.orderId)
            localStorage.removeItem('cart')
            setCartItems([])
            updateCartCount([])

        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to process order.')
        } finally {
            setLoading(false)
        }
    }

    if (orderSuccess) {
        return (
            <div className="cart-container success-container fade-in">
                <div className="success-card card">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>Order Confirmed!</h2>
                    <p className="order-id">Order ID: <strong>{orderSuccess}</strong></p>
                    <p className="success-msg">
                        Thank you for shopping with us. Your order has been placed successfully.
                        An invoice has been sent to your email address: <strong>{customerInfo.email}</strong>.
                    </p>
                    <button className="btn-primary btn-large" onClick={() => navigate('/products')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-container fade-in">
            <div className="page-header">
                <h1>Your Cart</h1>
                <p>Review your items and complete checkout</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {cartItems.length === 0 ? (
                <div className="empty-cart card">
                    <ShoppingCart size={48} className="empty-icon text-muted" />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <Link to="/products" className="btn-primary mt-4 inline-block">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-section card">
                        <h3 className="section-title-small">Items ({cartItems.length})</h3>
                        <div className="cart-items-list">
                            {cartItems.map(item => (
                                <div key={item.product} className="cart-item">
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-price">₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                                className="qty-btn"
                                            >-</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                                className="qty-btn"
                                            >+</button>
                                        </div>
                                        <span className="item-total-price">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.product)}
                                            className="btn-remove"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="checkout-section card">
                        <h3 className="section-title-small">Order Summary</h3>
                        <div className="summary-row total-row">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>

                        <form onSubmit={handleCheckout} className="checkout-form">
                            <h3 className="section-title-small mt-6">Shipping Details</h3>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={customerInfo.name}
                                    onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={customerInfo.email}
                                    onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Shipping Address</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={customerInfo.address}
                                    onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    placeholder="Enter your full shipping address"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary btn-block checkout-btn"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (
                                    <>Checkout <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
