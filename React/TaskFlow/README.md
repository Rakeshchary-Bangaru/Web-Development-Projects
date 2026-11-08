# TaskFlow Frontend

TaskFlow is a responsive task-management frontend built with React and Vite.

## Features

- Create, edit, and delete tasks
- Priority levels: Low, Medium, High
- Task states: To Do, In Progress, Completed
- Complete and reopen tasks
- Responsive sticky-note style interface
- REST API integration with a Spring Boot backend

## Tech Stack

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend Integration

During local development, the frontend communicates with the Spring Boot REST API.

For the AWS deployment, the React production build is bundled into the Spring Boot application so the frontend and backend are served together from the application tier.

## API Endpoints Used

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## AWS Deployment

The complete TaskFlow application is deployed using a two-tier AWS architecture:

- Application tier: Amazon EC2 running Docker with Spring Boot and the React production build
- Database tier: Amazon RDS MySQL deployed privately inside the VPC

Detailed AWS architecture and cloud transformation documentation are maintained in the `AWS-Cloud-Projects` repository.
