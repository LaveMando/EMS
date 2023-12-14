from flask import Flask, render_template, request, redirect, url_for, session
from datetime import date
import pymysql
import pymysql.cursors
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

# Configure MySQL
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Sagehill#23',
    'db': 'leavems',
    'cursorclass': pymysql.cursors.DictCursor
}

connection = pymysql.connect(**config)

# Secret key for session management
app.secret_key = '6912cdfb191cec485c8eb4b9ab812aac'

#login route
@app.route('/login', methods=['GET', 'POST'])
def login():
   if request.method == 'POST':
       username = request.form['username']
       password = request.form['password']
       role = request.form['role']

       with connection.cursor() as cursor:
           # Execute the SQL query
           sql = "SELECT * FROM `login` WHERE `username`=%s AND `password`=%s AND `role`=%s"
           cursor.execute(sql, (username, password, role))
           result = cursor.fetchone()

       if result:
           session['logged_in'] = True
           session['username'] = username
           session['role'] = role
           if role == 'admin':
               return redirect(url_for('admin_dashboard'))
           else:
               return redirect(url_for('employee_dashboard'))
       else:
           return render_template('login.html', error='Invalid login credentials')

   return render_template('login.html')


#admin dashboard route after login
@app.route('/admin_dashboard')
def admin_dashboard():
    # Check if the user is logged in and is an admin
    if 'logged_in' in session and session['role'] == 'admin':
        return render_template('admin_dashboard.html')
    else:
        return redirect(url_for('login'))

#employee dashboard route after login
@app.route('/employee_dashboard')
def employee_dashboard():
    # Check if the user is logged in and is an employee
    if 'logged_in' in session and session['role'] == 'employee':
        return render_template('employee_dashboard.html')
    else:
        return redirect(url_for('login'))

#logout route
@app.route('/logout')
def logout():
    return 'You have been logged out'

#employee dashboard leave request form
@app.route('/leaveform')
def leaveform():
    return render_template('leaveform.html')
#submission of leave request form
@app.route('/submit_leave_request', methods=['POST'])
def submit_leave_request():
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    startDate = request.form['startDate']
    endDate = request.form['endDate']
    leaveCategory = request.form['leaveCategory']
    additionalExplanation = request.form['additionalExplanation']
    status = 'Pending'  # Set the initial status to 'Pending'
    dateOfRequest = date.today()  # Set the date of request to the current date

    with connection.cursor() as cursor:
         # Execute the SQL query
        sql = """
        INSERT INTO `leaverequests` (`firstName`, `lastName`, `dateOfRequest`, `startDate`, `endDate`, `leaveCategory`, `additionalExplanation`, `status`)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (firstName, lastName, dateOfRequest, startDate, endDate, leaveCategory, additionalExplanation, status))
        request_id = cursor.lastrowid  # Get the ID of the last inserted row
        connection.commit()

        # Prepare the email content
        subject = 'New Leave Request'
        message = f'{firstName} {lastName} has submitted a new leave request.\n\nStart Date: {startDate}\nEnd Date: {endDate}\nLeave Category: {leaveCategory}\nAdditional Explanation: {additionalExplanation}'
        recipient = 'lavemando@gmail.com'

        # Send the email
        send_email(subject, message, recipient, request_id)

        return redirect(url_for('employee_dashboard'))  # Redirect the user back to the employee dashboard
    return render_template('leaveform.html')
#function to send the email with accept and reject links
def send_email(subject, message, recipient, request_id):
    sender = 'ltmandoza@gmail.com'
    password = 'ogsz caxf rxer zphw'

    accept_link = f'http://localhost:5000/accept_leave_request/{request_id}'
    reject_link = f'http://localhost:5000/reject_leave_request/{request_id}'
    message += f'\n\nAccept: {accept_link}\nReject: {reject_link}'

    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender, password)
    server.send_message(msg)
    server.quit()

#route to accept the leave request and change status of the leave request
@app.route('/accept_leave_request/<int:request_id>')
def accept_leave_request(request_id):
   with connection.cursor() as cursor:
       # Execute the SQL query to update the status
       sql = "UPDATE `leaverequests` SET `status`='Accepted' WHERE `request_id`=%s"
       cursor.execute(sql, (request_id,))
       connection.commit()

       # Execute the SQL query to get the leave request details
       sql = "SELECT * FROM `leaverequests` WHERE `request_id`=%s"
       cursor.execute(sql, (request_id,))
       leave_request = cursor.fetchone()

   return render_template('leave_request_details.html', leave_request=leave_request)

#route to reject the leave request and change status of the leave request
@app.route('/reject_leave_request/<int:request_id>')
def reject_leave_request(request_id):
   with connection.cursor() as cursor:
       # Execute the SQL query to update the status
       sql = "UPDATE `leaverequests` SET `status`='Rejected' WHERE `request_id`=%s"
       cursor.execute(sql, (request_id,))
       connection.commit()

       # Execute the SQL query to get the leave request details
       sql = "SELECT * FROM `leaverequests` WHERE `request_id`=%s"
       cursor.execute(sql, (request_id,))
       leave_request = cursor.fetchone()

   return render_template('leave_request_details.html', leave_request=leave_request)

#admin dashboard display of employees on leave
@app.route('/employees_on_leave')
def employees_on_leave():
    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = "SELECT * FROM `leaverequests`"
        cursor.execute(sql)
        leave_requests = cursor.fetchall()

    return render_template('employees_on_leave.html', leave_requests=leave_requests)

#admin dashboard/ employee management
@app.route('/employee_management')
def employee_management():
    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = "SELECT * FROM `employees`"
        cursor.execute(sql)
        employees = cursor.fetchall()

    return render_template('employee_management.html', employees=employees)

@app.route('/add_employee', methods=['POST'])
def add_employee():
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    email = request.form['email']
    address = request.form['address']
    department = request.form['department']
    on_leave = 'on_leave' in request.form

    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = """
        INSERT INTO `employees` (`firstName`, `lastName`, `email`, `address`, `department`, `on_leave`)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (firstName, lastName, email, address, department, on_leave))
        connection.commit()

    return redirect(url_for('employee_management'))

@app.route('/edit_employee/<int:employee_id>', methods=['POST'])
def edit_employee(employee_id):
    print(request.form) 
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    email = request.form['email']
    address = request.form['address']
    department = request.form['department']

    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = """
        UPDATE `employees`
        SET `firstName`=%s, `lastName`=%s, `email`=%s, `address`=%s, `department`=%s
        WHERE `employee_id`=%s
        """
        cursor.execute(sql, (firstName, lastName, email, address, department, employee_id))
        connection.commit()

    return redirect(url_for('employee_management'))

@app.route('/edit_employee/<int:employee_id>', methods=['GET'])
def edit_employee_form(employee_id):
    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = "SELECT * FROM `employees` WHERE `employee_id`=%s"
        cursor.execute(sql, (employee_id,))
        employee = cursor.fetchone()

    if employee is None:
        # If there's no employee with the given ID, redirect to the employee management page
        return redirect(url_for('employee_management'))

    # Pass the employee's details to the template
    return render_template('edit_employee_form.html', employee=employee)

@app.route('/delete_employee/<int:employee_id>', methods=['POST'])
def delete_employee(employee_id):
    with connection.cursor() as cursor:
        # Execute the SQL query
        sql = "DELETE FROM `employees` WHERE `employee_id`=%s"
        cursor.execute(sql, (employee_id,))
        connection.commit()
    return redirect(url_for('employee_management'))

if __name__ == '__main__':
    app.run(debug=True)
