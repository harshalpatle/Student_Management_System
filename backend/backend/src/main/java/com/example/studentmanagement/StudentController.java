package com.example.studentmanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    private List<StudentResponse> mapStudentsForResponse(List<Student> students) {
        List<StudentResponse> response = new java.util.ArrayList<>();
        int serial = 1;
        for (Student student : students) {
            StudentResponse sr = new StudentResponse(
                    student.getId(),
                    serial++,
                    student.getName(),
                    student.getEmail(),
                    student.getAge(),
                    student.getCourse()
            );
            response.add(sr);
        }
        return response;
    }

    @GetMapping
    public List<StudentResponse> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return mapStudentsForResponse(students);
    }

    @GetMapping("/{id}")
    public Optional<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
        student.setId(id);
        return studentService.saveStudent(student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }

    @GetMapping("/search")
    public List<StudentResponse> searchStudents(@RequestParam String name) {
        List<Student> students = studentService.searchStudentsByName(name);
        return mapStudentsForResponse(students);
    }
}