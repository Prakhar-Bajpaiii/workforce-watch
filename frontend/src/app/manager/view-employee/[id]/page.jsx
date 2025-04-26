import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`/api/employees/${id}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!employee) return <p>Loading employee details...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default ViewEmployee;
