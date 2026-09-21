# Biblio Archivist

> A mobile library management application designed to simplify the discovery, organization, and management of digital book collections.

## Overview

Biblio Archivist is a mobile application developed to provide a digital solution for library and book management. The application combines a mobile interface with a database-driven backend, providing an organized environment for browsing, searching, and accessing information about books.

The project explores mobile application development, database management, API communication, application architecture, and user interface design.

## Features

- Browse and explore the book collection
- Search for books
- View detailed information about individual books
- Manage and organize library resources
- Access structured book information and metadata
- Navigate through the application using a mobile-friendly interface
- Store and retrieve book data through a database

## Application Architecture

The application follows a client-server architecture, connecting the mobile application to backend services and a database.

    Mobile Application
           |
           | API Requests
           v
    Backend Services
           |
           | Database Operations
           v
        MongoDB

This architecture separates the presentation, application logic, and data layers, allowing the different components of the system to communicate efficiently.

## Technologies

- React Native
- JavaScript
- MongoDB
- Node.js
- REST API
- npm

## Project Structure

    Biblio-Archivist/
    |
    ├── assets/
    ├── components/
    ├── screens/
    ├── navigation/
    ├── services/
    ├── App.js
    ├── package.json
    └── README.md

## Getting Started

### Prerequisites

- Node.js
- npm
- React Native development environment
- Android Studio and/or Xcode
- MongoDB

### Installation

Clone the repository:

    git clone <repository-url>

Navigate to the project directory:

    cd Biblio-Archivist

Install the dependencies:

    npm install

Start the React Native development server:

    npx react-native start

Then launch the application on an Android or iOS emulator or a connected physical device.

## Project Objectives

The main objectives of the project were to:

- Develop a functional mobile library application
- Explore mobile application development with React Native
- Integrate a database into a mobile application
- Implement communication between the frontend and backend
- Design a structured application architecture
- Build reusable mobile interface components
- Apply software engineering principles to a real-world application

## Future Improvements

Possible future extensions include:

- User authentication and personalized accounts
- Favorites and personalized reading lists
- Book ratings and reviews
- Reading progress tracking
- Advanced search and filtering
- Personalized book recommendations
- AI-powered recommendation features
- Notifications and reminders
- Cloud deployment

## Author

**Simali Bouchra**

AI & Data Engineering Student

Interested in Artificial Intelligence, Machine Learning, Data Engineering, and Software Development.
