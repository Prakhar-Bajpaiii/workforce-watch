'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageEmployee = () => {

    const [employeeList, setEmployeeList] = useState([]);

    const fetchEmployeeData = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/getall`);
            console.table(res.data); // Debugging: Log fetched data
            setEmployeeList(res.data);
        } catch (error) {
            console.error('Error fetching employee data:', error); // Debugging
            toast.error('Failed to fetch employee data');
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const deleteEmployee = (id) => {
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employee/delete/` + id)
            .then((result) => {
                toast.success('Employee Deleted Successfully');
                fetchEmployeeData(); // Refresh the employee list
            }).catch((err) => {
                console.error('Error deleting employee:', err); // Debugging
                toast.error('Failed to delete employee');
            });
    };

    return (
        <div>
            <div className='container mx-auto'>
                <h2 className='text-center font-bold text-3xl my-6'>Manage Employees</h2>
                <table className='w-full'>
                    <thead className='border-y-2'>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Team</th>
                            <th>CreatedAt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employeeList.map((employee) => {
                                return (
                                    <tr key={employee._id}>
                                        <td>{employee._id}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.team}</td>
                                        <td>{employee.createdAt}</td>
                                        <td>
                                            <button
                                                onClick={() => { deleteEmployee(employee._id) }}
                                                className='bg-red-500 text-white px-2 py-1 rounded'
                                            >Delete</button>
                                        </td>
                                        <td>
                                            <Link
                                                href={'/update-employee/' + employee._id}
                                                className='bg-blue-500 text-white px-2 py-1 rounded'
                                            >Update</Link>
                                        </td>
                                        <td>
                                            <Link
                                                href={'/manager/view-employee/' + employee._id}
                                                className='bg-green-500 text-white px-2 py-1 rounded'
                                            >View</Link>
                                        </td>
                                        
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEmployee;