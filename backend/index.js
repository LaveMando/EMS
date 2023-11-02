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
      text: `Employee Name: ${formData.employeeName}
             Start Date of Leave: ${formData.startDate}
             End Date of Leave: ${formData.endDate}
             Leave Category: ${formData.leaveCategory}
             Additional Explanation: ${formData.additionalExplanation}`, // plain text body
    };
  
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
