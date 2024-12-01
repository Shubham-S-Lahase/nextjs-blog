// Register.js
'use client'

import { useState } from "react";
import Image from "next/image";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fileUrl: "",
    });
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
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
            setError("Please select a file to upload.");
            return;
        }
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            const cloudinaryUrl = data.secure_url;

            setUploadedImageUrl(cloudinaryUrl);
            setFormData((prevData) => ({
                ...prevData,
                fileUrl: cloudinaryUrl,
            }));
        } catch (error) {
            console.error("Upload error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (res.ok) {
            setMessage("Registration successful!");
        } else {
            setMessage(`Error: ${result.message}`);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <div className="max-w-md mx-auto mt-10">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-4 p-2 w-full border rounded"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {uploadedImageUrl && (
                        <div className="mt-4">
                            <p className="mb-2">Uploaded Image:</p>
                            <Image
                                src={uploadedImageUrl}
                                alt="Uploaded"
                                width={200}
                                height={200}
                                layout="responsive"
                                className="max-w-full rounded shadow"
                            />
                        </div>
                    )}
                </div>
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
                    Register
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}