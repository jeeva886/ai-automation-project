import { useState, useEffect } from 'react'
import axios from 'axios'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Package, Zap } from 'lucide-react'
import './OwnerDashboard.css'

export default function OwnerDashboard() {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://localhost:5000/api/products/dashboard')
            setDashboardData(res.data)
        } catch (err) {
            console.error('Failed to fetch dashboard data', err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0])
            setMessage(null)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
                setFile(droppedFile)
                setMessage(null)
            } else {
                setMessage({ type: 'error', text: 'Please upload a valid Excel file (.xlsx or .xls).' })
            }
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            setMessage({ type: 'error', text: 'Please select or drop an Excel file first.' })
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        setUploading(true)
        setMessage(null)

        try {
            const res = await axios.post('http://localhost:5000/api/products/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setMessage({ type: 'success', text: res.data.msg || 'Stock catalog updated successfully!' })
            setFile(null)
            fetchDashboardData() // Refresh dashboard data after upload
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to upload Excel file.' })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="owner-dashboard-container fade-in">
            <div className="page-header">
                <h1>Owner Dashboard</h1>
                <p>Manage store stock and analyze sales insights efficiently</p>
            </div>

            <div className="dashboard-grid">
                {/* Upload Section - Inline Form */}
                <div className="upload-section-inline card w-full col-span-2 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="section-title-small mb-1">
                                <FileSpreadsheet size={20} className="icon-blue inline mr-2" />
                                Stock Management
                            </h2>
                            <p className="text-sm text-gray-500 m-0">Upload Excel (.xlsx) file to sync your inventory.</p>
                        </div>

                        <form onSubmit={handleUpload} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="text-sm text-gray-700
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100 cursor-pointer"
                            />
                            <button
                                type="submit"
                                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                style={{ padding: '0.6rem 1.25rem', margin: 0 }}
                                disabled={!file || uploading}
                            >
                                <Upload size={16} />
                                {uploading ? 'Processing...' : 'Sync Stock'}
                            </button>
                        </form>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded flex items-center gap-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Automation Workflow Overview */}
                <div className="workflow-section card w-full col-span-2 mb-6">
                    <h2 className="section-title-small">
                        <Zap size={24} className="icon-orange" />
                        Automation Workflow Builder
                    </h2>
                    <p className="upload-desc" style={{ marginBottom: '1.5rem' }}>Design, configure and deploy smart automations straight from our node-based builder interface.</p>
                    <div>
                        <button className="btn-primary" onClick={() => window.location.href = '/workflow-builder'}>
                            Open Workflow Builder <Zap size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                {!loading && dashboardData && (
                    <div className="stats-section w-full col-span-2">
                        <div className="stat-cards">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-blue-light">
                                    <Package className="icon-blue" />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Products</p>
                                    <h3 className="stat-value">{dashboardData.totalProducts}</h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-green-light">
                                    <TrendingUp className="icon-green" />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Week Sales/Revenue</p>
                                    <h3 className="stat-value">₹{dashboardData.salesAnalysis?.currentWeekRevenue.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon-wrapper bg-purple-light">
                                    {dashboardData.salesAnalysis?.demandTrend === 'Up' ?
                                        <TrendingUp className="icon-purple" /> :
                                        <TrendingDown className="icon-purple" />
                                    }
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Demand Trend</p>
                                    <h3 className="stat-value">{dashboardData.salesAnalysis?.demandTrend || '-'}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Consolidated Sales & Insights Report */}
                        <div className="analysis-card card mt-6 border-indigo-500 border-t-4">
                            <h3 className="section-title-small mb-4 border-b pb-2">
                                <TrendingUp size={20} className="icon-blue inline mr-2" />
                                Comprehensive Product Insights & Alerts
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-y">
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Metric / Category</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Product Name</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-gray-600">Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Top Selling */}
                                        {dashboardData.topSelling && dashboardData.topSelling.length > 0 && dashboardData.topSelling.slice(0, 3).map((item, idx) => (
                                            <tr key={'top-' + item._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-green-600 font-medium">
                                                    {idx === 0 ? '🏆 Top Seller' : '🔥 High Demand'}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.name}</td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded">{item.salesCurrentWeek} sold this week</span>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Low Stock Alerts */}
                                        {dashboardData.lowStockAlerts && dashboardData.lowStockAlerts.length > 0 && dashboardData.lowStockAlerts.map(item => (
                                            <tr key={'stock-' + item._id} className="hover:bg-gray-50 bg-red-50/30">
                                                <td className="py-3 px-4 text-sm text-red-600 font-medium">⚠️ Low Stock Alert</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.name}</td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Only {item.quantity} units left</span>
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Low Demand */}
                                        {dashboardData.lowDemand && dashboardData.lowDemand.length > 0 && dashboardData.lowDemand.slice(0, 3).map((item) => (
                                            <tr key={'demand-' + item._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-orange-500 font-medium">📉 Low Demand</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.name}</td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded">{item.salesCurrentWeek} sold this week</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
