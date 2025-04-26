'use client';
// import useUserContext from '@/Context/userContext';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

const Login = () => {

    // const { setUserLoggedIn } = useUserContext()
    const router = useRouter()
    const loginForm = useFormik({
        initialValues: {
          name: '', 
            email: '',
            password: '',
            designation: '',
            shift: '',
            workloaction: '',
            team: '',
        },
        onSubmit: (values) => {
            console.log(values);
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}`,values)
            .then((res) => {
                toast.success('Login Successfull');
                // setUserLoggedIn(true)
                // setUserLoggedIn(data)
                const data = res.data
                localStorage.setItem('user',JSON.stringify(data))
                document.cookie = "token="+data._id
                router.push('/')
                
            }).catch((err) => {
                console.log(err);
                toast.error('Login Failed');
            });
        }
    })

    return (
        <div className='object-contain w-full ' style={{ backgroundImage: ` url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fvector%2Femployee-working-from-home-remote-job-using-personal-computer-or-laptop-for-tasks-gm1295687974-389340234&psig=AOvVaw3q_CcJuZY7ogumPdFXJuVA&ust=1740996793318000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPC31sqU64sDFQAAAAAdAAAAABAE')` }}>
            <div className='max-w-sm mx-auto py-10' >

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
                           
                            {/* Form */}
                            <form onSubmit={loginForm.handleSubmit}>
                                <div className="grid gap-y-4">
                                    {/* Form Group */}
                                    <div>
                                        <label
                                            htmlFor="Name"
                                            className="block text-sm mb-2 dark:text-white"
                                        >
                                            Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                onChange={loginForm.handleChange}
                                                value={loginForm.values.name}
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                required=""
                                                aria-describedby="email-error"
                                            />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg
                                                    className="size-5 text-red-500"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                                            Please include a valid email address so we can get back to you
                                        </p>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm mb-2 dark:text-white"
                                        >
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                onChange={loginForm.handleChange}
                                                value={loginForm.values.email}
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                required=""
                                                aria-describedby="email-error"
                                            />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg
                                                    className="size-5 text-red-500"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                                            Please include a valid email address so we can get back to you
                                        </p>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="Name"
                                            className="block text-sm mb-2 dark:text-white"
                                        >
                                            Designation
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                onChange={loginForm.handleChange}
                                                value={loginForm.values.name}
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                required=""
                                                aria-describedby="email-error"
                                            />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg
                                                    className="size-5 text-red-500"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                                            Please include a valid email address so we can get back to you
                                        </p>
                                    </div>
                                    
                                    {/* End Form Group */}
                                    {/* Form Group */}
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label
                                                htmlFor="password"
                                                className="block text-sm mb-2 dark:text-white"
                                            >
                                                Password
                                            </label>
                                            <a
                                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                href="../examples/html/recover-account.html"
                                            >
                            
                                            </a>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="password"
                                                onChange={loginForm.handleChange}
                                                value={loginForm.values.password}
                                                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                required=""
                                                aria-describedby="password-error"
                                            />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg
                                                    className="size-5 text-red-500"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="password-error">
                                            8+ characters required
                                        </p>
                                    </div>
                                    {/* End Form Group */}
                                    {/* Checkbox */}
                                    
                                    {/* End Checkbox */}
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                            {/* End Form */}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}


export default Login;