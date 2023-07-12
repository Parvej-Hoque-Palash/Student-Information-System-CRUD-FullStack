// App.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StudentItem from './components/StudentItem';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    fname: '',
    lname: '',
    email: '',
    age: '',
    password: '',
    studentid: '',
    grade: '',
  });
  const [editStudentId, setEditStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3006/api/students', newStudent);
      setStudents([...students, response.data]);
      setNewStudent({
        fname: '',
        lname: '',
        email: '',
        age: '',
        password: '',
        studentid: '',
        grade: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudent = async (id) => {
    try {
      await axios.put(`http://localhost:3006/api/students/${id}`, newStudent);
      const updatedStudents = students.map((student) =>
        student._id === id ? { ...student, ...newStudent } : student
      );
      setStudents(updatedStudents);
      setEditStudentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:3006/api/students/${id}`);
      const updatedStudents = students.filter((student) => student._id !== id);
      setStudents(updatedStudents);
    } catch (error) {
      console.error(error);
    }
  };

  const editStudent = (student) => {
    setEditStudentId(student._id);
    setNewStudent({
      fname: student.fname,
      lname: student.lname,
      email: student.email,
      age: student.age,
      password: student.password,
      studentid: student.studentid,
      grade: student.grade,
    });
  };

  const resetForm = () => {
    setEditStudentId(null);
    setNewStudent({
      fname: '',
      lname: '',
      email: '',
      age: '',
      password: '',
      studentid: '',
      grade: '',
    });
  };

  const isEditMode = editStudentId !== null;

  return (
    <div className='bg-slate-200'>
      <Navbar />
    <div className='mt-6'>
      <form className='flex flex-col bg-slate-300 shadow-md rounded px-8 pt-6 pb-8 mb-6 ml-auto mr-auto gap-2 w-full max-w-xl' onSubmit={isEditMode ? () => updateStudent(editStudentId) : createStudent}>
        <h1 className="text-3xl font-bold ml-auto mr-auto" >Student Information Form</h1>
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="text"
          placeholder="First Name"
          value={newStudent.fname}
          onChange={(e) => setNewStudent({ ...newStudent, fname: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="text"
          placeholder="Last Name"
          value={newStudent.lname}
          onChange={(e) => setNewStudent({ ...newStudent, lname: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="number"
          placeholder="Age"
          value={newStudent.age}
          onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="password"
          placeholder="Password"
          value={newStudent.password}
          onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="text"
          placeholder="Student ID"
          value={newStudent.studentid}
          onChange={(e) => setNewStudent({ ...newStudent, studentid: e.target.value })}
        />
        <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type="text"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
        />
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto mr-auto mt-2 rounded focus:outline-none focus:shadow-outline' type="submit">{isEditMode ? 'Update Student' : 'Create Student'}</button>
        {isEditMode && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg pb-24'>
      <table className='w-4/5 text-sm text-left text-gray-500 dark:text-gray-400 ml-auto mr-auto'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Age</th>
            <th scope="col" class="px-6 py-3">Student ID</th>
            <th scope="col" class="px-6 py-3">Grade</th>
            <th scope="col" class="px-6 py-3"><span class="sr-only">Edit</span></th>
            <th scope="col" class="px-6 py-3"><span class="sr-only">Delete</span></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentItem
              key={student._id}
              student={student}
              editStudent={editStudent}
              deleteStudent={deleteStudent}
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default App;
