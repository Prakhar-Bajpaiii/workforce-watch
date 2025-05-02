'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const employeeId = typeof window !== 'undefined' ? localStorage.getItem('employee_id') : null;
    if (!employeeId) {
      setLoading(false);
      setTasks([]);
      return;
    }
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/task/getbyemployee/${employeeId}`)
      .then((res) => setTasks(res.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
      {loading ? (
        <div className="text-center py-10">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No tasks assigned yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{task.title}</td>
                  <td className="px-4 py-2 border-b">{task.description}</td>
                  <td className="px-4 py-2 border-b">
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
                  <td className="px-4 py-2 border-b">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;