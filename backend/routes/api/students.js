const express = require("express");
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../../middleware/auth');
const Student = require('../../models/Student');

router.post(
    '/',
    [
        //validation
        body('fname', 'fname is required').notEmpty(),
        body('lname', 'lname is required').notEmpty(),
        body('email', 'Please enter a valid email').notEmpty().isEmail(),
        body('age', 'age is required').optional().isNumeric(),
        body('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
    ],
    async (req, res) => {
        try {
          const errors = validationResult(req)
          if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
          }
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(req.body.password, salt)
          const password = hash
          const studentObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: password,
            age: req.body.age,
            studentid: req.body.studentid,
            grade: req.body.grade
        }
        const student = new Student(studentObj);
        await student.save();
        res.status(201).json(student);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Something is wrong" });
        }
      }
);

router.post(
    '/login',
    [
        body('type','Type is required').notEmpty(),
        body('type','Type must be email or refresh').isIn(['email','refresh'])
    ],
     async (req, res) => {
    try {
        const errors = validationResult(req);
          if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
          }
        const {email, password, type, refreshToken} = req.body
      
        if(type == 'email'){
          await handleEmailLogin(email, res, password);
        }else{
          handleRefreshLogin(refreshToken, res);
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  });

  router.get('/profile', authenticateToken, async (req, res) =>{
    try {
      const id = req.user.id; //used 'user' instead of 'params'
      const student = await Student.findById(id);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  });

router.get('/', async (req, res) =>{
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(404).json({message: "Student not found!"})
    }
})

router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const student = await Student.findById(id);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      //keeping the hash password in database after edit also.
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(req.body.password, salt)
      const password = hash
      const id = req.params.id;
      const body = req.body;
      const student = await Student.findByIdAndUpdate(id, body, { new: true });
      if (student) {
        student.password = password
        res.json(student);
        student.save()
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const student = await Student.findByIdAndDelete(id);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something is wrong" });
    }
  });
module.exports = router

function handleRefreshLogin(refreshToken, res) {
    if (!refreshToken) {
      res.status(401).json({ message: 'refreshToken is not defined' });
    } else {
      jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          const id = payload.id;
          const student = await Student.findById(id);
          if (!student) { //if user is not found
            res.status(401).json({ message: 'Unauthorized' });
          } else { //if user is found
            getUserTokens(student, res);
          }
        }
      });
    }
  }
  
  async function handleEmailLogin(email, res, password) {
    const student = await Student.findOne({ email: email });
    //Checking if user email is valid
    if (!student) {
      res.status(401).json({ message: "User not found" });
    } else {
      //Checking if user password is valid
      const isValidPassword = bcrypt.compare(password, student.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Wrong Password!" });
      } else {
        getUserTokens(student, res);
      }
    }
  }
  
  function getUserTokens(student, res) {
    const accessToken = jwt.sign({ email: student.email, id: student._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const studentObj = student.toJSON();
    studentObj['accessToken'] = accessToken;
    studentObj['refreshToken'] = refreshToken;
    res.status(200).json(studentObj);
  }