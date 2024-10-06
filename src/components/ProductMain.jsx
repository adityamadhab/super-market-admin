import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { categoriesState, productsState } from "../recoil/atoms";
import axios from "axios";
import Swal from "sweetalert2";

// Inline UI components with improved styling
const Button = ({ children, className, ...props }) => (
    <button className={`px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200 ${className}`} {...props}>
        {children}
    </button>
);

const Input = ({ className, ...props }) => (
    <input className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow duration-200 ${className}`} {...props} />
);

const Label = ({ children, htmlFor, className }) => (
    <label htmlFor={htmlFor} className={`block mb-2 font-medium text-gray-700 ${className}`}>
        {children}
    </label>
);

const Textarea = ({ className, ...props }) => (
    <textarea className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow duration-200 ${className}`} {...props} />
);

const Select = ({ children, value, onChange }) => (
    <select value={value} onChange={onChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-shadow duration-200">
        {children}
    </select>
);

const Card = ({ children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="p-4 bg-gray-50 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold text-gray-800">{children}</h2>
);

const CardContent = ({ children }) => (
    <div className="p-4">{children}</div>
);

const PlusCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export default function ProductMain() {
    const [products, setProducts] = useRecoilState(productsState);
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [newProduct, setNewProduct] = useState({
        name: "",
        categoryName: "",
        description: "",
        brand: "",
        price: 0,
        imageURL: "",
        featuredFlag: false,
    });
    const [base64Images, setBase64Images] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/product/get-all");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire("Error", "Failed to fetch products", "error");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/admin/category/get-all-categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            Swal.fire("Error", "Failed to fetch categories", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e) => {
        setNewProduct(prev => ({ ...prev, category: e.target.value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            });
        })).then(base64Files => {
            setBase64Images(base64Files);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newProduct.name && newProduct.categoryName) {
            try {
                const response = await axios.post("/product/add", {
                    ...newProduct,
                    base64Images,
                    price: Number(newProduct.price),
                });
                setProducts([...products, response.data]);
                setNewProduct({
                    name: "",
                    categoryName: "",
                    description: "",
                    brand: "",
                    price: 0,
                    imageURL: "",
                    featuredFlag: false,
                });
                setBase64Images([]);
                Swal.fire("Success", "Product added successfully", "success");
            } catch (error) {
                console.error("Error adding product:", error);
                if (error.response && error.response.status === 404) {
                    Swal.fire("Error", "Category not found", "error");
                } else {
                    Swal.fire("Error", "Failed to add product", "error");
                }
            }
        }
    };

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/product/delete/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(products.filter(product => product._id !== productId));
            Swal.fire("Success", "Product deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting product:", error);
            if (error.response && error.response.status === 404) {
                Swal.fire("Error", "Product not found", "error");
            } else if (error.response && error.response.status === 401) {
                Swal.fire("Error", "Unauthorized. Please log in again.", "error");
                // Optionally, you can redirect to the login page here
            } else {
                Swal.fire("Error", "Failed to delete product", "error");
            }
        }
    };

    const handleEdit = async (product) => {
        console.log("Edit product:", product);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 text-gray-900 p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">Product Management</h1>
            <div className="max-w-4xl mx-auto">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="categoryName">Category</Label>
                                    <Select value={newProduct.categoryName} onChange={(e) => setNewProduct(prev => ({ ...prev, categoryName: e.target.value }))}>
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.category}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        name="brand"
                                        value={newProduct.brand}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="images">Product Images</Label>
                                <Input
                                    id="images"
                                    name="images"
                                    type="file"
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <Label htmlFor="featuredFlag">Featured Product</Label>
                                <input
                                    type="checkbox"
                                    id="featuredFlag"
                                    name="featuredFlag"
                                    checked={newProduct.featuredFlag}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, featuredFlag: e.target.checked }))}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <PlusCircle />
                                Add Product
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {categories.map((category) => (
                        <Card key={category._id}>
                            <CardHeader>
                                <CardTitle>{category.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products
                                        .filter((product) => product.category === category._id)
                                        .map((product) => (
                                            <div key={product._id} className="bg-white p-4 rounded-lg shadow">
                                                {product.imageURL && product.imageURL.length > 0 && (
                                                    <img
                                                        src={product.imageURL[0]}
                                                        alt={product.name}
                                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                                    />
                                                )}
                                                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                                <p className="text-sm"><span className="font-medium">Brand:</span> {product.brand}</p>
                                                <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
                                                <div className="mt-4 flex justify-between">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}