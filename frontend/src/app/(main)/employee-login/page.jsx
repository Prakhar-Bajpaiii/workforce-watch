'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/employee/authenticate`,
                form
            );
            if (res.data.token) {
                localStorage.setItem('employee_token', res.data.token);
                toast.success('Login successful!');
                router.push('/employee/dashboard'); // Change as needed
            } else {
                toast.error(res.data.message || 'Login failed');
            }
        } catch (err) {
            toast.error('Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className='object-contain w-full'>
            <div className='max-w-sm mx-auto py-10'>
                <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                                Employee Login
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                                Don't have an account yet?
                                <Link
                                    className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                    href="/user-signup"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            onChange={handleChange}
                                            value={form.email}
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            onChange={handleChange}
                                            value={form.password}
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;