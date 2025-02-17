const express = require('express');
const app = express();
const port = 8000;

// Sample data for students
const Students = [
  { id: 1, name: "Tharushi" },
  { id: 2, name: "Kaveesha" },
  { id: 3, name: "Sanduni" }
];

// Route to get the list of students
app.get('/students', (req, res) => {
  res.json(Students);
});

app.post('/students', (req, res) => {
  const newStudent = req.body;

  // Add the new student to the array
  Students.push(newStudent);

  // Send a response back
  res.status(201).json({ message: 'Student added successfully', student: newStudent });
});

app.put('/students/:id',(req,res)=>{
  const studentId=parseInt(req.params.id)
const updatedStudent=req.body;
const student=Students.find(student=>student.id==studentId);
if(!student){
  return res.status(404).json({message:'student is not found'})
}
student.name=updatedStudent.name||student.name;
res.json({ message: 'Student updated successfully', student });
});


// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

