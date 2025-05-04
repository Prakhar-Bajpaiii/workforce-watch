'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [employee, setEmployee] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('employee_token') : null;

  // Fetch employee details
  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/profile`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => setEmployee(res.data))
      .catch(() => setEmployee(null));
  }, [token]);

  // Fetch sessions
  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/my`, {
      headers: { 'x-auth-token': token }
    }).then(res => setSessions(res.data));
  }, [token, activeSession]);

  // Start session
  const startSession = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/session/create`, {}, {
        headers: { 'x-auth-token': token }
      });
      setActiveSession(res.data);
      toast.success('Session started!');
    } catch {
      toast.error('Failed to start session');
    }
  };

  // End session
  const endSession = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/session/update/${activeSession._id}`, {
        logoutTime: new Date()
      }, {
        headers: { 'x-auth-token': token }
      });
      setActiveSession(null);
      toast.success('Session ended!');
    } catch {
      toast.error('Failed to end session');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Session Manager</h2>
      {employee && (
        <div className="mb-6 p-4 bg-blue-50 rounded shadow">
          <div className="font-semibold text-blue-700 mb-1">Employee Details</div>
          <div><b>Name:</b> {employee.name}</div>
          <div><b>Email:</b> {employee.email}</div>
          <div><b>Designation:</b> {employee.designation}</div>
          <div><b>Team:</b> {employee.team}</div>
        </div>
      )}
      {!activeSession ? (
        <button onClick={startSession} className="px-4 py-2 bg-blue-600 text-white rounded">Start Session</button>
      ) : (
        <button onClick={endSession} className="px-4 py-2 bg-red-600 text-white rounded">End Session</button>
      )}
      <h3 className="mt-8 mb-2 font-semibold">My Sessions</h3>
      <ul>
        {sessions.map(s => (
          <li key={s._id} className="mb-2 border-b pb-2">
            <div>Date: {new Date(s.date).toLocaleDateString()}</div>
            <div>Login: {new Date(s.loginTime).toLocaleTimeString()}</div>
            <div>Logout: {s.logoutTime ? new Date(s.logoutTime).toLocaleTimeString() : 'Active'}</div>
            <div>Status: {s.status}</div>
            <div>Screen Recordings: {s.screenRecordings.length}</div>
            <div>Video Recordings: {s.videoRecordings.length}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionManager;