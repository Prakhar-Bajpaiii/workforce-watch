'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import * as Yup from 'yup'

function signup() {
const router = useRouter()

  const LoginSchema = Yup.object().shape({
    email : Yup.string()
    .email('Please enter a valid emil address' )
    .required('Email is Required'),


    name : Yup.string()
    
    .required(' enter your name'),
  
    password: Yup.string()
    .min(8,'password must contain at least 8 characters')
    .matches(/[a-z]/,'password must contain at least one lowercase')
    .matches(/[A-Z]/,'password must contain at least one uppercase')
    .matches(/[\d]/,'password must contain at least one number')
    .required('password is required')
  })

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
      console.log('Form submitted:', values); // Add this to debug
      // console.log(`${NEXT_PUBLIC_API_URL}/addemployee/add`);
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/add`, values, {
        headers: {
          'x-auth-token': localStorage.getItem('manager'),
        }
      })
        .then((result) => {
          toast.success('User Registered Successfully');
          router.push('/manager/manage-employee');
        }).catch((err) => {
          toast.error('Something went wrong');
        });
    },
    // validationSchema: LoginSchema
    
  });



  return (
    <div className='object-cover w-full' style={{ backgroundImage: ` url('')` }}>
      <div className='max-w-sm mx-auto py-10'  >

        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Add Employee
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Already have an account?
                <a
                  className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                  href="../examples/html/signin.html"
                >
                  Sign in here
                </a>
              </p>
            </div>
            <div className="mt-5">
             
              {/* Form */}
              <form onSubmit={signupForm.handleSubmit}>
                <div className="grid gap-y-4">
                  {/* Form Group */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.name}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                        onChange={signupForm.handleChange}
                        value={signupForm.values.email}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                      { signupForm.errors.email &&  signupForm.touched.email ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.email }</div>
              ):null}
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
                    <label
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Contact
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="contact"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.contact}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Shift
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="shift"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.shift}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Designation
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="designation"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.designation}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Worklocation
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="worklocation"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.worklocation}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                      htmlFor="name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Team
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="team"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.team}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="email-error"
                      />
                       { signupForm.errors.name &&  signupForm.touched.name ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.name }</div>
              ):null}
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
                      htmlFor="password"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Password
                    </label>


                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        onChange={signupForm.handleChange}
                        value={signupForm.values.password}
                        className="py-3 px-4 block w-full border-2 border-gray-200  rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required=""
                        aria-describedby="password-error"
                      />
                      {signupForm.errors.password &&  signupForm.touched.password ?(
                <div className='text-red-500 text-sm'>{ signupForm.errors.password }</div>
              ):null}
            
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
                    Enter
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

export default signup;