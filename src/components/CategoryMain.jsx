import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon, Upload } from "lucide-react";
import { useRecoilState } from "recoil";
import { categoriesState } from "../recoil/atoms";
import axios from "axios";
import Swal from "sweetalert2";

export default function CategoryMain() {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryImage, setCategoryImage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get("/admin/category/get-all-categories", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            Swal.fire("Error", "Failed to fetch categories", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.post("/admin/category/add-category",
                    {
                        category: newCategory.trim(),
                        categoryImage: categoryImage
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setCategories([...categories, response.data]);
                setNewCategory("");
                setCategoryImage("");
                Swal.fire("Success", "Category added successfully", "success");
            } catch (error) {
                console.error("Error adding category:", error);
                Swal.fire("Error", "Failed to add category", "error");
            }
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/admin/category/remove-category/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(categories.filter((cat) => cat._id !== categoryId));
            Swal.fire("Success", "Category deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting category:", error);
            Swal.fire("Error", "Failed to delete category", "error");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setNewCategory(category.category);
        setCategoryImage(category.categoryImage || "");
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setNewCategory("");
        setCategoryImage("");
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`/admin/category/update-category/${editingCategory._id}`,
                {
                    category: newCategory.trim(),
                    categoryImage: categoryImage
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCategories(categories.map((cat) => (cat._id === editingCategory._id ? response.data : cat)));
            setEditingCategory(null);
            setNewCategory("");
            setCategoryImage("");
            Swal.fire("Success", "Category updated successfully", "success");
        } catch (error) {
            console.error("Error updating category:", error);
            Swal.fire("Error", "Failed to update category", "error");
        }
    };

    const handleImageChange = (e) => {
        setCategoryImage(e.target.value);
    };

    return (
        <div className="min-h-screen w-full mt-4 bg-white text-black p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Category Management</h1>

            <form onSubmit={editingCategory ? handleUpdate : handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label htmlFor="category-name" className="block mb-2 font-medium">
                        {editingCategory ? "Edit Category" : "Create a Category"}
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            id="category-name"
                            type="text"
                            placeholder="Enter category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-grow p-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            id="category-image"
                            type="url"
                            placeholder="Enter image URL"
                            value={categoryImage}
                            onChange={handleImageChange}
                            className="flex-grow p-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200"
                        >
                            {editingCategory ? (
                                <>
                                    <PencilIcon className="w-5 h-5 mr-2" />
                                    Update Category
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Add Category
                                </>
                            )}
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="flex items-center justify-center px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category Name
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center py-4 px-4 text-gray-500">No categories added yet</td>
                            </tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr key={category._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-3">{category.category}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-2"
                                            aria-label={`Edit ${category.category}`}
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                            aria-label={`Delete ${category.category}`}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}