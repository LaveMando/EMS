import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    // const [values, setValues] = useState({
    //     email: '',
    //     password: ''
    // })

    const [email,setEmail] = useState("");
    const [password, setPassowrd] = useState("");

    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = async (event) => {
        event.preventDefault()
        axios
          .post("http://localhost:8800/admin", { email, password })
          .then((res) => {
            console.log(res);
            if(res.data === "Login Successful"){
                navigate("/dashboard")
            }
            else{
             console.log("Not working")   
            }
            // navigate("/dashoboard");
          })
          .catch((err) => {
            console.log(err);
            // navigate("/");
            // Handle the error here, such as displaying an error message to the user
          });
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm'>
            <div className='text-warning'>
                {error && error}
            </div>
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email:</strong></label>
                    <input  name='email' autoComplete='off' placeholder='Enter Email'
                     onChange={(e) => setEmail(e.target.value)} className='form-control rounded-0'/>
                </div>
                <div className='mb-3'> 
                    <label htmlFor="password"><strong>Password:</strong></label>
                    <input type="password" name='password' placeholder='Enter Password'
                     onChange={(e) => setPassowrd(e.target.value)} className='form-control rounded-0'/>
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
                <div className='mb-1'> 
                    <input type="checkbox" name="tick" id="tick" className='me-2'/>
                    <label htmlFor="password">You are Agree with terms & conditions</label>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login
