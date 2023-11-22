import React, { useState } from 'react';
import './leave.css';
import axios from 'axios';

const LeaveApplicationForm = () => {

  var token = Math.floor(Math.random() * 100000000000);

  // Format the token as a string with leading zeros
  var formattedToken = String(Math.floor(Math.random() * 100000000000)).padStart(11, '0');

  // Concatenate the prefix 'sg-' with the formatted token
  var token = 'sg-' + formattedToken;


  const initialFormData = {
    employeeName: '',
    startDate: '',
    endDate: '',
    leaveCategory: '',
    additionalExplanation: '',
    token:{token},
    sent: false
  };


  const [formData, setFormData] = useState(initialFormData);
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };  
  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:8800/leave/application', formData)
      .then((response) => {
        console.log(response.data);
        return axios.post('http://localhost:8800/send_email', formData);
      })
      .then((response) => {
        console.log(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          sent: true
        }));
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        resetForm(); // Clear the form after submission
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const isDateValid = () => {
    const currentDate = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    return startDate >= currentDate && endDate >= startDate;
  };

  return (
    <div className='leave-form-container'>
      <h2>Leave Application Form</h2>
      {showNotification && <div className='msg'>Leave Request Sent!</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name:</label>
          <input
            type='text'
            name='employeeName'
            value={formData.employeeName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Start Date of Leave:</label>
          <input
            type='date'
            name='startDate'
            value={formData.startDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]} // Set min attribute to current date
          />
        </div>
        <div>
          <label>End Date of Leave:</label>
          <input
            type='date'
            name='endDate'
            value={formData.endDate}
            onChange={handleInputChange}
            required
            min={formData.startDate} // Set min attribute to the selected start date
          />
          <input
            type='hidden'
            name='token'
            value={token}
          />
        </div>
        <div>
          <label>Leave Category:</label>
          <select
            name='leaveCategory'
            value={formData.leaveCategory}
            onChange={handleInputChange}
            required
          >
            <option value=''>Select a category</option>
            <option value='sick leave'>Sick Leave</option>
            <option value='maternity leave'>Maternity Leave</option>
            <option value='annual leave'>Annual Leave</option>
            <option value='compassionate leave'>Compassionate Leave</option>
            <option value='parental leave'>Parental Leave</option>
            <option value='medical appointment'>Medical Appointment</option>
            <option value='study leave'>Study Leave</option>
          </select>
        </div>
        <div>
          <label>Additional Explanation:</label>
          <textarea
            name='additionalExplanation'
            value={formData.additionalExplanation}
            onChange={handleInputChange}
          />
        </div>
        <button type='submit' disabled={!isDateValid()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;
