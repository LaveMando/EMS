//logout
import React, { useEffect } from 'react';
// import { useHistory } from 'react-router-dom';

const Logout = () => {
  // const history = useHistory();

  // useEffect(() => {
  //   // Clear any stored tokens or user data 
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('userData');

  //   // Redirect the user to the login page after logging out
  //   history.push('/login');
  // }, [history]);

  return (
    <div>
      <h2>Logout</h2>
      <p>You have been logged out.</p>
    </div>
  );
};

export default Logout;
