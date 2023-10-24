CREATE DATABASE employee_management
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  on_leave BOOLEAN,
  department VARCHAR(255)
);
 