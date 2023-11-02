//Employeedashboard.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Resources from './Resources';
import KnowledgeBase from './KnowledgeBase';
import LeaveApplicationForm from './LeaveApplicationForm';
import Logout from './Logout';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard-container">
      <h1>Employee Dashboard</h1>
      <ul>
        <li>
          <Link to="/resources">Resources</Link>
        </li>
        <li>
          <Link to="/knowledge_base">Knowledge Base</Link>
        </li>
        <li>
          <Link to="/leave_application">Leave Application Form</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default EmployeeDashboard;
