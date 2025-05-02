'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct hook for dynamic routes in the app directory
import axios from "axios";
import Link from "next/link";

const ViewEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]); // State to store tasks

  useEffect(() => {
    if (id) {
      // Fetch employee details
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/getbyid/${id}`)
        .then((res) => setEmployee(res.data))
        .catch((err) => console.error('Error fetching employee details:', err));

      // Fetch tasks assigned to the employee
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/task/getbyemployee/${id}`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.error('Error fetching tasks:', err));
    }
  }, [id]);

  if (!employee) return <p>Loading employee details...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Designation:</strong> {employee.designation}</p>
      <p><strong>Team:</strong> {employee.team}</p>
      <Link href={'/manager/add-task/' + employee._id} className="p-3 border bg-blue-500 p-2 m-10 text-white rounded">
        Add New Task
      </Link>

      <h3 className="text-xl font-bold mt-6">Assigned Tasks</h3>
      {tasks.length > 0 ? (
        <table className="w-full mt-4 border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No tasks assigned to this employee.</p>
      )}
    </div>
  );
};

export default ViewEmployee;