'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/withAuth';

function Login({ auth }) {
  const { login } = auth;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      // localStorage.setItem('token', data.token);
      await login(data.token)
      // console.log(data.token);
      login(data.token);
      router.push('/');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleInputChange}
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