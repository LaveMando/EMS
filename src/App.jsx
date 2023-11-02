import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Resources from './components/Resources';
import KnowledgeBase from './components/KnowledgeBase';
import LeaveApplicationForm from './components/LeaveApplicationForm';
import Logout from './components/Logout';
import Start from './components/Start';
import EmployeeLogin from './components/EmployeeLogin';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route exact path="/dashboard" element={<AdminDashboard />} />
        <Route exact path='/employeeDash' element={<EmployeeDashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/knowledge_base" element={<KnowledgeBase />} />
        <Route exact path="/leave_application" element={<LeaveApplicationForm />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
