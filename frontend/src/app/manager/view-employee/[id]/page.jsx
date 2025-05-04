'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  // const token = typeof window !== 'undefined' ? localStorage.getItem('manager') : null;

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/getbyid/${id}`)
        .then((res) => setEmployee(res.data))
        .catch((err) => console.error('Error fetching employee details:', err));

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/task/getbyemployee/${id}`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.error('Error fetching tasks:', err));
    }
  }, [id]);
  

  if (!employee) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <span className="text-blue-600 font-semibold text-lg">Loading employee details...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Employee Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="mb-2"><span className="font-semibold text-gray-700">Name:</span> {employee.name}</p>
            <p className="mb-2"><span className="font-semibold text-gray-700">Email:</span> {employee.email}</p>
            <p className="mb-2"><span className="font-semibold text-gray-700">Designation:</span> {employee.designation}</p>
            <p className="mb-2"><span className="font-semibold text-gray-700">Team:</span> {employee.team}</p>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Link
              href={`/manager/add-task/${employee._id}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
            >
              + Add New Task
            </Link>
          </div>
        </div>
        <h3 className="text-xl font-bold text-blue-700 mt-8 mb-4">Assigned Tasks</h3>
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border px-4 py-2 text-left text-blue-700 font-semibold">Title</th>
                  <th className="border px-4 py-2 text-left text-blue-700 font-semibold">Description</th>
                  <th className="border px-4 py-2 text-left text-blue-700 font-semibold">Status</th>
                  <th className="border px-4 py-2 text-left text-blue-700 font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2">{task.title}</td>
                    <td className="border px-4 py-2">{task.description}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={
                          task.status === 'Completed'
                            ? 'text-green-600 font-semibold'
                            : task.status === 'In Progress'
                            ? 'text-yellow-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-500 text-center">No tasks assigned to this employee.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEmployee;