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

## Running the Application

- **Start Redis using Docker (see the Docker setup instructions below).**
- **Run the Node.js application:**
    Run the Node.js application:
  ```bash
  node server.js

- **For more details, refer to [the Redis installation guide](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/)**

## API Endpoints

### GET /

- **Description**: Simple endpoint to check if the server is running.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: `"Hello, welcome to this task"`

### POST /task

- **Description**: Endpoint to submit a task for processing.
- **Request Body**:
  ```json
  {
    "userid": "string" // Required user ID
  }

## Rate Limiting

The application implements rate limiting using the `express-rate-limit` package. Each user is allowed to submit:

- **1 task per second**
- **20 tasks per minute**

Requests that exceed these limits are queued for processing.

## Logging

The application logs task processing times to a file named `task_log.txt`. Each log entry includes:

- **User ID**
- **Task start time**
- **Task completion time**

## Testing

To test the API, use Postman or another API client. Test the `/task` endpoint by making a POST request to:

     http://localhost:3000/task


## Task Queue

The application utilizes the Bull library to manage a task queue. Tasks exceeding the rate limits are queued for later processing, ensuring they are handled in the order they are received.

  

  

