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
      .required('Password is required'),
    contact: Yup.string().required('Contact is required'),
    shift: Yup.string().required('Shift is required'),
    worklocation: Yup.string().required('Work location is required'),
    team: Yup.string().required('Team is required'),
    designation: Yup.string().required('Designation is required'),
  });

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      contact: '',
      shift: '',
      worklocation: '',
      team: '',
      designation: '',
    },
    onSubmit: (values) => {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/add`, values, {
        headers: {
          'x-auth-token': localStorage.getItem('manager'),
        }
      })
        .then(() => {
          toast.success('User Registered Successfully');
          router.push('/manager/manage-employee');
        }).catch(() => {
          toast.error('Something went wrong');
        });
    },
    validationSchema: LoginSchema
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Add Employee</h1>
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a
              className="text-blue-600 hover:underline font-medium"
              href="/manager/manage-employee"
            >
              Manage Employees
            </a>
          </p>
        </div>
        <form onSubmit={signupForm.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              onChange={signupForm.handleChange}
              value={signupForm.values.name}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.name && signupForm.touched.name && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              onChange={signupForm.handleChange}
              value={signupForm.values.email}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.email && signupForm.touched.email && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              onChange={signupForm.handleChange}
              value={signupForm.values.contact}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.contact && signupForm.touched.contact && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.contact}</div>
            )}
          </div>
          <div>
            <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>
            <input
              type="text"
              id="shift"
              onChange={signupForm.handleChange}
              value={signupForm.values.shift}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.shift && signupForm.touched.shift && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.shift}</div>
            )}
          </div>
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              id="designation"
              onChange={signupForm.handleChange}
              value={signupForm.values.designation}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.designation && signupForm.touched.designation && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.designation}</div>
            )}
          </div>
          <div>
            <label htmlFor="worklocation" className="block text-sm font-medium text-gray-700 mb-1">
              Work Location
            </label>
            <input
              type="text"
              id="worklocation"
              onChange={signupForm.handleChange}
              value={signupForm.values.worklocation}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.worklocation && signupForm.touched.worklocation && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.worklocation}</div>
            )}
          </div>
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <input
              type="text"
              id="team"
              onChange={signupForm.handleChange}
              value={signupForm.values.team}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.team && signupForm.touched.team && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.team}</div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={signupForm.handleChange}
              value={signupForm.values.password}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {signupForm.errors.password && signupForm.touched.password && (
              <div className="text-red-500 text-sm mt-1">{signupForm.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;