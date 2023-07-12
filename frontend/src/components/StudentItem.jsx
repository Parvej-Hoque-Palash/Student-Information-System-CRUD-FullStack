// StudentItem.jsx

import React from 'react';

const StudentItem = ({ student, editStudent, deleteStudent }) => {
  return (
    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
      <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.fname} {student.lname}</td>
      <td className='px-6 py-4'>{student.email}</td>
      <td className='px-6 py-4'>{student.age}</td>
      <td className='px-6 py-4'>{student.studentid}</td>
      <td className='px-6 py-4'>{student.grade}</td>
      <td>
        <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-auto mr-auto mt-2 rounded focus:outline-none focus:shadow-outline' onClick={() => editStudent(student)}>
          Edit
        </button>
      </td>
      <td>
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-auto mr-auto mt-2 rounded focus:outline-none focus:shadow-outline' onClick={() => deleteStudent(student._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
