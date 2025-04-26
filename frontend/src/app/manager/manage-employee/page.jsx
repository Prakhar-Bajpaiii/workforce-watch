'use client';
import axios from 'axios'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ManageEmployee = () => {

    const [employeeList, setemployeeList] = useState([]);

    const fetchemployeeData = async () => {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/employee/getall`);
        console.table(res.data);
        setUserList(res.data);
    }

    useEffect(() => {
        fetchemployeeData();
    }, []);

    const deleteEmployee = (id) => {
        axios.delete(   `${process.env.NEXT_PUBLIC_API_URL}/employee/delete/` + id)
            .then((result) => {
                toast.success('employee Deleted Successfully');
                fetchEmployeeData();
            }).catch((err) => {
                toast.error('Failed to delete employee');
            });
    }

    return (
        <div>

            <div className='container mx-auto'>
                <h2 className='text-center font-bold text-3xl my-6'>Manage Employee</h2>
                <table className='w-full'>
                    <thead className='border-y-2'>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>CreatedAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList.map((employee) => {
                                return (
                                    <tr key={employee._id}>
                                        <td>{employee._id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.city}</td>
                                        <td>{employee.createdAt}</td>
                                        <td>
                                            <button
                                                onClick={() => { deleteemployee(employee._id) }}
                                                className='bg-red-500 text-white px-2 py-1 rounded'
                                            >Delete</button>
                                        </td>
                                        <td>
                                            <Link
                                                href={'/update-employee/' + employee._id}
                                                className='bg-blue-500 text-white px-2 py-1 rounded'
                                            >Update</Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ManageEmployee;