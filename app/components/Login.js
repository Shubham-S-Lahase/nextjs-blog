'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/withAuth';
import { useTheme } from '@/lib/ThemeContext';

function Login({ auth, onSuccess }) {
    const { login } = auth;
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { theme } = useTheme();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: isAdmin ? 'admin@example.com' : formData.email,
            password: formData.password,
        };

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
            await login(data.token);
            onSuccess();
            router.push('/');
        } else {
            setMessage(`Error: ${data.message}`);
        }
    };

    return (
        <div
            className={`max-w-md mx-auto p-8 rounded-lg shadow-lg transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
        >
            <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
                Welcome Back
            </h2>
            <p className="text-center text-sm mb-4 text-gray-500 dark:text-gray-400">
                Please login to your account to continue
            </p>
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setIsAdmin(false)}
                    className={`p-3 rounded-lg font-semibold transition-colors duration-300 ${
                        !isAdmin
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    } ${
                        theme === 'dark' ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                    }`}
                >
                    User Login
                </button>
                <button
                    onClick={() => setIsAdmin(true)}
                    className={`p-3 rounded-lg font-semibold transition-colors duration-300 ${
                        isAdmin
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    } ${
                        theme === 'dark' ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                    }`}
                >
                    Admin Login
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder={isAdmin ? 'admin@example.com' : 'Email'}
                    className={`w-full p-3 border rounded-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 ${
                        theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-600'
                    }`}
                    value={isAdmin ? 'admin@example.com' : formData.email}
                    onChange={handleInputChange}
                    readOnly={isAdmin}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`w-full p-3 border rounded-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 ${
                        theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-600'
                    }`}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className={`w-full bg-blue-500 text-white font-bold px-4 py-3 rounded-lg transition-transform duration-300 transform ${
                        theme === 'dark' ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                    } active:scale-95`}
                >
                    Login
                </button>
            </form>
            {message && (
                <p
                    className={`mt-4 text-center text-sm ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default withAuth(Login);