# Node.js Task Queue with Rate Limiting

This project is a Node.js application that implements a task queue with rate limiting for handling tasks per user. Each user is allowed a maximum of 1 task per second and 20 tasks per minute. The application uses Redis for managing the task queue and rate limiting.

## Tech Stack

- **Node.js**
- **Express.js**
- **Redis** (with Docker)
- **Bull** (for task queue management)
- **ioredis** (for Redis client connection)
- **Cluster** (for Node.js clustering)
- **fs** (for logging)

## Prerequisites

- **Node.js** (version 14 or later)
- **Docker** (for Redis setup)

## Installation

1. **Download** the code from the provided zip file.
2. **Navigate** to the project directory.
3. **Install** dependencies by running:
   ```bash
   npm install

