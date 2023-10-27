//leave application form
import React, { useState } from 'react';
import './leave.css';

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    startDate: '',
    endDate: '',
    leaveCategory: '',
    additionalExplanation: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    axios.post('http://localhost:3000/send-email', formData)
      .then((response) => {
         console.log(response.data);
      }, (error) => {
         console.log(error);
      });
  };
  
  return (
    <div className='leave-form-container'>
      <h2>Leave Application Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Start Date of Leave:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>End Date of Leave:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Leave Category:</label>
          <select
            name="leaveCategory"
            value={formData.leaveCategory}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            <option value="sick leave">Sick Leave</option>
            <option value="maternity leave">Maternity Leave</option>
            <option value="annual leave">Annual Leave</option>
            <option value="compassionate leave">Compassionate Leave</option>
            <option value="parental leave">Parental Leave</option>
            <option value="medical appointment">Medical Appointment</option>
            <option value="study leave">Study Leave</option>
          </select>
        </div>
        <div>
          <label>Additional Explanation:</label>
          <textarea
            name="additionalExplanation"
            value={formData.additionalExplanation}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;
