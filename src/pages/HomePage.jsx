import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../recoil/atoms";

const HomePage = () => {
    const [email, setEmail] = useState("admin@supermarket.com");
    const [password, setPassword] = useState("SuperMarket@8080");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const setAuthToken = useSetRecoilState(authTokenState);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("/admin/auth/signin", {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("authToken", token);
            setAuthToken(token);

            navigate("/dashboard");
        } catch (error) {
            setError("Invalid credentials, please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
            >
                <div className="text-center mb-6">
                    <img src="/logo.png" alt="logo" className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                    <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
                    <p className="text-gray-600">Login to manage your e-commerce store</p>
                </div>
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <motion.div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </motion.div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 text-white font-medium rounded-md transition-transform ${isLoading
                            ? "bg-indigo-300 cursor-not-allowed"
                            : "bg-[#4CAF50] hover:bg-green-700"
                            }`}
                        whileHover={!isLoading ? { scale: 1.05 } : {}}
                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </motion.button>
                </motion.form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    By logging in, you agree to our{" "}
                    <a href="#" className="text-[#4CAF50] underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#44CAF50] underline">
                        Privacy Policy
                    </a>
                    .
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;
