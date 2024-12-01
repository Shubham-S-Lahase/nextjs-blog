'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/withAuth';

function Login({ auth, onSuccess }) {
    const { login } = auth;
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If admin login is selected, override the email in formData
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
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold">Login</h2>
            <div className="flex space-x-4 mb-4">
                <button onClick={() => setIsAdmin(false)} className={`p-2 ${!isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    User Login
                </button>
                <button onClick={() => setIsAdmin(true)} className={`p-2 ${isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Admin Login
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder={isAdmin ? "admin@example.com" : "Email"}
                    className="w-full p-2 border rounded"
                    value={isAdmin ? 'admin@example.com' : formData.email}
                    onChange={handleInputChange}
                    readOnly={isAdmin} // Make it read-only if admin
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Login
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default withAuth(Login);