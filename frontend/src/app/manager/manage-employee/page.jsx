'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageEmployee = () => {
  const [employeeList, setEmployeeList] = useState([]);

  const fetchEmployeeData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('manager') : null;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/employee/getbymanager`,
        { headers: { 'x-auth-token': token } }
      );
      setEmployeeList(res.data);
    } catch (error) {
      toast.error('Failed to fetch employee data');
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const deleteEmployee = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employee/delete/` + id)
      .then(() => {
        toast.success('Employee Deleted Successfully');
        fetchEmployeeData();
      }).catch(() => {
        toast.error('Failed to delete employee');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">Manage Employees</h2>
          <Link
            href="/manager/add-employee"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add Employee
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="px-4 py-3 border-b text-left">ID</th>
                <th className="px-4 py-3 border-b text-left">Name</th>
                <th className="px-4 py-3 border-b text-left">Email</th>
                <th className="px-4 py-3 border-b text-left">Team</th>
                <th className="px-4 py-3 border-b text-left">Created At</th>
                <th className="px-4 py-3 border-b text-left" colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employeeList.map((employee) => (
                  <tr key={employee._id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 border-b">{employee._id}</td>
                    <td className="px-4 py-3 border-b">{employee.name}</td>
                    <td className="px-4 py-3 border-b">{employee.email}</td>
                    <td className="px-4 py-3 border-b">{employee.team}</td>
                    <td className="px-4 py-3 border-b">{new Date(employee.createdAt).toLocaleDateString()}</td>
                    <td className="px-2 py-3 border-b">
                      <button
                        onClick={() => deleteEmployee(employee._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-2 py-3 border-b">
                      <Link
                        href={'/update-employee/' + employee._id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                      >
                        Update
                      </Link>
                    </td>
                    <td className="px-2 py-3 border-b">
                      <Link
                        href={'/manager/view-employee/' + employee._id}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployee;