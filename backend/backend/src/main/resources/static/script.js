const API_URL = '/api/students';
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const searchBtn = document.getElementById('searchBtn');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', handleSubmit);
searchBtn.addEventListener('click', searchStudents);

function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

async function searchStudents() {
    const name = document.getElementById('searchName').value.trim();
    console.log('Searching for:', name);
    if (!name) {
        showMessage('Please enter a name to search.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(name)}`);
        console.log('Response status:', response.status);
        const students = await response.json();
        console.log('Found students:', students);
        displayStudents(students);
        if (students.length === 0) {
            showMessage('No students found with that name.', 'error');
        }
    } catch (error) {
        console.error('Error searching students:', error);
        showMessage('Error searching students. Please try again.', 'error');
    }
}

function displayStudents(students) {
    tableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
                <button class="action-btn edit" onclick="editStudent(${student.id})">Edit</button>
                <button class="action-btn delete" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const student = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        course: document.getElementById('course').value
    };

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
        }
        form.reset();
        document.getElementById('studentId').value = '';
        submitBtn.textContent = 'Add Student';
        showMessage(id ? 'Student updated successfully!' : 'Student added successfully!');
    } catch (error) {
        console.error('Error saving student:', error);
        showMessage('Error saving student. Please try again.', 'error');
    }
}

async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const student = await response.json();
        document.getElementById('studentId').value = student.id;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('age').value = student.age;
        document.getElementById('course').value = student.course;
        submitBtn.textContent = 'Update Student';
    } catch (error) {
        console.error('Error editing student:', error);
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            tableBody.innerHTML = '';
            showMessage('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            showMessage('Error deleting student. Please try again.', 'error');
        }
    }
}