import React, { useState, useEffect } from "react";
import axios from "axios";

const OnLeave = () => {
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8800/leave_application").then((response) => {
      setLeaveData(response.data);
    });
  }, []);

  const handleAccept = (id) => {
    axios.put(`http://localhost:8800/leave_application/${id}`, { status: 'Accepted' })
      .then((response) => {
        console.log(response.data);
        // Refresh the leave data
        fetchLeaveData();
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };
  
  const handleReject = (id) => {
    axios.put(`http://localhost:8800/leave_application/${id}`, { status: 'Rejected' })
      .then((response) => {
        console.log(response.data);
        // Refresh the leave data
        fetchLeaveData();
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const fetchLeaveData = () => {
  axios.get("http://localhost:8800/leave_application").then((response) => {
    setLeaveData(response.data);
  });
};

useEffect(() => {
  fetchLeaveData();
}, []);

  return (
    <div className="container">
      <h2>Employees on Leave</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Employee Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Leave Category</th>
            <th scope="col">Additional Explanation</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveData &&
            leaveData.map((item, index) => (
              <tr key={index}>
                <td>{item.employeeName}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.leaveCategory}</td>
                <td>{item.additionalExplanation}</td>
                <td>{item.status}</td>
                <td>
                 <button onClick={() => handleAccept(item.id)}>Accept</button>
                 <button onClick={() => handleReject(item.id)}>Reject</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnLeave;