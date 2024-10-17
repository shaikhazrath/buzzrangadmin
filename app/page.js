'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        images: '',
        category: '',
        brand: '',
        gender: '',
        discountPrice: '',
        productWebsiteLink: ''
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        try {
            const response = await axios.get(`${NEXT_PUBLIC_API_URL}/products`, {
                params: { page, limit: productsPerPage }
            });
            setProducts(response.data.products);
            setTotalProducts(response.data.totalProducts);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingProductId) {
            await updateProduct(editingProductId);
        } else {
            await addProduct();
        }
        resetForm();
        fetchProducts(currentPage);
    };

    const addProduct = async () => {
        try {
            await axios.post(`${NEXT_PUBLIC_API_URL}/products`, formData);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id) => {
        try {
            await axios.put(`${NEXT_PUBLIC_API_URL}/products/${id}`, formData);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${NEXT_PUBLIC_API_URL}/products/${id}`);
            fetchProducts(currentPage);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const editProduct = (product) => {
        setFormData(product);
        setEditingProductId(product._id);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            images: '',
            category: '',
            brand: '',
            gender: '',
            discountPrice: '',
            productWebsiteLink: ''
        });
        setEditingProductId(null);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto p-4 bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <form onSubmit={handleSubmit} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" required />
                    <input type="text" name="images" placeholder="Image URL" value={formData.images} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" required />
                    <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" />
                    <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="number" name="discountPrice" placeholder="Discount Price" value={formData.discountPrice} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" />
                    <input type="text" name="productWebsiteLink" placeholder="Product Website Link" value={formData.productWebsiteLink} onChange={handleChange} className="border border-gray-600 bg-gray-800 text-white rounded p-2" />
                </div>
                <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">{editingProductId ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={resetForm} className="mt-4 ml-2 bg-gray-600 text-white py-2 px-4 rounded">Reset</button>
                   </form>

            <h2 className="text-xl font-bold mb-4">Product List</h2>
            <table className="min-w-full bg-gray-800 border border-gray-600">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} className="hover:bg-gray-700">
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">${product.price}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => editProduct(product)} className="bg-yellow-500 text-black px-2 py-1 rounded">Edit</button>
                                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className="bg-gray-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-white">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    className="bg-gray-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="mt-2 text-center text-white">
                Total Products: {totalProducts}
            </div>
        </div>
    );
};

export default Admin;