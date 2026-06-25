export const blogs = [
  {
    id: 1,
    slug: 'deploying-devboard-kubernetes',
    title: 'Deploying DevBoard on Kubernetes',
    description:
      'A comprehensive walkthrough of containerizing a Node.js application, writing Kubernetes manifests, configuring Horizontal Pod Autoscaling, and automating the full deployment pipeline through GitHub Actions.',
    date: 'Feb 15, 2025',
    readTime: '8 min read',
    tags: ['Kubernetes', 'Docker', 'DevOps', 'CI/CD', 'GitHub Actions'],
    homepage: true,
    coverImage: null,
    content: `## Introduction

Modern backend engineering extends far beyond writing APIs. A reliable application must be easy to deploy, resilient to failures, observable in production, and capable of scaling with demand. While building **DevBoard**, a multi-user task management platform, I intentionally kept the application logic simple so I could focus on the infrastructure surrounding it.

This project became an opportunity to explore how production systems are deployed and operated rather than simply developed. The objective was to build a complete deployment pipeline—from containerizing the application to orchestrating it with Kubernetes, automating deployments through GitHub Actions, and monitoring system health with Prometheus and Grafana.

This article walks through the architecture, design decisions, challenges, and lessons learned while deploying DevBoard.

---

## Background & Motivation

Many personal projects stop after the application works locally. Although building features is important, software in production introduces a completely different set of challenges.

Some common questions quickly arise:

* How is the application deployed repeatedly without manual intervention?
* What happens when the application crashes?
* How can multiple instances of the application run simultaneously?
* How do we know if the application is healthy?
* How can performance bottlenecks be identified before users notice them?

I wanted a project that answered these questions.

Instead of building another feature-heavy application, I chose to invest time in understanding the deployment lifecycle of modern backend systems. DevBoard became a platform for learning containerization, orchestration, observability, and deployment automation.

---

## System Architecture

The deployed application consists of four major components.

\`\`\`
                React Frontend
                     │
                     ▼
             Node.js Express API
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
 PostgreSQL                  Redis
(Database)        (Rate Limiting & JWT Blocklist)

             Prometheus
                  │
                  ▼
              Grafana
\`\`\`

Each component has a single responsibility.

* React provides the user interface.
* Express exposes the REST API.
* PostgreSQL stores persistent application data.
* Redis handles transient security-related data.
* Prometheus collects runtime metrics.
* Grafana visualizes application health.

Keeping responsibilities separate makes the system easier to maintain and scale.

---

## Why Docker?

Before introducing Kubernetes, the application first needed a reproducible execution environment.

Docker solved several problems simultaneously.

* Eliminated "works on my machine" issues.
* Standardized runtime environments.
* Simplified dependency management.
* Created identical development and production environments.

A multi-stage Docker build was used to keep production images lightweight.

The builder stage installs all dependencies and prepares the application, while the production stage contains only the runtime artifacts and production dependencies. Running the container as a non-root user further improves security.

---

## Local Infrastructure with Docker Compose

Running multiple services manually quickly becomes tedious.

Instead of starting PostgreSQL, Redis, Prometheus, and the backend individually, Docker Compose orchestrates the entire local development environment with a single command.

\`\`\`
docker compose up
\`\`\`

Compose also provides automatic networking between services, allowing the backend to connect to PostgreSQL and Redis through service names instead of hardcoded IP addresses.

This mirrors production networking behavior and significantly simplifies local development.

---

## Kubernetes: Moving Beyond Containers

Docker solves packaging.

Kubernetes solves orchestration.

While Docker ensures the application runs consistently, Kubernetes ensures it continues running even when failures occur.

For DevBoard, Kubernetes manages:

* Application deployments
* Service discovery
* Internal networking
* Health monitoring
* Automatic restarts
* Horizontal scaling

Deployments define the desired state of the application, while Services provide stable networking despite individual pods being temporary.

One concept that stood out during development was that Pods should never be treated as permanent infrastructure. Kubernetes assumes Pods will eventually fail and continuously works to restore the desired state.

---

## Horizontal Pod Autoscaling

One of the most interesting parts of the project was configuring the Horizontal Pod Autoscaler (HPA).

Instead of manually increasing replicas, Kubernetes monitors CPU utilization and adjusts the number of running API instances automatically.

The API deployment specifies minimum and maximum replica counts while the HPA continuously evaluates resource usage.

During testing, synthetic load was generated against the API, allowing Kubernetes to scale additional pods automatically before removing them again once demand decreased.

Although request-based autoscaling often provides a better scaling signal, CPU utilization was chosen because it integrates directly with Kubernetes without requiring custom metrics infrastructure.

---

## CI/CD with GitHub Actions

Manual deployments introduce unnecessary risk.

Every deployment should follow exactly the same sequence of steps regardless of who triggers it.

The GitHub Actions pipeline automates this process.

Every push to the main branch performs the following stages:

1. Install dependencies
2. Run linting
3. Execute tests
4. Build Docker image
5. Tag image with both \`latest\` and the commit SHA
6. Push the image to the container registry

Using immutable Git SHA tags instead of relying solely on \`latest\` ensures deployments remain reproducible and allows older versions to be rolled back if necessary.

---

## Observability with Prometheus & Grafana

Deploying software is only half the job.

The next challenge is understanding what the application is doing after deployment.

DevBoard exposes a \`/metrics\` endpoint using the \`prom-client\` library.

Prometheus periodically scrapes these metrics, while Grafana visualizes them through dashboards.

Some of the collected metrics include:

* Total HTTP requests
* Request latency
* Active connections
* Error rates

Having these dashboards available transformed debugging from guesswork into observation.

Instead of asking *"Is the API slow?"*, I could inspect request latency, throughput, and error rates directly.

---

## Security Considerations

Security was intentionally incorporated into the backend rather than added later.

Several production practices were implemented.

### JWT Authentication

Authentication uses JWTs stored inside HTTP-only cookies, protecting tokens from client-side JavaScript access.

### Redis JWT Blocklist

Since JWTs are stateless, logging out normally does not invalidate existing tokens.

To solve this, logout stores each token's unique identifier inside Redis with a TTL matching its expiration.

Every authenticated request verifies that the token has not been invalidated.

### Login Rate Limiting

Redis also powers login rate limiting.

This significantly reduces the effectiveness of brute-force attacks while demonstrating a practical use of Redis beyond simple caching.

### Backend Authorization

The frontend never decides who can access resources.

Every request validates board membership and administrative permissions directly inside the backend, preventing privilege escalation and resource enumeration attacks.

---

## Challenges

The biggest challenge was not Kubernetes itself—it was understanding where each responsibility belonged.

Initially I attempted to deploy the complete stack, including PostgreSQL and Redis, inside a Kubernetes cluster running on a free-tier EC2 instance.

The cluster became unstable due to limited CPU and memory resources.

Rather than forcing an impractical deployment, I stepped back and evaluated the architecture.

This experience reinforced an important engineering lesson:

> Production systems are designed around constraints, not ideals.

Understanding why something fails is often more valuable than simply making it work.

---

## Lessons Learned

This project fundamentally changed how I think about backend development.

I learned that:

* Containers package applications, while Kubernetes manages them.
* Stateless services scale far more easily than stateful ones.
* Observability should be designed into systems from the beginning.
* Infrastructure deserves the same engineering discipline as application code.
* Automation removes inconsistency from deployments.

Most importantly, I realized that modern backend engineering is as much about operating software as it is about writing it.

---

## Final Thoughts

DevBoard began as a simple task management application but evolved into a platform for learning production infrastructure.

The application itself remains intentionally minimal.

The real value lies in the surrounding ecosystem:

* Containerization
* CI/CD
* Kubernetes
* Monitoring
* Security
* Deployment automation

Building these layers provided far more insight than implementing additional application features ever could.

As I continue improving the project, I plan to explore managed Kubernetes clusters, Infrastructure as Code using Terraform, centralized logging, and more advanced deployment strategies such as blue-green and canary deployments.

The application may be simple—but the engineering behind it is not.`,
  },
  {
    id: 2,
    slug: 'realtime-code-editor-socketio',
    title: 'Building a Real-Time Collaborative Code Editor with Socket.IO',
    description:
      'Deep dive into WebSocket architecture, room-based state management, handling concurrent users, and building a reliable reconnection system for real-time collaborative applications.',
    date: 'Jan 10, 2025',
    readTime: '6 min read',
    tags: ['Socket.IO', 'WebSockets', 'Node.js', 'Real-Time'],
    homepage: true,
    coverImage: null,
  },
  {
    id: 3,
    slug: 'redis-caching-nodejs',
    title: 'Redis Caching Strategies in Node.js Applications',
    description:
      'A practical guide to implementing cache-aside, write-through, and write-behind caching patterns in Node.js using Redis, with real benchmarks showing the measurable impact on API response times.',
    date: 'Dec 05, 2024',
    readTime: '5 min read',
    tags: ['Redis', 'Node.js', 'Performance', 'Backend'],
    homepage: true,
    coverImage: null,
  },
];
