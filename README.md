# 🛒 Buy Nest — Full Stack E-Commerce Platform

**Buy Nest** is a modern, scalable full-stack e-commerce platform built with **TypeScript**, following **Clean Architecture** principles.  
It features a robust backend with layered separation of concerns, a performant React frontend, secure authentication, cloud integrations, and fully automated CI/CD deployment with Docker and Kubernetes.

---

## 🚀 Tech Stack

### 🧩 Backend
- **Node.js + Express.js** — RESTful API framework  
- **TypeScript** — static typing for maintainability  
- **MongoDB** — NoSQL database  
- **JWT Authentication** — secure token-based sessions  
- **Clean Architecture** — layered design for scalability and testability  
- **Dependency Injection** — for decoupled module communication  
- **Cloudinary** — media management and image uploads  
- **Google OAuth 2.0** — third-party authentication  
- **Stripe** — integrated payment gateways  
- **Jest** — for unit and integration testing  

### 💻 Frontend
- **React.js (TypeScript)** — responsive user interface  
- **Material UI (MUI)** — modern UI components  
- **React Router** — SPA navigation  
- **Axios** — API communication  
- **Lazy Loading** — performance optimization  

### ⚙️ DevOps & Infrastructure
- **Docker (Multi-stage builds)** — containerized frontend and backend  
- **Kubernetes (YAML manifests)** — scalable deployments  
- **Jenkins (CI/CD)** — automated testing, build, and deployment pipeline  

---


## ⚙️ Configuration

Before running the project, create a `.env` file in the backend root and add the following environment variables:

```bash
APP_SECRET=your_app_secret
PORT=5000
DB_URL=mongodb_url
# Cloudinary (for image uploads)
cloudinary_cloud_name=your_cloud_name
cloudinary_api_key=your_api_key
cloudinary_api_secret=your_api_secret

# Google OAuth (for login)
google_client_id=your_client_id
google_client_secret=your_client_secret
google_callback_url=http://localhost:5000/auth/google/callback

# Stripe / Payment Gateway
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

