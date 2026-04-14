# 📒 Dockerized MERN Notepad Application

A full-stack note-taking application built using the MERN stack and containerized with Docker. This project demonstrates scalable backend architecture, RESTful API design, and real-world DevOps practices.

---

## 🌐 Live Demo

🚀 https://notesappbyishita.netlify.app/

---

## 🚀 Features

- 📝 Create, Read, Update, Delete (CRUD) notes  
- ⚡ RESTful API integration  
- 🗂 Modular backend architecture (routes, controllers, models)  
- 🐳 Dockerized multi-container setup (frontend + backend + database)  
- 🔁 Persistent data storage using MongoDB  
- 🛠 API testing and debugging using Postman  

---

## 🛠 Tech Stack

**Frontend:** React.js, HTML, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**DevOps:** Docker, Docker Compose  
**Hosting:** Netlify  

---

## 🏗️ Architecture

[ React Frontend ]  --->  [ Express Backend API ]  --->  [ MongoDB Database ]
         |                         |                           |
     (Docker)                 (Docker)                    (Docker)

---

## 📂 Project Structure

├── client/ # React frontend
├── server/ # Node.js backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── config/
├── docker-compose.yml
├── Dockerfile


---

## ⚙️ Getting Started

### 🔧 Prerequisites
- Docker installed  
- Docker Compose installed  

---

### ▶️ Run Locally

```bash
docker-compose up --build
---
🧪 API Endpoints

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | /notes     | Get all notes |
| POST   | /notes     | Create a note |
| PUT    | /notes/:id | Update a note |
| DELETE | /notes/:id | Delete a note |
---
🐳 Docker Setup
> Multi-container architecture using Docker Compose
> Isolated services for frontend, backend, and database
> Ensures consistent development and deployment environment
---
🔍 Future Improvements
🔐 Add authentication (JWT)
🔎 Search & filter notes
📄 Pagination
☁️ Full deployment (backend + database on cloud)

📌 Author

Ishita Chaurasia
🔗 GitHub: https://github.com/ishcares
