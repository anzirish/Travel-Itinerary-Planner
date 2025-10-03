# Travel Itinerary Planner
## Introduction
Travel Itinerary Planner is a comprehensive full-stack application designed to streamline travel planning and management. The platform enables users to organize all travel-related activities including trips, detailed itineraries, and destinations in one centralized location. Users can upload travel documents, create packing checklists, view real-time weather updates, collaborate with travel companions through email invitations, and share feedback through an integrated review system. Built with modern web technologies, this application provides a seamless and intuitive experience for planning memorable journeys.
## Project Type
Full-Stack
## Deployed App
Frontend: https://your-deployed-frontend.vercel.app
Backend: Firebase (Serverless)
Database: Firestore (Cloud Database)
## Directory Structure
```
travel-itinerary-planner/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Auth/
│  │  ├─ TripCard/
│  │  ├─ ItineraryForm/
│  │  ├─ PackingList/
│  │  ├─ DocumentUpload/
│  │  ├─ WeatherWidget/
│  │  ├─ CollaborationPanel/
│  │  ├─ ReviewSystem/
│  │  └─ ...
│  ├─ services/
│  │  ├─ firebase.js
│  │  ├─ weatherAPI.js
│  │  ├─ mapAPI.js
│  │  └─ emailService.js
│  ├─ context/
│  │  └─ AuthContext.js
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ TripDetails.tsx
│  │  └─ Destinations.tsx
│  ├─ App.tsx
│  └─ index.tsx
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md
```
## Video Walkthrough of the project
Attach a very short video walkthrough of all of the features [ 1 - 3 minutes ]
## Video Walkthrough of the codebase
Attach a very short video walkthrough of codebase [ 1 - 5 minutes ]
## Features
- User authentication and authorization with Firebase Auth
- Create and manage multiple trips with detailed information
- Add, edit, and delete itinerary items for each trip
- Upload and store travel documents securely in Firebase Storage
- Create and manage packing essentials checklists
- Real-time weather updates for selected destinations using Weather API
- Interactive map integration for visualizing trip locations
- Collaboration functionality allowing users to invite others via email
- Share trips with multiple collaborators for joint planning
- Review and feedback system for trips to enhance user experience
- Responsive design optimized for all devices
- Real-time data synchronization across all users
## Design Decisions or Assumptions
- Chose TypeScript for enhanced type safety and better development experience
- Selected Firebase for serverless infrastructure providing authentication, real-time database, and file storage capabilities
- Integrated third-party Weather API for accurate, real-time weather information
- Used Map API for visual representation of destinations and trip planning
- Implemented email-based collaboration system assuming users would prefer inviting collaborators through familiar communication channels
- Structured data model to support multiple users per trip with proper access control
- Used Tailwind CSS for rapid UI development with consistent design patterns
- Built review system to enable users to share experiences and improve trip planning
## Installation & Getting started
```bash
git clone https://github.com/yourusername/travel-itinerary-planner.git
cd travel-itinerary-planner
npm install
npm start
```
## Usage
```bash
npm start
```
Include screenshots as necessary.
## Credentials
```
Email: demo@travelplanner.com
Password: Demo@123
```
## APIs Used
- Weather API - Real-time weather data for destinations
- Map API - Interactive maps and location services
- Firebase Authentication API - User management and authentication
- Firestore API - Real-time NoSQL database
- Firebase Storage API - Document and file storage
  
## Technology Stack
- React with TypeScript
- Firebase Authentication
- Firestore
- Firebase Storage
- Weather API
- Map API
- Tailwind CSS
- React Router
