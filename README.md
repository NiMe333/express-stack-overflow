# 📚 Q&A Web Application (Express + MongoDB)

A simple web application that allows users to ask and answer questions, inspired by basic Stack Overflow functionality.

---

## 🚀 Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Handlebars (HBS)
- Bootstrap

---

## 📌 Features

### 👤 Authentication
- User registration
- Login / logout
- Password hashing using bcrypt
- Session-based authentication

---

### ❓ Questions
- Create a question (title + description)
- View all questions
- View a single question with details

---

### 💬 Answers
- Post answers to questions
- View all answers for a question
- Answers are sorted by:
  - accepted answer first
  - then by date

---

### ✅ Accepted Answer
- Question owner can accept an answer
- Accepted answer is highlighted and shown at the top

---

### 🔥 Hot Questions
A special section that ranks questions based on user activity.

#### Logic:
activity = views + (answers × 3)
hotScore = activity / hours_since_post

- Measures engagement (views + answers)
- Normalized by time
- Displays top 5 questions with score > 3

---

### 👤 User Profile
- Public profile view
- Displays:
  - number of questions
  - number of answers
  - number of accepted answers
- Default profile image

---

## 📂 Project Structure
/models
UserModel.js
QuestionModel.js
AnswerModel.js

/routes
auth.js
QuestionRoutes.js
AnswerRoutes.js
UserRoutes.js

/views
/questions
/auth
/users

/public
/images
/stylesheets

---

## ⚙️ Installation

```bash
npm install
```

### Run the Application
```bash
npm start
```

### App runs at:
```bash

http://localhost:3000
```
### MongoDB Setup
create .env file 
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

## Important

Use this mongoose version (required for compatibility):
```
npm install mongoose@6.9.0 --save
```
