'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

function Signup() {
  const router = useRouter();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    name: Yup.string()
      .required('Enter your name'),
    password: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase')
      .matches(/[\d]/, 'Password must contain at least one number')
      .required('Password is required')
  });

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    onSubmit: (values) => {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values)
        .then(() => {
          toast.success('User Registered Successfully');
          router.push('/user-login');
        }).catch(() => {
          toast.error('Something went wrong');
        });
    },
    validationSchema: LoginSchema
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80')`
      }}
    >
      <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/90 dark:bg-neutral-900 rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2">Sign Up</h1>
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Already have an account?{' '}
              <a
                className="text-blue-600 hover:underline font-medium"
                href="/user-login"
              >
                Sign in here
              </a>
            </p>
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 mb-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 46 47" fill="none">
              <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
              <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
              <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
              <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
            </svg>
            Sign up with Google
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-400 text-xs uppercase">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <form onSubmit={signupForm.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                required
              />
              {signupForm.errors.name && signupForm.touched.name && (
                <div className='text-red-500 text-sm mt-1'>{signupForm.errors.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                required
              />
              {signupForm.errors.email && signupForm.touched.email && (
                <div className='text-red-500 text-sm mt-1'>{signupForm.errors.email}</div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                required
              />
              {signupForm.errors.password && signupForm.touched.password && (
                <div className='text-red-500 text-sm mt-1'>{signupForm.errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;