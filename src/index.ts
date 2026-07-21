import express, { type Request, type Response } from 'express';
import { courses, students } from './db/db.js';                         // import database
import { type Student, type Course } from "./libs/types.js";   // import types

import {
//   zStudentDeleteBody,
  zStudentPostBody,
  zStudentPutBody,
} from "./libs/studentValidator.js";


const app = express();
const port = 3000;

// An Express middleware that parses request's payload
// make the data available in 'req.body' object
app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
//  res.send('Hello from Express with TypeScript!');
    res.status(200).json({
        message: "successful",
        service: "welcome to my API service.",
        isActive: true
    })
});

//GEt /student 
app.get('/students', (req:Request, res: Response)=>{
    try {
        const program = req.query.program;
        // console.log(program)
    
        //check if program is null or undefined
        if(program){
            const filtered_students = students.filter((s)=> s.program === program)
            return res.status(200).json({
                success: true,
                count: filtered_students.length,
                data: filtered_students
            });
        }
        else {
            return res.status(200).json({
                success: true,
                count: students.length,
                data: students
            })
        }

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Something is wrong',
            error: err
        });
    }
})

app.post('/students', (req:Request, res:Response)=>{
    try {
        const student = req.body as Student;

        //check validation  
        const val = zStudentPostBody.safeParse(student);     
        if(!val.success){
            return res.json({
                success: false,
                message: "Validation failed",
                error: val.error.issues[0]?.message
            })
        }
        //chech if student id is already existed
        const found = students.find((s)=> s.studentId===student.studentId);
        if(found){
            return res.json({
                success: false,
                message: `${student.studentId} is already existed.`
            })
        }
        students.push(student)

        return res.status(201).json({
            success: true,
            data: student
        })

    } catch(err){
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

//PUT /students
app.put('/students', (req:Request, res:Response)=>{
    try{
        const student = req.body as Student;

        //check validation  
        const val = zStudentPutBody.safeParse(student);     
        if(!val.success){
            return res.json({
                success: false,
                message: "Validation failed",
                error: val.error.issues[0]?.message
            })
        }

        //chech if student id is already existed
        // const found = students.find((s)=> s.studentId===student.studentId);
        const foundIndex = students.findIndex((s)=> s.studentId===student.studentId)
        if(foundIndex===-1) // cannot find
            {
            return res.json({
                success: false,
                message: `${student.studentId} not found`
            })
        }

        students[foundIndex] = { ...students[foundIndex], ... student}
        return res.json({
            success: true,
            message: `${student.studentId} has been updated`,
            data : students[foundIndex]
        })

    } catch(err){

    }
})

// app.get('/students', (req:Request, res: Response)=>{
//     res.status(200).json({
//         success: true,
//         count: students.length,
//         data: students
//     });
// })

app.get('/courses', (req:Request, res: Response)=>{
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
})


app.listen(port, () => {
 console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app