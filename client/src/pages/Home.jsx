import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Clock } from 'lucide-react';
import './Home.css';

export default function Home() {
    return (
        <div className="modern-home-container fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>

                <div className="hero-content">
                    <div className="badge">🚀 Next-Generation Storefront</div>
                    <h1 className="hero-title">Experience the Future of <span>Smart Shopping</span></h1>
                    <p className="hero-subtitle">
                        Discover top-tier products with lightning-fast checkout and AI-driven automated order processing.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary-large">
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Shop With Us?</h2>
                    <p>We've completely automated our backend so your experience is seamless.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon bg-indigo">
                            <Zap size={28} />
                        </div>
                        <h3>Instant Processing</h3>
                        <p>Our automation workflow ensures your order is confirmed and invoiced within seconds of checkout.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon bg-emerald">
                            <ShieldCheck size={28} />
                        </div>
                        <h3>Secure & Reliable</h3>
                        <p>Stock levels are synchronized in real-time securely, meaning you never buy what isn't there.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon bg-rose">
                            <Clock size={28} />
                        </div>
                        <h3>24/7 Availability</h3>
                        <p>Browse our extensive catalog anytime. The robots are always working behind the scenes!</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
