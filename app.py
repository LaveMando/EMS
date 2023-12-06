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


@app.route('/admin_dashboard')
def admin_dashboard():
    # Check if the user is logged in and is an admin
    if 'logged_in' in session and session['role'] == 'admin':
        return render_template('admin_dashboard.html')
    else:
        return redirect(url_for('login'))

@app.route('/employee_dashboard')
def employee_dashboard():
    # Check if the user is logged in and is an employee
    if 'logged_in' in session and session['role'] == 'employee':
        return render_template('employee_dashboard.html')
    else:
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    
    return 'You have been logged out'

@app.route('/leaveform')
def leaveform():
    return render_template('leaveform.html')

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
        connection.commit()

        # Prepare the email content
        subject = 'New Leave Request'
        message = f'{firstName} {lastName} has submitted a new leave request.\n\nStart Date: {startDate}\nEnd Date: {endDate}\nLeave Category: {leaveCategory}\nAdditional Explanation: {additionalExplanation}'
        recipient = 'lavemando@gmail.com'


        # Send the email
        send_email(subject, message, recipient)

        return redirect(url_for('employee_dashboard'))  # Redirect the user back to the employee dashboard
    return render_template('leaveform.html')

def send_email(subject, message, recipient):
    sender = 'ltmandoza@gmail.com'
    password = 'ogsz caxf rxer zphw'
    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender, password)
    server.send_message(msg)
    server.quit()

if __name__ == '__main__':
    app.run(debug=True)
