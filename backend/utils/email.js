import express from 'express';
const app = express();
app.use(express.json());

app.post('/send-email', (req, res) => {
  const formData = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  // Set up email data
  const mailOptions = {
    from: '',
    to: 'ltmandoza@gmail.com',
    subject: 'Leave Application',
    text: `Employee Name: ${formData.employeeName}\nStart Date: ${formData.startDate}\nEnd Date: ${formData.endDate}\nLeave Category: ${formData.leaveCategory}\nAdditional Explanation: ${formData.additionalExplanation}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent: ' + info.response);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
