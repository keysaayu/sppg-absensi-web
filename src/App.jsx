import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffAttendance from './pages/StaffAttendance';
import AdminDashboard from './pages/AdminDashboard';
import { initialStaffList, initialAttendanceLogs } from './data/staffData';

export default function App() {
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('sppg_staff_list_v2');
    return saved ? JSON.parse(saved) : initialStaffList;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('sppg_attendance_logs_v2');
    return saved ? JSON.parse(saved) : initialAttendanceLogs;
  });

  useEffect(() => {
    localStorage.setItem('sppg_staff_list_v2', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('sppg_attendance_logs_v2', JSON.stringify(logs));
  }, [logs]);

  const handleAddAttendance = (newLog) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteAttendance = (id) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddStaff = (newStaff) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleEditStaff = (updatedStaff) => {
    setStaffList((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleDeleteStaff = (id) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<StaffAttendance staffList={staffList} onRecordAttendance={handleAddAttendance} />} 
      />
      <Route 
        path="/admin" 
        element={
          <AdminDashboard 
            staffList={staffList} 
            logs={logs} 
            onRecordAttendance={handleAddAttendance}
            onDeleteAttendance={handleDeleteAttendance}
            onAddStaff={handleAddStaff}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        } 
      />
    </Routes>
  );
}
