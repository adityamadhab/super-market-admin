import { useState, useEffect } from "react"
import { Eye, RefreshCcw } from "lucide-react"
import Swal from 'sweetalert2'
import { ordersState } from "../recoil/atoms"
import { useRecoilState } from "recoil"
import axios from 'axios'

const statusColors = {
    "Order Placed": "bg-yellow-100 text-yellow-800",
    "Order Accepted": "bg-blue-100 text-blue-800",
    "Order Processing": "bg-indigo-100 text-indigo-800",
    "Order Packed": "bg-purple-100 text-purple-800",
    "Order Picked": "bg-pink-100 text-pink-800",
    "Order Shipped": "bg-green-100 text-green-800",
    "Order Out for Delivery": "bg-orange-100 text-orange-800",
    "Order Delivered": "bg-teal-100 text-teal-800",
    "Order Cancelled": "bg-red-100 text-red-800",
    "Order Returned": "bg-gray-100 text-gray-800",
}

const logisticsLifecycle = {
    order_placed: "Order Placed",
    order_accepted: "Order Accepted",
    order_processing: "Order Processing",
    order_packed: "Order Packed",
    order_picked: "Order Picked",
    order_shipped: "Order Shipped",
    order_out_for_delivery: "Order Out for Delivery",
    order_delivered: "Order Delivered",
    order_cancelled: "Order Cancelled",
    order_returned: "Order Returned",
};

export default function OrderManagement() {
    const [orders, setOrders] = useRecoilState(ordersState);
    const [sortConfig, setSortConfig] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [orderStats, setOrderStats] = useState({})

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get("/admin/order/get-all-details", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("API Response:", response.data);

            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
                setOrderStats({ totalOrders: response.data.totalOrders });
                console.log("Orders set:", response.data.orders);
            } else {
                console.error("Unexpected response format:", response.data);
                setOrders([]);
                setOrderStats({});
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
                if (error.response.status === 404) {
                    setOrders([]);
                    setOrderStats({ totalOrders: 0 });
                    console.log("No orders found");
                }
            }
            Swal.fire("Error", "Failed to fetch orders", "error");
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const filteredOrders = Array.isArray(orders)
        ? orders.filter(order =>
            order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.userID?.name && order.userID.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortConfig !== null) {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`/admin/order/update-status/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setOrders(orders.map(order =>
                order.orderID === orderId ? { ...order, status: newStatus } : order
            ));
            Swal.fire("Success", "Order status updated successfully", "success");
            fetchOrders(); // Refresh order stats after update
        } catch (error) {
            console.error("Error updating order status:", error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    }

    const showOrderDetails = async (orderId) => {
        try {
            const order = orders.find(o => o.orderID === orderId);
            if (!order) {
                throw new Error("Order not found");
            }

            const itemsList = order.products.map(product => `
                <div class="mb-4 p-3 border rounded">
                    <p><strong>Product Name:</strong> ${product.name}</p>
                    <p><strong>Product ID:</strong> ${product.productID}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <p><strong>Price per unit:</strong> Rs.${product.price.toFixed(2)}</p>
                    <p><strong>Original Price:</strong> Rs.${product.originalPriceWas.toFixed(2)}</p>
                    <p><strong>Total Amount:</strong> Rs.${product.totalAmount.toFixed(2)}</p>

                </div>
            `).join('');

            Swal.fire({
                title: 'Order Details',
                html: `
                    <div class="text-left">
                        <h3 class="font-bold mb-3">Order Information</h3>
                        <p><strong>Order ID:</strong> ${order.orderID}</p>
                        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Order Amount:</strong> Rs.${order.totalOrderAmount.toFixed(2)}</p>
                        
                        <h3 class="font-bold mt-4 mb-3">Customer Information</h3>
                        <p><strong>Name:</strong> ${order.user.name}</p>
                        <p><strong>Phone:</strong> ${order.user.phone}</p>
                        
                        <h3 class="font-bold mt-4 mb-3">Delivery Address</h3>
                        <p>${order.user.address}</p>
                        <p>${order.user.city}, ${order.user.state}</p>
                        <p>${order.user.country} - ${order.user.pincode}</p>
                        
                        <h3 class="font-bold mt-4 mb-3">Products</h3>
                        ${itemsList}
                    </div>
                `,
                width: '90%',
                maxWidth: '800px',
                confirmButtonText: 'Close',
                confirmButtonColor: '#3085d6',
            });
        } catch (error) {
            console.error("Error fetching order details:", error);
            Swal.fire("Error", "Failed to fetch order details", "error");
        }
    };

    const displayOrderStats = () => {
        if (!orderStats || Object.keys(orderStats).length === 0) {
            return null; // or return a placeholder component
        }
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(orderStats).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-semibold text-gray-600">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white text-black p-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Management</h1>

            {displayOrderStats()}

            <div className="mb-6 flex justify-between items-center">
                <div className="w-1/2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by Order ID or Customer Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    onClick={fetchOrders}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh Orders
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('orderID')} className="flex items-center">
                                    Order ID
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('userID.name')} className="flex items-center">
                                    Customer
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                <button onClick={() => handleSort('createdAt')} className="flex items-center">
                                    Date
                                </button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                <button onClick={() => handleSort('totalAmount')} className="flex items-center justify-end w-full">
                                    Total
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No orders found. {orders.length === 0 ? "The orders list is empty." : "No orders match the current filter."}
                                </td>
                            </tr>
                        ) : (
                            sortedOrders.map((order) => (
                                <tr key={order.orderID}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 hidden md:table-cell">
                                        Rs.{order.products.reduce((total, product) => total + product.totalAmount, 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${statusColors[order.status] || ''}`}
                                        >
                                            {Object.values(logisticsLifecycle).map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => showOrderDetails(order.orderID)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span className="hidden sm:inline">View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}