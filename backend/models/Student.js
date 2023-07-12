const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fname: {
            type: String
        },
        lname: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        age: {
            type: Number
        },
        studentid: {
            type: Number
        },
        grade: {
            type: String
        }
    },{
        timestamps: true
    }
)

module.exports = Student = mongoose.model("Student", studentSchema)