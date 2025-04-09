# 🏆 FairPlay: Anti-Doping Education Platform

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/your-username/fairplay-app/actions/workflows/main.yml/badge.svg)](https://github.com/your-username/fairplay-app/actions)
[![Code Quality](https://api.codiga.io/project/12345/status/svg)](https://app.codiga.io/project/12345)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](docker-compose.yml)

FairPlay is an innovative platform that empowers athletes, coaches, and medical professionals with cutting-edge anti-doping education. Our mission is to elevate sports integrity through immersive learning experiences, real-time collaboration, and community engagement.

---

## Table of Contents

- [Overview](https://github.com/Akshat394/FairPlayAPP/new/main?filename=README.md#overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#-project-stucture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Git Workflow](#git-workflow)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Screenshots](#screenshots)

---

## Overview

FairPlay brings anti-doping education to the forefront with an engaging, interactive platform. With immersive AR modules, real-time messaging, AI-driven quizzes, and a gamified learning environment, our project creates a safe space for users to exchange knowledge and foster ethical practices.

---

## Key Features

- **Role-Based Dashboards:**  
  Customized interfaces for athletes, coaches, and doctors with task management and analytics.

- **Real-Time Communication:**  
  Secure messaging powered by WebSockets for immediate collaboration.

- **Gamified Learning:**  
  Earn points, unlock achievements, and engage in friendly competition.

- **Augmented Reality Experiences:**  
  Interactive AR modules using Three.js and AR.js for realistic training simulations.

- **AI-Driven Quizzes:**  
  Personalized quizzes that adapt to user performance to maximize learning.

- **Secure Authentication:**  
  JWT-based authentication with refresh token rotation to protect user data.

- **Cloud-Native Infrastructure:**  
  Utilizing MongoDB Atlas and AWS services for scalability and reliability.

---

## Architecture & Tech Stack

| **Layer**           | **Technology**                                                           |
|---------------------|--------------------------------------------------------------------------|
| **Frontend**        | React 18, TypeScript, Redux Toolkit, Vite, Tailwind CSS                   |
| **Backend**         | Node.js 18, Express.js, TypeScript, Socket.io                             |
| **Database**        | MongoDB 6.0+ (Atlas), Mongoose ODM                                        |
| **Infrastructure**  | AWS EC2, S3, CloudFront                                                   |
| **DevOps**          | Docker, GitHub Actions, ESLint, Prettier, Jest                            |

### Architecture Diagram

```plaintext
                   +-----------------+
                   |     Clients     |
                   | (Mobile/Web App)|
                   +--------+--------+
                            |
                            | REST / WebSocket
                            |
                   +--------v--------+
                   |   Backend API   |
                   |  (Express, TS)  |
                   +--------+--------+
                            |
             +--------------+---------------+
             |                              |
   +---------v---------+           +--------v-------+
   |  MongoDB Atlas    |           |  AWS Services  |
   |   (NoSQL DB)      |           | (EC2, S3, etc.)|
   +-------------------+           +----------------+
```
---
## 📁 Project Structure

The `fairplay-app` project follows a modular and clean monorepo layout:

```plaintext
fairplay-app/
├── client/                # Frontend React application
├── server/                # Backend Express API
├── docker/                # Docker configuration files
├── media/                 # Images and screenshots for documentation
├── .github/               # GitHub workflows and contribution guidelines
│   └── CONTRIBUTING.md
├── .env.example           # Example environment variables file
├── docker-compose.yml     # Docker Compose configuration
├── package.json           # Root package file (if using a monorepo structure)
└── README.md              # This file
```
---
## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later  
- **MongoDB**: Atlas account or a local instance  
- **AWS CLI**: (Optional, if deploying on AWS)  
- **Git**: For version control

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/fairplay-app.git
   cd fairplay-app
   ```

2. **Install Dependencies:**

   Run the setup script to install both client and server dependencies:

   ```bash
   npm run setup
   ```

3. **Start the Application:**

   Launch the development servers:

   ```bash
   npm run dev
   ```

   > The client will be running on [http://localhost:3000](http://localhost:3000) and the server on [http://localhost:5000](http://localhost:5000).

---

### Environment Configuration

Create a `.env` file in the root directory with the following configurations:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fairplay
JWT_SECRET=your_secure_secret
AWS_ACCESS_KEY_ID=your_aws_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

---

## Git Workflow

We follow a streamlined Git workflow to maintain code quality and project integrity.

### Branching Strategy

- **`main`**: The stable production-ready branch.
- **`develop`**: Integration branch for features and fixes.
- **Feature Branches:** Branch off from `develop` using naming like `feat/<feature-name>`.
- **Bugfix Branches:** Branch off from `develop` using naming like `fix/<issue-name>`.

### Common Git Commands

1. **Cloning the Repository:**

   ```bash
   git clone https://github.com/your-username/fairplay-app.git
   ```

2. **Creating a Feature Branch:**

   ```bash
   git checkout -b feat/new-feature
   ```

3. **Adding Changes:**

   ```bash
   git add .
   git commit -m "Add new feature: describe changes"
   ```

4. **Pushing a Branch:**

   ```bash
   git push origin feat/new-feature
   ```

5. **Opening a Pull Request:**

   - Go to the GitHub repository page.
   - Select your branch and click **"New Pull Request"**.
   - Include clear details and reference any related issues.

---

## Docker Deployment

To deploy the FairPlay app using Docker, run:

```bash
docker compose up --build
```

This command builds the project images and starts all required services using the `docker-compose.yml` file.

---

## Testing

Ensure high code quality with automated tests:

- **Unit & Integration Tests:**

  ```bash
  npm test
  ```

- **End-to-End (E2E) Tests:**

  ```bash
  npm run test:e2e
  ```

---

## Contributing

We welcome contributions! To contribute:

1. **Fork the Repository.**
2. **Create a Feature or Bugfix Branch:**

   ```bash
   git checkout -b feat/your-feature
   ```

3. **Commit Your Changes with Clear Messages:**

   ```bash
   git commit -m "Describe your changes"
   ```

4. **Push Your Branch and Open a Pull Request.**

Please review our [Contribution Guidelines](.github/CONTRIBUTING.md) for detailed instructions.

---

## Roadmap

- **Personalized Learning Modules:** AI-driven custom training paths.
- **Multilingual Support:** Expanding language accessibility.
- **Mentorship Programs:** Facilitating expert and community-led sessions.
- **Wearable Device Integration:** Sync with fitness trackers for real-time analytics.

View [Issues](https://github.com/your-username/fairplay-app/issues) for upcoming features and discussions.

---

## License

Distributed under the Apache 2.0 License. See [LICENSE](LICENSE) for full details.

---

## Screenshots

### Athlete Dashboard
![Athlete Dashboard](media/athlete-dashboard.png)

### AR Learning Module
![AR Module](media/ar-module.png)

### Quiz & Analytics Interface
![Quiz Interface](media/quiz-interface.png)

---

FairPlay sets the standard for anti-doping education by merging advanced technology with user-centered design. Join our community and help build a culture of integrity and excellence in sports!
