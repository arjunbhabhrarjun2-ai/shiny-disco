'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('auth_token', token);
      router.push('/aK3m9Xq/pZ2vR7nL4wQ1fB/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-white text-2xl font-bold mb-6">Admin Panel</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-800 text-white rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-800 text-white rounded"
        />
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button onClick={handleLogin} className="w-full py-3 bg-blue-600 text-white rounded font-bold">
          Enter
        </button>
      </div>
    </div>
  );
}
