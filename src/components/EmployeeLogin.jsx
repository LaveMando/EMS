// Import necessary components and libraries
import React, { useState } from 'react';
import './style.css'; // Import custom styles
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom for navigation

// Define the EmployeeLogin functional component
const EmployeeLogin = () => {
    // Define state variables using useState hook
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null); // State for handling error messages
    const navigate = useNavigate(); // Initialize the useNavigate hook
    axios.defaults.withCredentials = true; // Set axios to send credentials along with requests

    // Define the handleSubmit function for form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Send a POST request to the server to authenticate the employee
        axios.post('http://localhost:3000/employee/login', values)
            .then(result => {
                // If the login is successful, set a flag in localStorage and navigate to EmployeeDashboard
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/EmployeeDashboard/'); // Navigate to the EmployeeDashboard with the employee's ID
                } else {
                    setError(result.data.Error); // If there is an error, set the error state with the error message
                }
            })
            .catch(err => console.log(err)); // Log any potential errors to the console
    };

    // Return the JSX for the login page
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-warning'>
                    {error && error} {/* Display the error message if it exists */}
                </div>
                <h2>Login Page</h2>
                {/* Create a form with inputs for email and password */}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        {/* Input field for email */}
                        <input
                            type="email"
                            name='email'
                            autoComplete='off'
                            placeholder='Enter Email'
                            onChange={(e) => setValues({...values, email: e.target.value})}
                            className='form-control rounded-0'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        {/* Input field for password */}
                        <input
                            type="password"
                            name='password'
                            placeholder='Enter Password'
                            onChange={(e) => setValues({...values, password: e.target.value})}
                            className='form-control rounded-0'
                        />
                    </div>
                    {/* Submit button for the form */}
                    <button className='btn btn-success w-100 rounded-0 mb-2' type="submit">Log in</button> {/* Set the button type to submit */}
                    <div className='mb-1'>
                        {/* Checkbox for terms and conditions */}
                        <input type="checkbox" name="tick" id="tick" className='me-2' />
                        <label htmlFor="password">You Agree with terms & conditions</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Export the EmployeeLogin component
export default EmployeeLogin;
