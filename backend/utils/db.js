import mysql from 'mysql';
import cors from 'cors';
import express from 'express';

const app = express()
app.use(express.json())
app.use(cors())

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

// REQUEST
app.get("/",(res,req) =>{
    res.json("Hello this is the backend")
})
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

export default con;
