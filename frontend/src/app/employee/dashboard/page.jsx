'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('employee_token') : null;
    if (!token) {
      setLoading(false);
      setTasks([]);
      return;
    }
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/task/getbyemployee`, {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">My Tasks</h2>
        {loading ? (
          <div className="text-center py-10 text-blue-600 font-semibold text-lg">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg">No tasks assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-blue-700">Title</th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-blue-700">Description</th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-blue-700">Status</th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-blue-700">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-3 border-b">{task.title}</td>
                    <td className="px-6 py-3 border-b">{task.description}</td>
                    <td className="px-6 py-3 border-b">
                      <select
                        value={task.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const token = typeof window !== 'undefined' ? localStorage.getItem('employee_token') : null;
                          try {
                            await axios.put(
                              `${process.env.NEXT_PUBLIC_API_URL}/task/updatestatus/${task._id}`,
                              { status: newStatus },
                              { headers: { 'x-auth-token': token } }
                            );
                            setTasks((prev) =>
                              prev.map((t) =>
                                t._id === task._id ? { ...t, status: newStatus } : t
                              )
                            );
                            toast.success('Task status updated!');
                          } catch {
                            toast.error('Failed to update status');
                          }
                        }}
                        className={
                          "rounded px-2 py-1 " +
                          (task.status === 'Completed'
                            ? 'text-green-600 font-semibold'
                            : task.status === 'In Progress'
                            ? 'text-yellow-600 font-semibold'
                            : 'text-red-600 font-semibold')
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 border-b">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;