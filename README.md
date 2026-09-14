# Shepherd

Shepherd is a church management system I am building to help churches manage members, families, attendance, services, notifications, and follow-ups in one place.

The project started from a simple idea: many of the administrative tasks involved in running a church are still handled manually or across several different tools. Shepherd is my attempt to bring some of these processes together into a single system.

The project currently consists of a Node.js/Express backend, a React administration dashboard, and a React Native mobile application for church members.

## What Shepherd does

The system is designed around the day-to-day activities of a church.

Administrators and church leaders can manage members, create services, monitor attendance, identify absentees, manage follow-ups, and view reports.

Members can use the mobile application to manage their profiles, view their children, check attendance information, and receive notifications.

Some of the main features currently include:

* Member registration and management
* Family and child management
* Church service management
* Attendance tracking
* Attendance reports
* Member follow-ups
* Notifications
* Role-based access control
* Permission-based access control
* Email or phone-number login
* Password changes
* Password recovery using a verification code
* Admin-created member accounts

## How it works

Shepherd is split into three main parts.

```text
Shepherd
│
├── Backend
│   └── Node.js / Express REST API
│
├── Admin Dashboard
│   └── React / Vite
│
└── Mobile App
    └── React Native / Expo
```

All three parts communicate with the backend API, while MongoDB is used to store the application data.

```text
Admin Dashboard ─────┐
                     │
Mobile App ──────────┼──> Express API ───> MongoDB
                     │
Other clients ───────┘
```

## Main features

### Member management

Members can be registered and managed through the system.

Member information includes things such as:

* First and last name
* Email
* Phone number
* Gender
* Date of birth
* Membership type
* Membership status
* Account status
* Family information

The system also keeps track of whether a member has a login account.

### Family and children

Shepherd supports relationships between parents and children.

A parent can have children associated with their account, allowing family information and attendance to be managed without requiring every child to have an independent login account.

The system also prevents children from being given independent login accounts where that is not appropriate.

### Church services

Church services can be created and managed through the system.

Services have different states, allowing the application to determine whether attendance is currently open and whether a service has ended.

This is also used by other parts of the system, such as attendance and follow-up management.

### Attendance

Attendance is one of the main parts of Shepherd.

The system records attendance against both members and church services.

It can be used to:

* Record attendance
* View attendance information
* Identify absentees
* View service attendance
* Generate attendance reports
* Support follow-up activities

The aim is to make it easier for church leaders to know who attended a service and who may need to be contacted afterwards.

### Follow-ups

Shepherd includes a follow-up system for situations where a member may need additional contact after a service.

For example, an absent member may need to be contacted or visited.

Follow-ups can be managed by users with the appropriate permissions.

### Notifications

The system includes notifications for communicating information to users.

Members can:

* View notifications
* See unread notifications
* Mark notifications as read
* Mark all notifications as read
* Delete notifications

### Authentication

Authentication is handled by the backend using JSON Web Tokens.

Users can currently log in using either their email address or phone number.

The authentication system also supports:

* Registration
* Login
* Password changes
* Admin-created accounts
* Temporary passwords
* Password recovery
* Reset-code verification

Password reset codes are hashed before they are stored in the database and expire after a limited period.

### Temporary passwords

An administrator can create a login account for an existing member.

When this happens, Shepherd can generate a temporary password and mark the account with:

```text
mustChangePassword = true
```

The member can then change the temporary password to their own password.

This is useful when a member already exists in the church database but does not yet have an online account.

## User roles

The system currently supports several roles:

| Role      | Purpose                                        |
| --------- | ---------------------------------------------- |
| Member    | Regular church member                          |
| Child     | Child associated with a family                 |
| Leader    | Church leadership and member support           |
| Secretary | Administrative and attendance responsibilities |
| Pastor    | Pastoral and leadership responsibilities       |
| Admin     | System administration                          |

Permissions are used alongside roles to control access to different parts of the system.

## Technology

### Backend

The backend is built with:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Helmet
* CORS
* Morgan
* dotenv

The backend follows a REST API approach and separates routes, controllers, models, and middleware.

### Admin dashboard

The administration dashboard is built with:

* React
* Vite
* Redux Toolkit
* JavaScript
* REST API

The dashboard is intended for administrators, pastors, leaders, secretaries, and other users who have the required permissions.

### Mobile application

The member application is built with:

* React Native
* Expo
* Expo Router
* Redux Toolkit
* AsyncStorage
* Axios

The mobile application communicates with the same backend API used by the administration dashboard.

## Project structure

The repository is organised into separate applications.

```text
Shepherd/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed/
│   ├── config/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── admin/
│   ├── src/
│   └── package.json
│
└── shepherd-mobile/
    ├── src/
    │   ├── app/
    │   ├── api/
    │   ├── components/
    │   └── redux/
    └── package.json
```

The exact structure may change as development continues.

## API

The backend currently exposes several API sections:

```text
/api/auth
/api/users
/api/users/children
/api/attendance
/api/services
/api/dashboard
/api/attendance/report
/api/followups
/api/members
/api/reports
/api/notifications
```

Some of the authentication endpoints include:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/verify-reset-code
POST /api/auth/reset-password
POST /api/auth/create-account/:id
```

## Password recovery

The password recovery process currently works as follows:

```text
User enters email or phone number
          ↓
Backend generates a six-digit code
          ↓
Code is hashed and stored
          ↓
User enters the code
          ↓
Backend verifies the code
          ↓
User creates a new password
          ↓
Password is updated
          ↓
Reset information is cleared
```

During development, the reset code can be returned by the API to make testing easier. This is intended to be replaced by a proper delivery mechanism such as email or SMS before production use.

## Running the project locally

### Backend

Clone the repository and move into the backend directory:

```bash
git clone https://github.com/spydaspider/YOUR-REPOSITORY.git
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The API will normally run on:

```text
http://localhost:5000
```

There is also a simple health-check endpoint:

```text
GET /health
```

### Admin dashboard

Move into the admin directory:

```bash
cd admin
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The admin application normally runs on:

```text
http://localhost:5173
```

### Mobile application

Move into the mobile application:

```bash
cd shepherd-mobile
```

Install the dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

When testing on a physical phone, the mobile application needs to be able to reach the computer running the backend.

For local network testing, the API base URL can be configured using the computer's local IP address.

For example:

```javascript
const API_BASE_URL = "http://192.168.x.x:5000/api";
```

The computer and phone should normally be connected to the same network.

## Security

Security is an important part of the project because the system handles member information.

Some of the measures currently implemented include:

* Password hashing
* JWT authentication
* Protected API routes
* Role-based access control
* Permission-based access control
* Helmet
* CORS
* Account activation checks
* Temporary password support
* Hashed password reset codes
* Password reset expiration
* Generic password recovery responses

Environment variables and secrets should not be committed to the repository.

The `.env` file should be included in `.gitignore`.

## Development

Shepherd is still an active development project.

Some areas are complete enough to use for testing, while other parts are still being developed and improved.

The project is being built incrementally, with the backend API, administration dashboard, and mobile application developed alongside each other.

Future work may include:

* Email delivery for password recovery
* SMS delivery
* Push notifications
* More detailed attendance analytics
* Additional reporting
* Event management
* Further improvements to the member and family system
* Automated testing
* Deployment and production configuration

## What I have learned from the project

Building Shepherd has given me the opportunity to work on a number of areas of full-stack development, including:

* Designing REST APIs
* MongoDB database design
* Mongoose models and relationships
* Authentication and authorization
* JWT-based sessions
* Password security
* Role and permission systems
* React state management
* React Native development
* Expo Router
* API integration
* Error handling
* Form validation
* Attendance and reporting logic
* Building software around real-world requirements

It has also helped me understand that building an application is not just about getting individual features to work. Changes to one part of the system can affect authentication, permissions, database models, the web application, and the mobile application at the same time.

## Project status

Shepherd is currently under active development.

The core backend functionality, administration features, authentication system, attendance functionality, notification system, and member mobile application are being developed and tested.

The project will continue to evolve as additional requirements and improvements are identified.

## Author

Dickson Amankwah

Software Developer

GitHub: https://github.com/spydaspider

## License

This project currently does not have a public open-source license.

If the project is eventually released as open source, an appropriate license will be added.
