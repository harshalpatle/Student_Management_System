const API_URL = 'http://localhost:8080/api/students';
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const searchNameInput = document.getElementById('searchName');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');

form.addEventListener('submit', handleSubmit);
searchBtn.addEventListener('click', () => doSearch(searchNameInput.value));
clearSearchBtn.addEventListener('click', () => {
    searchNameInput.value = '';
    tableBody.innerHTML = '';
    setMessage('Cleared search results. Add student to backend; search to display.', false);
});
// We do not load all students on page load; frontend shows data only when searched.
document.addEventListener('DOMContentLoaded', () => {
    tableBody.innerHTML = '';
    setMessage('Use search to show student records.', false);
});

async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        setMessage('Error loading students. See console for details.', true);
    }
}

async function doSearch(name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
        setMessage('Please enter a name to search.', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(trimmedName)}`);
        const students = await response.json();
        displayStudents(students);
        if (students.length === 0) {
            setMessage(`No students found with name '${trimmedName}'.`, true);
        } else {
            setMessage(`Found ${students.length} student(s) for '${trimmedName}'.`);
        }
    } catch (error) {
        console.error('Error searching students:', error);
        setMessage('Error searching students. See console for details.', true);
    }
}

function setMessage(text, isError = false) {
    messageDiv.style.display = 'block';
    messageDiv.textContent = text;
    messageDiv.style.color = isError ? '#721c24' : '#155724';
    messageDiv.style.background = isError ? '#f8d7da' : '#d4edda';
    if (!isError) {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 2500);
    }
}

function displayStudents(students) {
    tableBody.innerHTML = '';
    students.forEach((student, index) => {
        const serial = student.serial !== undefined && student.serial !== null ? student.serial : index + 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serial}</td>
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
            setMessage('Student details were updated successfully.');
            // For update, we also keep current view: not automatic table refresh unless user searches again.
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            setMessage('Student details were added to backend (visible only on search).');
        }
        form.reset();
        document.getElementById('studentId').value = '';
        submitBtn.textContent = 'Add Student';
        // Do not reload full student list so new entries remain hidden until search.
    } catch (error) {
        console.error('Error saving student:', error);
        setMessage('Error saving student. See console for details.', true);
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
            const query = searchNameInput.value.trim();
            if (query) {
                doSearch(query);
            } else {
                tableBody.innerHTML = '';
                setMessage('Record deleted; serial numbers adjust next time search results are loaded.', false);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}