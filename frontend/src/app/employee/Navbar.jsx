'use client';
import Link from 'next/link';

const EmployeeNavbar = () => (
  <nav className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between shadow">
    <div className="font-bold text-lg tracking-wide flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="inline-block w-6 h-6 text-white"
      >
        <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
        <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
      </svg>
      Workforce Watch
    </div>
    <div className="flex gap-6 items-center">
      <Link href="/employee/dashboard" className="hover:text-blue-200 font-medium">Dashboard</Link>
      
      <Link href="/employee/session-manager" className="hover:text-blue-200 font-medium">Session Manager</Link>
      <button
        onClick={() => {
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_id');
          window.location.href = '/user-login';
        }}
        className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 font-semibold"
      >
        Logout
      </button>
    </div>
  </nav>
);

export default EmployeeNavbar;