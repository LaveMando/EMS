import mysql from 'mysql';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const app = express()
app.use(bodyParser.json());
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods:["POST","GET","DELETE","PUT"],
    credentials: true
}))

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sagehill#23',
    database: 'employee_management'
})

app.get('/admin', (req, res)=> {
    const q = "SELECT * FROM admin"
    con.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
} )

app.get('/employeelog', (req, res)=> {
    const q = "SELECT * FROM employeelog"
    con.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
} )

app.post('/leave/application', (req, res) => {
  const formData = req.body;

  // Insert the form data into the "leave_requests" table
  const query = 'INSERT INTO leave_requests (employeeName, startDate, endDate, leaveCategory, additionalExplanation, status) VALUES (?, ?, ?, ?, ?, "Pending")';
  const values = [formData.employeeName, formData.startDate, formData.endDate, formData.leaveCategory, formData.additionalExplanation];

  con.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    console.log('Data inserted into the database');
    res.json({ message: 'Leave application submitted successfully' });
  });
});

app.get('/leave_application', (req, res) => {
  const query = 'SELECT * FROM leave_requests';

  con.query(query, (err, data) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    console.log('Data fetched from the database');
    res.json(data);
  });
});

app.post('/send_email', (req, res) => {
    const formData = req.body;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ltmandoza@gmail.com', // your email
        pass: 'qmduhpnfttngghmy' // your email password
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Leave Application" <ltmandoza@gmail.com>', // sender address
      to: 'lavemando@gmail.com', // list of receivers
      subject: 'New Leave Application', // Subject line
      html: `
      <p>Employee Name: ${formData.employeeName}</p>
      <p>Start Date of Leave: ${formData.startDate}</p>
      <p>End Date of Leave: ${formData.endDate}</p>
      <p>Leave Category: ${formData.leaveCategory}</p>
      <p>Additional Explanation: ${formData.additionalExplanation}</p>
      <p>Please click the following links to accept or reject the leave request:</p>
      <a href="http://localhost:5173/accept">Accept</a>
      <a href="http://localhost:5173/reject">Reject</a>
    `,
  };

    app.get('/leave/accept', (req, res) => {
        app.get('/leave/accept', (req, res) => {
            const leaveRequestId = req.query.id;
            const updateQuery = `UPDATE leave_requests SET status = 'Accepted' WHERE id = ?`;
              // Insert the form data into the "leave_requests" table
            const query = 'INSERT INTO leave_requests (employeeName, startDate, endDate, leaveCategory, additionalExplanation, status) VALUES (?, ?, ?, ?, ?, "Accepted")';
            const values = [formData.employeeName, formData.startDate, formData.endDate, formData.leaveCategory, formData.additionalExplanation];

            connection.query(query, values, (err, result) => {
              if (err) {
                console.error('Error inserting data into the database:', err);
                res.status(500).json({ error: 'An error occurred' });
                return;
              }

              console.log('Data inserted into the database');
              res.json({ message: 'Leave application submitted successfully' });
            });
  
            con.query(updateQuery, [leaveRequestId], (err, result) => {
              if (err) {
                return res.send('Error accepting leave request.');
              }
              return res.send('Leave request accepted.');
            });
          });
    res.send('Leave request accepted.');
});
  

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  
    res.json({ status: 'Email sent' });
  });
  

// REQUEST
// app.get("/",(res,req) =>{
//     res.json("Hello this is the backend")
// })
app.listen(8800, ()=>{
    console.log("Connected, Ndakaipa")
})

con.connect(function(err){
    if(err) {
        console.log("connection error")
    } else {
        console.log("Connected")
    }
})

// ADMINISTRATOR LOGIN
app.post('/admin', (req, res)=> {
    const login = "SELECT * FROM admin WHERE email=? AND password=?";

    con.query(login, [req.body.email, req.body.password], (err,data)=>{
        if(err) return res.json("Error")
        if(data.length > 0){
            return res.json("Login Successful")
        }else {
            return res.json("Login Failed")
        }
    })
})

// EMPLOYEE LOGIN
app.post('/employeelog', (req, res)=> {
    const login = "SELECT * FROM employeelog WHERE email=? AND password=?";

    con.query(login, [req.body.email, req.body.password], (err,data)=>{
        if(err) return res.json("Error")
        if(data.length > 0){
            return res.json("Login Successful")
        }else {
            return res.json("Login Failed")
        }
    })
})
