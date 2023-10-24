//Admindashboard.js
import React, { useState } from 'react';
import './style.css';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([
  ]);

  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    email: '',
    onLeave: false,
    department: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);

  const handleAddEmployee = () => {
    if (isEditing) {
      const updatedEmployees = employees.map(employee =>
        employee.id === editID ? newEmployee : employee
      );
      setEmployees(updatedEmployees);
      setNewEmployee({ id: '', name: '', email: '', onLeave: false, department: '' });
      setEditID(null);
      setIsEditing(false);
    } else {
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
      setNewEmployee({ id: '', name: '', email: '', onLeave: false, department: '' });
    }
  };

  const handleRemoveEmployee = (id) => {
    const updatedEmployees = employees.filter(employee => employee.id !== id);
    setEmployees(updatedEmployees);
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee(employee);
    setEditID(employee.id);
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  return (
    <div className='dashoard'>
      <h2>Admin Dashboard</h2>
      <h3>Employee Details</h3>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>
            {employee.name} | {employee.email} | {employee.department} | On Leave: {employee.onLeave ? 'Yes' : 'No'}
            <button onClick={() => handleRemoveEmployee(employee.id)}>Remove</button>
            <button onClick={() => handleEditEmployee(employee)}>Edit</button>
          </li>
        ))}
      </ul>
      <h3>{isEditing ? 'Edit Employee' : 'Add Employee'}</h3>
      <div>
        <input
          type="text"
          name="id"
          placeholder="Employee ID"
          value={newEmployee.id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Employee Email"
          value={newEmployee.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Employee Department"
          value={newEmployee.department}
          onChange={handleInputChange}
        />
        <label>On Leave: </label>
        <input
          type="checkbox"
          name="onLeave"
          checked={newEmployee.onLeave}
          onChange={() => setNewEmployee({ ...newEmployee, onLeave: !newEmployee.onLeave })}
        />
        <button onClick={handleAddEmployee}>{isEditing ? 'Edit Employee' : 'Add Employee'}</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
