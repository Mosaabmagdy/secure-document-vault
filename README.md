# secure-document-vault
Secure Document Vault

A secure web application for storing and managing encrypted documents with authentication, Google OAuth login, and Two-Factor Authentication (2FA).

Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js + Express.js
Database: MySQL (XAMPP)
Authentication:
JWT
Google OAuth 2.0
Google Authenticator 2FA
Password Hashing: bcrypt
Security:
Helmet
HTTPS
Encrypted Passwords
Project Setup
1. Clone The Repository
git clone <your-repository-link>
2. Install Backend Dependencies

Open terminal inside Backend folder:

cd Backend
npm install
3. Create MySQL Database

Open phpMyAdmin in XAMPP and create a database named:

secure-document-vault

Import the SQL schema or create the required tables manually.

4. Configure Environment Variables

Create a .env file inside Backend folder:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=secure-document-vault

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SESSION_SECRET=your_session_secret
5. Configure Google OAuth

Go to:

Google Cloud Console

Create OAuth 2.0 Client ID.

Set:

Authorized JavaScript Origins
https://localhost:5000
Authorized Redirect URI
https://localhost:5000/api/auth/google/callback
6. Generate SSL Certificate

Inside Backend folder run:

openssl req -nodes -new -x509 -keyout server.key -out server.cert

This creates:

server.key
server.cert
7. Run Backend Server

Inside Backend folder:

npm run dev

Backend will run on:

https://localhost:5000
8. Trust HTTPS Certificate

Open:

https://localhost:5000

Browser may show:

Your connection is not private

Click:

Advanced
Proceed to localhost
9. Run Frontend

Open the Frontend folder with VS Code.

Then:

Right click index.html
Select Open With Live Server

Frontend runs on:

http://127.0.0.1:5500
10. Login With Google

Open:

http://127.0.0.1:5500/login.html

Use:

Email/Password Login
Google OAuth Login
2FA Verification
Features
User Registration
Secure Login
Password Hashing with bcrypt
Google OAuth Authentication
JWT Authentication
Google Authenticator 2FA
Admin Dashboard
Secure Document Upload
HTTPS Security
Role-Based Access Control
Default Admin

You can manually change a user role inside MySQL database:

UPDATE users
SET role='admin'
WHERE email='your-email@example.com';
