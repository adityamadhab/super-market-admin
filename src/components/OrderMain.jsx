import { useState, useEffect } from "react"
import { Eye } from "lucide-react"
import Swal from 'sweetalert2'
import { ordersState } from "../recoil/atoms"
import { useRecoilState } from "recoil"
import axios from 'axios'

const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-green-100 text-green-800",
    Delivered: "bg-purple-100 text-purple-800",
}

export default function OrderManagement() {
    const [orders, setOrders] = useRecoilState(ordersState);
    const [sortConfig, setSortConfig] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get("/admin/order/get-all", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
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

    const sortedOrders = [...orders].sort((a, b) => {
        if (!sortConfig) return 0
        const { key, direction } = sortConfig
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
        return 0
    })

    const filteredOrders = sortedOrders.filter(order =>
        (order.orderID?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.userID?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`/admin/order/update-status/${orderId}`,
                {
                    isAccepted: newStatus === 'Processing',
                    isDelivered: newStatus === 'Delivered',
                    isCancelled: newStatus === 'Cancelled'
                },
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
        } catch (error) {
            console.error("Error updating order status:", error);
            Swal.fire("Error", "Failed to update order status", "error");
        }
    }

    const showOrderDetails = async (orderId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`/admin/order/get-one/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const order = response.data;

            const itemsList = order.products.map(product =>
                `${product.productName} - Quantity: ${product.quantity}, Price: $${product.price.toFixed(2)}`
            ).join('<br>');

            Swal.fire({
                title: 'Order Details',
                html: `
                    <p><strong>Order ID:</strong> ${order.orderID}</p>
                    <p><strong>Customer:</strong> ${order.userID.name}</p>
                    <p><strong>Email:</strong> ${order.userID.email}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${order.isCancelled ? 'Cancelled' : order.products[0].logistics.isDelivered ? 'Delivered' : order.products[0].logistics.isAccepted ? 'Processing' : 'Pending'}</p>
                    <p><strong>Address:</strong> ${order.shippingAddress}</p>
                    <h4 class="font-semibold mt-4 mb-2">Items:</h4>
                    <p>${itemsList}</p>
                `,
                width: '90%',
                maxWidth: '600px',
                confirmButtonText: 'Close',
                confirmButtonColor: '#3085d6',
            });
        } catch (error) {
            console.error("Error fetching order details:", error);
            Swal.fire("Error", "Failed to fetch order details", "error");
        }
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white text-black p-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Management</h1>

            <div className="mb-6">
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

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('id')} className="flex items-center">
                                    Order ID
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('customer')} className="flex items-center">
                                    Customer
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                <button onClick={() => handleSort('date')} className="flex items-center">
                                    Date
                                </button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                <button onClick={() => handleSort('total')} className="flex items-center justify-end w-full">
                                    Total
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.orderID}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderID}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userID?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 hidden md:table-cell">
                                    ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={order.isCancelled ? 'Cancelled' : order.products[0]?.logistics.isDelivered ? 'Delivered' : order.products[0]?.logistics.isAccepted ? 'Processing' : 'Pending'}
                                        onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${statusColors[order.status] || ''}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}