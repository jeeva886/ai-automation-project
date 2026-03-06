import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, ShoppingCart, AlertCircle, Plus } from 'lucide-react'
import './Products.css'

export default function Products({ setCartCount }) {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [addedStates, setAddedStates] = useState({})

    useEffect(() => {
        fetchProducts()
    }, [search])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:5000/api/products?search=${search}`)
            setProducts(res.data)
            setError('')
        } catch (err) {
            setError('Failed to load products. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || []
        const existingItem = cart.find(item => item.product === product._id)

        if (existingItem) {
            if (existingItem.quantity >= product.quantity) {
                alert('Cannot add more than available stock.');
                return;
            }
            existingItem.quantity += 1
        } else {
            if (product.quantity < 1) {
                alert('Out of stock.');
                return;
            }
            cart.push({ ...product, product: product._id, quantity: 1 })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        const newCount = cart.reduce((acc, item) => acc + item.quantity, 0)
        setCartCount(newCount)

        // Show quick feedback
        setAddedStates({ ...addedStates, [product._id]: true })
        setTimeout(() => {
            setAddedStates(prev => ({ ...prev, [product._id]: false }))
        }, 1000)
    }

    return (
        <div className="products-container fade-in">
            <div className="page-header">
                <h1>Our Products</h1>
                <p>Browse our extensive collection of high-quality items</p>
            </div>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for products, categories, or brands..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle /> {error}
                </div>
            )}

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} className="empty-icon text-muted" />
                    <h3>No products found</h3>
                    <p>We couldn't find any products matching your search criteria.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product._id} className="product-card card">
                            <div className="product-image-placeholder">
                                {product.quantity <= 5 && product.quantity > 0 && (
                                    <span className="stock-badge warning">Only {product.quantity} left</span>
                                )}
                                {product.quantity === 0 && (
                                    <span className="stock-badge danger">Out of Stock</span>
                                )}
                                {/* Using LoremFlickr to get product-specific images based on the product name */}
                                <img src={`https://loremflickr.com/300/200/${encodeURIComponent(product.name.split(' ')[0])},product/all`} alt={product.name} loading="lazy" />
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-pricing">
                                    <span className="product-price">₹{product.price.toFixed(2)}</span>
                                </div>
                                <div className="product-meta">
                                    <span className="stock-info">Available: {product.quantity}</span>
                                </div>

                                <button
                                    className={`btn-add-cart ${addedStates[product._id] ? 'added' : ''}`}
                                    onClick={() => addToCart(product)}
                                    disabled={product.quantity === 0}
                                >
                                    {addedStates[product._id] ? (
                                        'Added!'
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
