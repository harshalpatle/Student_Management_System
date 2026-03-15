# Student Management System

## Overview
Full-stack Student Management System using Spring Boot backend and static HTML/CSS/JS frontend.

## Features
- CRUD operations for students (add, view, update, delete)
- REST API endpoints via Spring Boot
- Responsive frontend with JavaScript

## Tech Stack
- **Backend**: Java 17+, Spring Boot, Spring Data JPA, Maven
- **Frontend**: HTML, CSS, JavaScript
- **Database**: H2 (embedded, see application.properties)

## Prerequisites
- Java 17+
- Maven 3.9+

## Setup & Run
```
cd backend/backend
mvn clean package
mvn spring-boot:run
```
- App runs on http://localhost:8080
- Frontend served from /static/index.html
- API: /api/students

## API Endpoints
- `GET /api/students` - List all students
- `POST /api/students` - Add student (JSON: {"id":1, "name":"John", "email":"john@example.com"})
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

## Project Structure
```
.
├── backend/backend/       # Spring Boot app
│   ├── src/main/java/... # Controllers, Services, Entities
│   ├── src/main/resources/static/ # Frontend files
│   └── pom.xml
├── frontend/frontend/     # Duplicate frontend (optional)
└── README.md
```

## Testing
Access http://localhost:8080 after starting server.

## Future Improvements
- Add authentication
- PostgreSQL/MySQL integration
- Docker deployment
- Frontend framework (React/Vue)

Built with ❤️ using BLACKBOXAI
