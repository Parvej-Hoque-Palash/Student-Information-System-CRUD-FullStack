require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const connectDB = require("./config/db");

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
  }));

connectDB()

app.use('/api/students' ,require('./routes/api/students'))

app.get("/", (req, res) =>{
    res.json({message: "Welcome to our app!!!"})
});

const port = process.env.PORT;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});