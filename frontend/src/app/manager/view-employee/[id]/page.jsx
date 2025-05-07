'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'sessions'
  
  // Manager authentication token
  const token = typeof window !== 'undefined' ? localStorage.getItem('manager') : null;

  // Fetch data on component load
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // console.log(token);
      
      
      // Create promises for all initial data requests
      const fetchPromises = [
        // Get employee details
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/getbyid/${id}`, {
          headers: { 'x-auth-token': token }
        }),
        
        // Get employee tasks
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/task/getbyemployee/${id}`, {
          headers: { 'x-auth-token': token }
        }),
        
        // Get employee sessions
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/employee/${id}`, {
          headers: { 'x-auth-token': token }
        })
      ];
      
      // Execute all requests in parallel
      Promise.all(fetchPromises)
        .then(([employeeRes, tasksRes, sessionsRes]) => {
          setEmployee(employeeRes.data);
          setTasks(tasksRes.data);
          setSessions(sessionsRes.data);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          toast.error('Failed to load employee data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, token]);

  // Delete session handler
  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`, {
        headers: { 'x-auth-token': token }
      });
      
      // Remove deleted session from state
      setSessions(sessions.filter(session => session._id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to calculate session duration
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const diff = Math.abs(endTime - startTime);
    const hours = Math.floor(diff / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    return `${hours}h ${minutes}m`;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-blue-600 font-semibold text-lg">Loading employee details...</span>
          </div>
        </div>
      </div>
    );
  }

  // No employee found
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <span className="text-red-600 font-semibold text-lg">Employee not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-8">
      <div className="container mx-auto max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
        {/* Employee Header */}
        <div className="mb-8">
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
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sessions
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'tasks' ? (
          <>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Assigned Tasks</h3>
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
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Session History</h3>
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 hover:bg-blue-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center">
                          <span className="text-lg font-medium">{formatDate(session.loginTime)}</span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            session.logoutTime ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.logoutTime ? 'Completed' : 'Active'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Duration: {calculateDuration(session.loginTime, session.logoutTime)}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSession(session._id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {/* Session Details */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Time Details</h4>
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          <div className="flex">
                            <span className="text-gray-600 w-20">Login:</span> 
                            <span>{new Date(session.loginTime).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-600 w-20">Logout:</span> 
                            <span>{session.logoutTime ? new Date(session.logoutTime).toLocaleTimeString() : 'Active'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-600 w-20">Date:</span> 
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recordings */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Recordings</h4>
                        <div className="space-y-2">
                          {/* Screen Recordings */}
                          <div>
                            <div className="flex items-center text-xs text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Screen: {session.screenRecordings?.length || 0}
                            </div>
                            {session.screenRecordings?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {session.screenRecordings.map((recording, idx) => (
                                  <a 
                                    key={`screen-${idx}`} 
                                    href={recording.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-50 p-1 rounded flex items-center hover:bg-blue-100"
                                  >
                                    <span className="truncate">View #{idx + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Audio Recordings */}
                          <div>
                            <div className="flex items-center text-xs text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                              Audio: {session.audioRecordings?.length || 0}
                            </div>
                            {session.audioRecordings?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {session.audioRecordings.map((recording, idx) => (
                                  <a 
                                    key={`audio-${idx}`} 
                                    href={recording.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-50 p-1 rounded flex items-center hover:bg-blue-100"
                                  >
                                    <span className="truncate">Listen #{idx + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500 text-center">No session history for this employee.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewEmployee;