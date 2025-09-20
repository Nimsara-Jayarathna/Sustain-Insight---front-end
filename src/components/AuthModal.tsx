import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // --- Login Handler ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any)['login-email'].value;
    const password = (e.target as any)['login-password'].value;

    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      console.log('Logged in user:', data);
      localStorage.setItem('token', data.token); // save JWT
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  // --- Signup Handler ---
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstName = (e.target as any)['signup-first-name'].value;
    const lastName = (e.target as any)['signup-last-name'].value;
    const jobTitle = (e.target as any)['signup-title'].value;
    const email = (e.target as any)['signup-email'].value;
    const password = (e.target as any)['signup-password'].value;

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, jobTitle, email, password }),
      });

      if (!res.ok) throw new Error('Signup failed');

      const data = await res.json();
      console.log('Signed up user:', data);
      localStorage.setItem('token', data.token); // save JWT
      alert('Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>

        {/* Login Form */}
        {isLoginView && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            <div className="mb-4">
              <label htmlFor="login-email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input id="login-email" type="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-6">
              <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input id="login-password" type="password" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Login</button>
            <p className="text-center mt-4">
              No account?{' '}
              <button type="button" className="text-green-600 hover:underline" onClick={() => setIsLoginView(false)}>Create one</button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {!isLoginView && (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <div className="mb-4">
              <label htmlFor="signup-first-name" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input id="signup-first-name" type="text" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="signup-last-name" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
              <input id="signup-last-name" type="text" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="signup-title" className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
              <input id="signup-title" type="text" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="signup-email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input id="signup-email" type="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-6">
              <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input id="signup-password" type="password" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Sign Up</button>
            <p className="text-center mt-4">
              Already have an account?{' '}
              <button type="button" className="text-green-600 hover:underline" onClick={() => setIsLoginView(true)}>Login</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
