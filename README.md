working link 
https://notesappbyishita.netlify.app/

Dockerized MERN Notepad Application

A full-stack note-taking application built using the MERN stack and containerized with Docker. This project demonstrates scalable backend architecture, RESTful API design, and real-world DevOps practices using Docker Compose.

🚀 Features
📝 Create, Read, Update, Delete (CRUD) notes
⚡ RESTful API integration
🗂 Modular backend architecture (routes, controllers, models)
🐳 Dockerized multi-container setup (frontend + backend + database)
🔁 Persistent data storage using MongoDB
🛠 API testing and debugging using Postman
🛠 Tech Stack

Frontend: React.js, HTML, CSS
Backend: Node.js, Express.js
Database: MongoDB
DevOps: Docker, Docker Compose
Tools: Git, GitHub, Postman

🏗️ Architecture
[ React Frontend ]  --->  [ Express Backend API ]  --->  [ MongoDB Database ]
         |                         |                           |
     (Docker)                 (Docker)                    (Docker)
Frontend communicates with backend via REST APIs
Backend handles business logic and database operations
Docker containers ensure consistent environment across systems
📂 Project Structure
├── client/              # React frontend
├── server/              # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
├── docker-compose.yml   # Multi-container configuration
├── Dockerfile           # Container setup
└── README.md
⚙️ Getting Started
🔧 Prerequisites
Docker installed
Docker Compose installed
▶️ Run the Application
docker-compose up --build
🌐 Access the App
Frontend: http://localhost:3000
Backend API: http://localhost:5000
🧪 API Endpoints (Example)
Method	Endpoint	Description
GET	/notes	Get all notes
POST	/notes	Create a note
PUT	/notes/:id	Update a note
DELETE	/notes/:id	Delete a note
🐳 Docker Setup
Separate containers for:
Frontend
Backend
Database
Uses Docker Compose for orchestration
Ensures:
Consistent environment
Easy deployment
Faster setup


🔍 Future Improvements
🔐 Add authentication (JWT)
🔎 Search & filter notes
📄 Pagination
☁️ Deploy on AWS / Render
🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

📌 Author

Ishita Chaurasia
🔗 GitHub: https://github.com/ishcares
