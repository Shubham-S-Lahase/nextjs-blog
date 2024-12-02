'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/lib/ThemeContext';

export default function Register() {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fileUrl: '',
    });
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const cloudinaryUrl = data.secure_url;

            setUploadedImageUrl(cloudinaryUrl);
            setFormData((prevData) => ({
                ...prevData,
                fileUrl: cloudinaryUrl,
            }));
        } catch (error) {
            console.error('Upload error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (res.ok) {
            setMessage('Registration successful!');
        } else {
            setMessage(`Error: ${result.message}`);
        }
    };

    return (
        <div
            className={`max-w-md mx-auto p-8 rounded-lg shadow-lg transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
        >
            <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
                Create an Account
            </h2>
            <p className="text-center text-sm mb-4 text-gray-500 dark:text-gray-400">
                Join us by creating your account
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={`w-full p-3 border rounded-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 ${
                        theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-600'
                    }`}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`w-full p-3 border rounded-lg transition-colors duration-300 ${
                        theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 ${
                        theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-600'
                    }`}
                    onChange={handleInputChange}
                />
                <div className="space-y-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className={`w-full p-3 border rounded-lg transition-colors duration-300 ${
                            theme === 'dark'
                                ? 'bg-gray-800 text-white border-gray-700'
                                : 'bg-white text-gray-900 border-gray-300'
                        }`}
                    />
                    <button
                        onClick={handleUpload}
                        type="button"
                        disabled={!file || uploading}
                        className={`w-full px-4 py-3 rounded-lg transition-transform duration-300 transform ${
                            uploading
                                ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
                                : theme === 'dark'
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        } active:scale-95`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {error && (
                        <p className={`text-sm text-center mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                            {error}
                        </p>
                    )}
                    {uploadedImageUrl && (
                        <div className="mt-4 text-center">
                            <p className="text-sm mb-2">Uploaded Image:</p>
                            <Image
                                src={uploadedImageUrl}
                                alt="Uploaded"
                                width={150}
                                height={150}
                                className="mx-auto rounded shadow-lg"
                            />
                        </div>
                    )}
                </div>
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
                    className={`w-full bg-blue-500 text-white px-4 py-3 rounded-lg transition-transform duration-300 transform ${
                        theme === 'dark' ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                    } active:scale-95`}
                >
                    Register
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
