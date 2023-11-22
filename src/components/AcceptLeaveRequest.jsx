import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AcceptLeaveRequest = () => {
  const { id } = useParams();
  const [leaveRequest, setLeaveRequest] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8800/accept/${id}`)
      .then((response) => {
        setLeaveRequest(response.data.details);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, [id]);

  return (
    <div style={{ color: 'white'}}>
      <h1>Leave Request Accepted</h1>
      <p>The leave request with token {id} has been accepted.</p>
      {leaveRequest && (
        <div>
          <p>Employee Name: {leaveRequest.employeeName}</p>
          <p>Start Date: {leaveRequest.startDate}</p>
          <p>End Date: {leaveRequest.endDate}</p>
          <p>Leave Category: {leaveRequest.leaveCategory}</p>
          <p>Additional Explanation: {leaveRequest.additionalExplanation}</p>
        </div>
      )}
    </div>
  );
};

export default AcceptLeaveRequest;