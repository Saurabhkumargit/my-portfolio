export const blogs = [
  {
    id: 1,
    slug: "deploying-devboard-kubernetes",
    title: "Deploying DevBoard on Kubernetes",
    description:
      "A comprehensive walkthrough of containerizing a Node.js application, writing Kubernetes manifests, configuring Horizontal Pod Autoscaling, and automating the full deployment pipeline through GitHub Actions.",
    date: "June 25, 2026",
    readTime: "8 min read",
    tags: ["Kubernetes", "Docker", "DevOps", "CI/CD", "GitHub Actions"],
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
    slug: "from-devops-to-ai-roadmap",
    title: "From DevOps to AI: The Roadmap I’m Following",
    description:
      "A practical roadmap for transitioning from backend, DevOps, and cloud engineering into AI, covering machine learning, deep learning, LLMs, RAG, agents, MLOps, LLMOps, and production AI systems.",
    date: "August 15, 2026",
    readTime: "15 min read",
    tags: ["AI", "AI Engineering", "DevOps", "MLOps", "LLMs", "RAG", "GenAI"],
    homepage: true,
    coverImage: null,
    content: `## Introduction

The traditional way of learning AI often starts with mathematics, machine learning algorithms, neural networks, and eventually deep learning.

That path makes sense if the goal is to become a machine learning researcher or specialize deeply in model development.

That is not the path I want to take.

My background and interests are much closer to **software engineering, backend development, DevOps, cloud infrastructure, deployment, and production systems**. Instead of leaving those skills behind to start AI from scratch, I want to build on top of them.

That led me to a more specific question:

> **How can I move from DevOps and backend engineering into AI without throwing away everything I have already learned?**

The answer is not to become an expert in every branch of artificial intelligence.

My goal is to become a **software and infrastructure engineer who can build, deploy, scale, evaluate, secure, and operate AI systems in production.**

I am not there yet. This roadmap is the path I am following to get there.

---

## Why I’m Moving From DevOps Toward AI

My interest in AI did not come from wanting to abandon backend or infrastructure engineering.

It came from realizing that modern AI systems have many of the same engineering problems that traditional software systems have—but with an additional layer of complexity.

An AI application still needs:

* APIs
* databases
* authentication
* deployment
* containers
* networking
* monitoring
* CI/CD
* scalability
* security
* observability

But now it also has to deal with:

* models
* embeddings
* prompts
* inference
* context
* evaluation
* hallucinations
* model latency
* token usage
* AI-specific security problems
* model and application monitoring

This makes AI engineering particularly interesting to me.

I do not want to become someone who only knows how to call an LLM API.

I want to understand what happens before the API call, what happens after it, and how the entire system behaves when it is actually running in production.

---

## The Problem With Learning AI

The biggest mistake I could make is trying to learn everything.

Artificial intelligence is too broad for that.

There is machine learning, deep learning, computer vision, reinforcement learning, NLP, generative AI, robotics, recommendation systems, speech processing, multimodal systems, and many specialized research areas.

Trying to master all of them would create a massive amount of surface-level knowledge without producing useful engineering depth.

So I am intentionally choosing a different approach.

My roadmap focuses on the parts of AI that connect most strongly with my existing software and infrastructure background.

The objective is:

> **Learn enough ML and deep learning to understand modern AI systems, then go deeper into LLMs, AI application engineering, production infrastructure, and MLOps.**

ML and deep learning are therefore foundations—not the final specialization.

---

## The Roadmap

My current roadmap looks like this:

\`\`\`
Backend + DevOps + Cloud
        ↓
1. Python + NumPy + Pandas
        ↓
2. ML Fundamentals
        ↓
3. Deep Learning Fundamentals
        ↓
4. Transformers + Attention
        ↓
5. LLM Engineering
        ↓
6. RAG + Embeddings
        ↓
7. AI Application Engineering
        ↓
8. Agentic AI
        ↓
9. Evaluation + AI Security
        ↓
10. MLOps
        ↓
11. LLMOps / Production AI
        ↓
12. AI System Design
        ↓
Specialize
GenAI / Agents / MLOps / AI Infrastructure
\`\`\`

Each stage exists for a specific reason.

---

## 1. Python + NumPy + Pandas

Python is already one of the core tools I use, so I do not need to spend months relearning the language.

The focus here is on the parts of Python and the data ecosystem that become important for AI.

This includes:

* NumPy
* Pandas
* data manipulation
* vectorized operations
* data preprocessing
* working with datasets
* basic visualization
* environments and dependency management

The goal is not to become a data scientist.

The goal is to become comfortable enough with data that machine learning concepts stop feeling abstract.

### Depth: 6/10

This is a foundation, so I need practical fluency rather than extreme specialization.

---

## 2. Machine Learning Fundamentals

Machine learning is where I need to understand what models actually do before moving into modern AI systems.

The important concepts include:

* supervised learning
* unsupervised learning
* training and inference
* features and labels
* classification
* regression
* clustering
* train/validation/test splits
* overfitting and underfitting
* feature engineering
* model evaluation
* cross-validation
* common algorithms

I also want to understand algorithms such as:

* Linear Regression
* Logistic Regression
* K-Nearest Neighbors
* Naive Bayes
* Decision Trees
* Random Forests
* Support Vector Machines
* clustering algorithms

The objective is not to memorize every algorithm.

It is to understand **why a model works, where it fails, and how to evaluate it.**

### Depth: 5–6/10

I need enough ML knowledge to reason about models and communicate with ML engineers—not enough to become a dedicated ML researcher.

---

## 3. Deep Learning Fundamentals

Modern generative AI is built on deep learning, so skipping it would create a significant knowledge gap.

The focus here is on understanding:

* neural networks
* neurons and layers
* activation functions
* forward propagation
* backpropagation
* loss functions
* optimizers
* gradient descent
* regularization
* training loops
* model overfitting
* GPUs and tensors

I also want a basic understanding of architectures such as:

* CNNs
* RNNs
* LSTMs

The important word here is **understanding**.

I do not need to train enormous models from scratch.

I need to understand what the underlying systems are doing so that later concepts—especially transformers and LLMs—do not feel like black boxes.

### Depth: 6/10

---

## 4. Transformers + Attention

This is where the roadmap becomes much more important for my specific direction.

Transformers are fundamental to understanding modern language models.

The concepts I want to understand include:

* tokens
* embeddings
* attention
* self-attention
* queries, keys, and values
* positional information
* encoder and decoder architectures
* multi-head attention
* transformer blocks
* inference

I do not need to become a researcher who derives every equation from memory.

But I should be able to explain **why transformers work and how information flows through them.**

### Depth: 8/10

This is one of the areas where I want significantly more depth.

---

## 5. LLM Engineering

Once the transformer architecture makes sense, the next step is understanding how large language models are actually used.

This includes:

* LLM APIs
* open-source models
* tokenization
* context windows
* prompting
* structured outputs
* function calling
* tool calling
* streaming
* model selection
* latency
* token costs
* inference basics

At this point the goal changes.

I am no longer studying AI only as a model-building problem.

I am studying AI as a **software engineering problem**.

A model by itself is rarely the complete application.

The real system is usually:

\`\`\`
User
  ↓
Frontend
  ↓
Backend
  ↓
LLM
  ↓
Tools / APIs / Database
  ↓
Response
\`\`\`

Understanding how these components interact is central to AI application engineering.

### Depth: 8/10

---

## 6. RAG + Embeddings

Retrieval-Augmented Generation is one of the most practical areas of modern LLM engineering.

A general-purpose language model does not automatically know everything about a company's private documentation, internal knowledge base, or continuously changing information.

RAG introduces a retrieval layer.

A typical pipeline looks like:

\`\`\`
Documents
    ↓
Chunking
    ↓
Embeddings
    ↓
Vector Database
    ↓
Similarity Search
    ↓
Relevant Context
    ↓
LLM
    ↓
Answer + Citations
\`\`\`

The concepts I want to understand include:

* embeddings
* vector similarity
* chunking strategies
* metadata
* vector databases
* semantic search
* hybrid search
* retrieval pipelines
* reranking
* context construction
* citations
* RAG evaluation

This is also where my backend and database experience becomes useful.

Instead of simply calling an LLM, I am building an information retrieval system around it.

### Depth: 9/10

RAG is one of the areas I want to become highly comfortable with because it connects AI directly with application engineering.

---

## 7. AI Application Engineering

This is where my existing software development background should start compounding.

The goal is to build complete AI applications rather than isolated AI demos.

That means combining:

* React
* FastAPI
* databases
* authentication
* background jobs
* streaming
* LLMs
* RAG
* APIs
* Docker
* cloud infrastructure

I want to learn how to build systems that feel like real products.

An AI application should not be:

\`\`\`
Input → LLM → Output
\`\`\`

A production application is closer to:

\`\`\`
User
 ↓
Frontend
 ↓
API
 ↓
Authentication
 ↓
Application Logic
 ↓
Retrieval / Tools / Database
 ↓
LLM
 ↓
Validation
 ↓
Streaming Response
 ↓
Observability
\`\`\`

This distinction is important.

The hard part of AI engineering is increasingly not simply accessing a model.

It is engineering everything around the model.

### Depth: 9/10

---

## 8. Agentic AI

Once I understand LLM applications, RAG, and tool calling, the next step is building systems that can perform multi-step tasks.

This is where agentic systems become useful.

The concepts include:

* tool use
* planning
* workflows
* state
* memory
* task decomposition
* multi-step execution
* tool selection
* agent loops
* human approval
* failure recovery

An agent should not simply be an LLM inside a loop.

A useful agent needs controlled capabilities, clear boundaries, observability, and failure handling.

This is where my DevOps background becomes particularly relevant.

A real engineering agent might need to:

\`\`\`
Receive Alert
      ↓
Inspect Metrics
      ↓
Read Logs
      ↓
Identify Possible Cause
      ↓
Inspect Deployment
      ↓
Propose Fix
      ↓
Request Human Approval
      ↓
Apply Change
      ↓
Verify System Health
\`\`\`

That is much closer to an engineering system than a chatbot.

### Depth: 8/10

---

## 9. Evaluation + AI Security

One of the biggest differences between traditional software and AI systems is that correct behavior is often less deterministic.

A normal function might return the same output for the same input.

An LLM can produce different outputs.

That creates a serious engineering problem:

> **How do you know your AI system is actually working?**

This makes evaluation an essential skill.

I want to understand:

* evaluation datasets
* automated evaluation
* human evaluation
* retrieval evaluation
* response quality
* hallucination detection
* relevance
* groundedness
* regression testing
* latency
* token usage
* cost

Security becomes equally important.

AI applications introduce additional attack surfaces such as:

* prompt injection
* indirect prompt injection
* data leakage
* insecure tool access
* excessive agent permissions
* malicious retrieved content
* untrusted model output

This stage therefore becomes the bridge between building AI systems and operating them responsibly.

### Depth: 8/10

---

## 10. MLOps

This is where my existing DevOps knowledge becomes directly useful.

MLOps brings software engineering and infrastructure practices into machine learning workflows.

The focus includes:

* experiment tracking
* data pipelines
* model versioning
* model registry
* training pipelines
* CI/CD for ML
* model deployment
* monitoring
* drift detection
* reproducibility
* infrastructure automation

A typical workflow might look like:

\`\`\`
Data
 ↓
Training
 ↓
Experiment Tracking
 ↓
Model Evaluation
 ↓
Model Registry
 ↓
Deployment
 ↓
Monitoring
 ↓
Retraining
\`\`\`

Tools such as MLflow, Docker, Kubernetes, CI/CD systems, and cloud infrastructure become increasingly relevant here.

### Depth: 9/10

This is one of the areas where my previous experience should provide a significant advantage.

---

## 11. LLMOps / Production AI

MLOps alone is not enough for modern generative AI systems.

LLM-based applications have their own operational challenges.

For example:

* model selection
* prompt versioning
* token costs
* inference latency
* context management
* tracing
* evaluation
* model fallback
* caching
* rate limits
* AI observability

A production LLM system needs visibility into more than CPU and memory.

I also need to understand questions such as:

\`\`\`
Which model generated this response?
How many tokens did it consume?
How long did inference take?
What context was retrieved?
Which tool was called?
Did the model hallucinate?
Did retrieval fail?
Did the user get a useful answer?
\`\`\`

This creates a new operational layer around AI systems.

### Depth: 9/10

This is one of the core areas of the career direction I am targeting.

---

## 12. AI System Design

Eventually I want to move beyond implementing individual features and start thinking about complete AI architectures.

This means asking questions such as:

* How should an AI system scale?
* Where should inference happen?
* How should models be selected?
* How should requests be routed?
* How should AI workloads be monitored?
* How should failures be handled?
* How should costs be controlled?
* How should sensitive data be protected?
* When should humans be involved?
* How should the system evolve over time?

A high-level architecture might look like:

\`\`\`
                    Users
                      ↓
                API Gateway
                      ↓
              Application Layer
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Retrieval       Agents        Tools
        ↓             ↓             ↓
        └─────────────┼─────────────┘
                      ↓
                 Model Layer
                      ↓
          Inference / Model Serving
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Monitoring      Evaluation      Security
                      ↓
                 Infrastructure
\`\`\`

At this level, I am no longer thinking about a single model.

I am thinking about the entire system.

### Depth: 8/10

---

## How Deep Do I Actually Need to Go?

A major part of this roadmap is knowing where **not** to spend my time.

My current priorities are:

| Area | Priority | Depth |
|---|---|---:|
| Python + Data | Foundation | 6/10 |
| Math | Foundation | 5/10 |
| Machine Learning | Foundation | 5–6/10 |
| Deep Learning | Foundation | 6/10 |
| Transformers | Important | 8/10 |
| LLMs | Core | 8/10 |
| RAG | Core | 9/10 |
| AI Engineering | Core | 9/10 |
| Agents | Core | 8/10 |
| Evaluation / Security | Important | 8/10 |
| MLOps | Core | 9/10 |
| LLMOps | Core | 9/10 |
| AI System Design | Core | 8/10 |
| CV / RL / Other Areas | Awareness | 1–2/10 |

This does not mean computer vision, reinforcement learning, or other areas are unimportant.

It means they are not currently aligned with the specialization I am pursuing.

---

## The Role of Mathematics

Mathematics is another area where I need to be careful.

It is easy to fall into the trap of spending months studying mathematics before building anything.

I do not think that is the right approach for my goal.

I want a practical understanding of:

* linear algebra
* probability
* statistics
* calculus
* optimization

The goal is to understand concepts such as vectors, matrices, gradients, probability distributions, loss functions, and optimization well enough to reason about ML and deep learning systems.

I am not trying to become a mathematician.

### Depth: 5/10

Math supports the roadmap. It is not the roadmap.

---

## The Projects I Plan to Build

The roadmap becomes much more useful when every stage produces something tangible.

Instead of completing courses and collecting certificates, I want to progressively build more complex systems.

---

## Project 1: ML API

The first project will be a relatively simple machine learning application, such as a fraud detection system.

The objective is to combine:

\`\`\`
Dataset
 ↓
ML Model
 ↓
FastAPI
 ↓
Docker
 ↓
Deployment
\`\`\`

This project connects my existing backend skills with the fundamentals of machine learning.

It should teach me how an ML model moves from a notebook into an actual service.

---

## Project 2: LLM Application

Next, I want to build an AI productivity assistant.

The system could combine:

* LLM integration
* FastAPI
* React
* streaming responses
* tool calling
* authentication
* persistent data

The important part is making it feel like a real application rather than a basic chatbot.

---

## Project 3: RAG System

The next project will be a company knowledge assistant.

The architecture would look something like:

\`\`\`
Documents
 ↓
Chunking
 ↓
Embeddings
 ↓
PostgreSQL + pgvector
 ↓
Retrieval
 ↓
LLM
 ↓
Citations
 ↓
Evaluation
\`\`\`

This project should give me practical experience with one of the most important patterns in modern AI applications.

It also gives me an opportunity to combine AI with databases, APIs, and backend infrastructure.

---

## Project 4: Flagship Project — AI DevOps Agent

This is the project I am most interested in building.

My existing background is in DevOps, so instead of creating another generic AI chatbot, I want to combine the two domains.

The idea is an **AI DevOps Agent** that can interact with infrastructure and developer tooling.

A possible architecture could involve:

* LLM
* agent workflows
* GitHub
* Kubernetes
* application logs
* Prometheus metrics
* deployment information
* infrastructure tools
* human approval

For example:

\`\`\`
Production Alert
        ↓
AI Agent
        ↓
Inspect Metrics
        ↓
Inspect Logs
        ↓
Inspect Recent Deployments
        ↓
Identify Potential Cause
        ↓
Recommend Action
        ↓
Human Approval
        ↓
Execute Tool
        ↓
Verify Recovery
\`\`\`

This project is particularly important to me because it does not force me to choose between DevOps and AI.

It combines them.

More importantly, it represents the direction I want my career to move toward.

---

## Project 5: MLOps Platform

After becoming comfortable building AI applications, I want to build an actual ML platform.

The workflow would look roughly like:

\`\`\`
Training
   ↓
Experiment Tracking
   ↓
MLflow
   ↓
Model Registry
   ↓
CI/CD
   ↓
Deployment
   ↓
Kubernetes
   ↓
Monitoring
\`\`\`

This project shifts the focus from building a model to building the infrastructure required to reliably operate models.

That distinction is important.

---

## Project 6: AI Platform

This is an optional advanced project.

The goal would be to explore the infrastructure underneath AI systems:

* model deployment
* inference
* autoscaling
* model routing
* monitoring
* GPU utilization
* cost management
* reliability

At that point, the focus moves closer to AI infrastructure and platform engineering.

---

## When Can I Start Applying?

The roadmap is also career-oriented.

I do not need to wait until I complete all twelve stages before applying for jobs.

My progression should look more like this:

\`\`\`
Current Skills
      ↓
Backend / DevOps / Cloud Roles
\`\`\`

After gaining ML fundamentals and basic deep learning knowledge:

\`\`\`
ML Fundamentals + Basic DL
      ↓
ML / AI Internships
\`\`\`

After developing strong LLM and RAG skills:

\`\`\`
LLM + RAG
      ↓
GenAI / AI Internships
\`\`\`

After adding agents, evaluation, and stronger AI application engineering:

\`\`\`
LLM + RAG + Agents + Evaluation
      ↓
AI Engineer
GenAI Engineer
LLM Engineer
AI Application Engineer
\`\`\`

And after developing strong MLOps and LLMOps skills:

\`\`\`
MLOps + LLMOps
      ↓
MLOps Engineer
AI Platform Engineer
AI Infrastructure Engineer
LLMOps Engineer
\`\`\`

These are not hard boundaries.

They are milestones that help me understand when my skill set is becoming strong enough to target different roles.

---

## How I Plan to Study

I do not want my learning process to become:

\`\`\`
Course
 ↓
Course
 ↓
Course
 ↓
Certificate
 ↓
Another Course
\`\`\`

That creates familiarity without necessarily creating engineering ability.

Instead, my rule for every major concept is:

\`\`\`
Learn
 ↓
Build
 ↓
Break
 ↓
Debug
 ↓
Explain
\`\`\`

### Learn

Understand the underlying concept before reaching for a framework.

### Build

Use the concept in a real project.

### Break

Intentionally push the system beyond the happy path.

### Debug

Figure out why it failed.

### Explain

If I cannot explain what I built in simple terms, I probably do not understand it well enough.

---

## My 40 / 40 / 20 Rule

I also want to roughly divide my learning time into:

\`\`\`
40% Theory
40% Projects
20% Documentation + Debugging
\`\`\`

The exact percentages do not matter.

The principle does.

Theory without implementation becomes passive knowledge.

Projects without theory create shallow understanding.

Debugging and documentation are where many of the practical lessons actually appear.

---

## Don't Collect Frameworks

Another rule I want to follow is:

> **Do not confuse knowing a framework with understanding the system.**

AI is currently filled with rapidly changing tools and frameworks.

A framework may become popular today and be replaced by another tomorrow.

The underlying concepts are more durable.

For example, understanding:

* embeddings
* retrieval
* attention
* inference
* evaluation
* model serving
* observability

is more valuable than memorizing the API of a particular framework.

Frameworks should accelerate development—not replace understanding.

---

## What I Am Deliberately Not Focusing On

This roadmap also requires saying no.

I am not trying to deeply specialize in every AI field.

Computer vision, reinforcement learning, robotics, advanced research, and other areas are useful to understand at a high level, but they are not my immediate priority.

For those areas, my current target is:

\`\`\`
Understand the concepts
        ↓
Know what the technology is used for
        ↓
Recognize when I need it
\`\`\`

Rather than:

\`\`\`
Master the entire field
\`\`\`

This keeps the roadmap focused.

---

## The Bigger Picture

The more I think about this transition, the less I see it as:

\`\`\`
DevOps → AI
\`\`\`

and more as:

\`\`\`
DevOps
   +
Backend Engineering
   +
Cloud
   +
AI
   ↓
The Road to Production AI Engineering
\`\`\`

That distinction matters.

The skills I have already invested time in do not become irrelevant because I am learning AI.

They become more valuable when combined with it.

Containerization is still useful.

Kubernetes is still useful.

CI/CD is still useful.

Cloud infrastructure is still useful.

Monitoring is still useful.

Backend engineering is still useful.

The difference is that now they can also be applied to AI systems.

---

## Final Goal

I am not trying to become:

> **"Someone who knows every branch of AI."**

I am working toward becoming:

> **"A software and DevOps engineer who can build, deploy, scale, evaluate, secure, and operate AI systems in production."**

That is the direction I am currently pursuing.

I am still learning the foundations.

I am still building the projects.

I am still figuring out which parts of AI I want to specialize in most deeply.

But the destination is becoming clearer:

\`\`\`
Software Engineering
        +
AI
        +
Infrastructure
        +
Production Engineering
        ↓
Production AI
\`\`\`

For me, that is the most natural bridge from where I am today to where I want to go next.

The goal is not to leave DevOps behind.

**The goal is to use everything I already know as leverage while moving deeper into AI.**
`,
  },

  {
    id: 3,
    slug: "building-unfeed-chrome-extension",
    title: "I Built a Chrome Extension Because YouTube Kept Distracting Me",
    description:
      "A deep dive into building UnFeed, a Chrome extension that removes YouTube distractions through configurable focus modes, persistent sessions, dynamic DOM handling, SPA navigation detection, and Chrome Manifest V3 service workers.",
    date: "August 26, 2026",
    readTime: "10 min read",
    tags: [
      "Chrome Extensions",
      "JavaScript",
      "React",
      "Manifest V3",
      "Browser APIs",
      "Productivity",
    ],
    homepage: true,
    coverImage: null,
    content: `## Introduction

I use YouTube a lot for learning.

Lectures, tutorials, documentation walkthroughs, conference talks — a lot of the things I want to learn are on YouTube.

The problem is that YouTube doesn't really care **why** I opened it.

I might open YouTube with the intention of watching a 20-minute lecture, watch the video for 10 minutes, and then notice a recommended video that looks interesting.

One click becomes another.

Then another.

And suddenly I'm no longer learning what I originally came for.

The frustrating part is that I didn't actually want to stop using YouTube. **I needed YouTube.**

I just didn't need everything around the video.

So I decided to build something about it.

Meet **UnFeed**.

---

## The idea

The first thought I had was simple:

> What if I could keep the video I intentionally opened, while removing everything that tries to make me watch something else?

I didn't want another website blocker.

I didn't want to completely block YouTube.

And I didn't want an AI system deciding what I should or shouldn't watch.

I wanted something much simpler:

**You choose the video. UnFeed removes the distractions.**

That became the core idea behind the project.

---

## From "hide recommendations" to an actual focus system

My first instinct was that this would be a pretty small project.

Find the recommendation elements.

Hide them with CSS.

Done.

That assumption lasted about five minutes.

YouTube is not a static webpage.

It's a heavily dynamic application with client-side navigation and a DOM that changes constantly.

Recommendations can appear after the page loads. Moving from one video to another doesn't necessarily reload the page. The video element itself can be replaced.

And because this was going to be a Chrome extension, there was another problem:

**the extension's background process doesn't simply stay alive forever.**

So I ended up building something considerably more interesting than a collection of CSS selectors.

---

# Three levels of focus

I wanted the extension to be useful for different situations rather than forcing one extreme mode.

So UnFeed has three focus levels.

### Light

This is the least aggressive mode.

It removes things like:

- Recommended videos
- Related videos
- End-screen recommendations
- Autoplay suggestions
- Home feed content

But it keeps most of the normal video experience.

### Study

Study mode goes further.

It also removes:

- Comments
- Shorts
- The recommendation sidebar
- Additional information cards

The idea is to turn YouTube into more of a learning environment.

### Deep

And then there's Deep mode.

This is for when I really don't want anything competing for my attention.

It removes even more of the surrounding interface, including:

- Search
- Channel information
- Description
- Like/share actions
- Additional navigation elements

The goal is basically:

**video + controls + nothing else.**

And importantly, the video player itself stays intact.

---

# The first real engineering problem: YouTube doesn't stay still

One of the first things I ran into was YouTube's dynamic DOM.

If I hide a recommendation when the page loads, that doesn't mean another recommendation won't appear five seconds later.

YouTube can dynamically insert new elements while the user scrolls or interacts with the page.

So UnFeed uses a \`MutationObserver\` to watch for relevant DOM changes.

But even that creates another problem.

You don't want to run expensive DOM queries every time *anything* changes on the page.

That could mean the extension itself becomes a performance problem.

So I added a few safeguards:

- Only structural DOM additions are observed.
- Extension-managed elements are ignored.
- Mutations are filtered before doing actual work.
- Focus reapplication is debounced.

The basic flow became:

\`\`\`
YouTube changes DOM
       ↓
MutationObserver
       ↓
Filter irrelevant changes
       ↓
Debounce
       ↓
Reapply focus rules
\`\`\`

That was my first reminder that browser extensions aren't just about manipulating the DOM.

You have to respect the environment you're running inside.

---

# Then YouTube navigation broke the simple approach

Another problem showed up when navigating between videos.

YouTube behaves more like a single-page application than a traditional collection of independent pages.

So this:

\`\`\`
Video A
  ↓
Video B
\`\`\`

doesn't necessarily mean:

\`\`\`
Unload everything
  ↓
Load a completely new page
\`\`\`

The existing page can remain alive while YouTube replaces parts of the interface.

That meant UnFeed needed to detect navigation independently.

I ended up using multiple signals, including YouTube's navigation event and browser history changes, with additional fallback handling.

When navigation happens, UnFeed needs to:

1. Detect the new video ID.
2. Tell the background service worker.
3. Reapply the current focus level.
4. Remove listeners attached to the previous video.
5. Find the new video element.
6. Attach the appropriate event listeners again.

That sounds straightforward now.

It wasn't particularly straightforward while debugging it.

---

# The service worker problem

This was probably the most interesting part of the project for me.

Chrome Manifest V3 uses service workers for background logic.

The important thing about service workers is that **you cannot assume they'll stay running continuously.**

So I couldn't build a timer like:

\`\`\`js
let remainingTime = 1800;

setInterval(() => {
    remainingTime--;
}, 1000);
\`\`\`

and expect it to be reliable.

The worker could be suspended.

If the state existed only in memory, the session could become inconsistent.

So instead, I made the background service worker the source of truth and persisted the session using Chrome storage.

For a timed session, I store an absolute expiration timestamp:

\`\`\`
startedAt
endAt
\`\`\`

Then remaining time is simply:

\`\`\`
endAt - currentTime
\`\`\`

The extension also uses \`chrome.alarms\` to handle timer expiry.

That means this can happen:

\`\`\`
Start 30-minute session
        ↓
Close popup
        ↓
Service worker gets suspended
        ↓
Chrome wakes it when necessary
        ↓
Session state is still available
        ↓
Timer expires
        ↓
Focus mode is removed
\`\`\`

The popup itself is therefore **not** responsible for keeping the session alive.

It's just a UI for controlling and displaying the session.

That distinction ended up being one of the most important architectural decisions in the project.

---

# "Until video ends" was another interesting case

I also wanted users to be able to say:

> Keep focus mode active until this video finishes.

That sounds simple until you consider how YouTube works.

The video element might not exist immediately.

It can be replaced during navigation.

And the user can navigate to another video without a full page reload.

So the content script has to:

- Find the video element.
- Wait if it isn't available yet.
- Attach an \`ended\` listener.
- Remove the old listener when necessary.
- Detect video changes.
- Tell the background worker when the video finishes.

The resulting flow is roughly:

\`\`\`
Video ends
    ↓
Content script detects "ended"
    ↓
Send VIDEO_ENDED
    ↓
Background verifies session
    ↓
Session ends
    ↓
Remove focus classes
\`\`\`

I also decided that if a user starts an "until video ends" session for Video A and navigates to Video B, the session should end.

Otherwise the meaning of the session silently changes.

That kind of small product decision ended up affecting the architecture.

---

# I also didn't want to break YouTube

There was one rule I kept coming back to:

**If UnFeed breaks the video player, the extension has failed.**

I didn't want to delete YouTube elements from the DOM and then try to reconstruct them later.

Instead, UnFeed applies its own CSS classes to elements it wants to hide.

So the process is reversible:

\`\`\`
Normal YouTube
     ↓
Add focus classes
     ↓
Distractions hidden
     ↓
Remove focus classes
     ↓
Normal YouTube again
\`\`\`

This is also why the extension doesn't try to manipulate the actual video player.

The player, playback controls, captions, fullscreen, keyboard shortcuts, seeking, and other core functionality should continue working.

I tested these behaviors as part of the MVP.

---

# Keeping YouTube's changing DOM manageable

There's another uncomfortable truth about this project:

**I don't control YouTube.**

YouTube can change its DOM whenever it wants.

That means selectors such as:

\`\`\`
#secondary
#comments
#owner
#actions
\`\`\`

should never be treated as a permanent API.

Instead of scattering selectors throughout the codebase, I created a dedicated YouTube adapter that centralizes them.

So if YouTube changes something, the maintenance path is roughly:

\`\`\`
YouTube changes DOM
       ↓
Update youtubeAdapter.js
       ↓
Rebuild
       ↓
Test
\`\`\`

That doesn't make the extension immune to YouTube changes.

It just makes the damage much easier to contain.

And I think that's an important engineering distinction:

**You can't always eliminate fragility. Sometimes you can only isolate it.**

---

# What the architecture ended up looking like

The final extension has three main runtime pieces:

\`\`\`
                 React Popup
                    │
                    │ messages
                    ▼
          Background Service Worker
                    │
                    │ messages
                    ▼
              YouTube Content Script
                    │
                    ▼
                 YouTube DOM
\`\`\`

The responsibilities are deliberately separated.

### Popup

Handles the user interface:

- Focus level
- Session duration
- Timer display
- Start/stop controls
- Current state

### Background service worker

Owns the actual session:

- Session creation
- Persistence
- Timer alarms
- Session expiration
- Message routing
- Tab lifecycle

### Content script

Owns YouTube:

- DOM manipulation
- Focus CSS
- Navigation detection
- Dynamic DOM observation
- Video events

This separation became important because each part has a different lifecycle.

---

# Testing it

I didn't want to stop at "the extension loads."

I tested the actual behavior of the system.

Some of the scenarios included:

- Starting and stopping focus sessions
- Switching focus levels during an active session
- Timer persistence after closing the popup
- Timer expiration
- Video-end sessions
- Navigating between videos
- Dynamically loaded recommendations
- Closing the originating tab
- Service-worker suspension
- Playback controls
- Captions
- Fullscreen
- Keyboard shortcuts

The MVP passed the test cases I defined for these behaviors.

That doesn't mean UnFeed is bug-proof.

In particular, its dependence on YouTube's DOM means future YouTube changes can still break parts of the extension.

But the important thing is that I now have a clear place to fix those changes rather than having selectors and behavior scattered throughout the codebase.

---

# What I learned from building it

The project started because I wanted to solve a personal productivity problem.

But the thing I ended up learning wasn't really about productivity.

It was about **working inside a system you don't control.**

YouTube controls the DOM.

Chrome controls the extension lifecycle.

The browser controls when the service worker runs.

The user controls navigation.

The video controls its own playback lifecycle.

UnFeed has to sit between all of those things and remain reliable.

That forced me to think much more carefully about:

- State ownership
- Event-driven architecture
- Persistence
- Browser lifecycle
- DOM observers
- Defensive programming
- Reversible UI manipulation
- Failure handling

The biggest lesson was probably this:

> **The hard part of software is often not making something work once. It's making it continue working when everything around it changes.**

---

# What's next?

UnFeed is currently an MVP, so there are plenty of directions I could take it.

Some of the ideas I have are:

- Scheduled focus sessions
- Playlist/course mode
- Session statistics
- Channel allowlists
- More granular focus settings
- Better support for multiple YouTube tabs
- Potential cross-browser support

I'm deliberately not trying to build all of them immediately.

The current version already solves the problem I originally built it for:

**I can open a YouTube lecture, turn on Focus Mode, and remove most of the reasons to leave that lecture.**

And honestly, that's enough for version one.

---

# Final thoughts

I started UnFeed because I was getting distracted while trying to learn from YouTube.

I expected to spend some time writing CSS and building a small Chrome extension.

Instead, I ended up dealing with service-worker lifecycles, persistent state, SPA navigation, dynamic DOM updates, media events, message passing, and the general problem of building on top of a platform whose internals can change at any time.

That's probably my favorite part about side projects.

You start with:

> "I have a small problem."

And somewhere along the way, the problem teaches you something you didn't expect to learn.

For me, UnFeed started as a tool to help me focus.

It ended up becoming a pretty good lesson in building reliable software inside someone else's ecosystem.

**If you want to see the technical implementation in more detail, I've documented the architecture and engineering decisions on the [UnFeed project page].**`,
  },

  {
    id: 4,
    slug: "building-happit-habit-builder",
    title:
      "From a Simple Habit-Building Idea to a Production App: Building Happit",
    description:
      "The story behind Happit — from defining a product philosophy and writing a detailed PRD to building a full-stack habit tracker, designing its architecture, and deploying it to production.",
    date: "October 15, 2026",
    readTime: "12 min read",
    tags: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Drizzle ORM",
      "Product Development",
      "Full-Stack Development",
    ],
    homepage: true,
    coverImage: null,
    content: `## Introduction

I've always found side projects interesting for a particular reason.

They usually start with a small idea. Something you wish existed, something that could work a little better, or something you want to understand by building it yourself.

But the interesting part begins when you stop thinking about the idea as a feature and start thinking about it as a product.

That's exactly what happened with my latest project.

I wanted to build a habit tracker.

At first, that sounded relatively straightforward. Users would choose habits, record their progress, and see how consistently they were following their routines.

There are already plenty of applications that do this. So the question wasn't really whether I could build another habit tracker.

**The question was: what would make mine worth using?**

That question eventually led to **Happit** — a habit-building and consistency-tracking application built around a simple principle:

**Consistency matters more than perfection.**

What started as a product idea turned into a detailed requirements document, a phased development process, a full-stack TypeScript monorepo, and eventually a live application running on its own domain.

Here's how I got there.

---

## The idea: another habit tracker, but with a different philosophy

The first thing I had to figure out wasn't the technology stack.

It was the problem I wanted to solve.

Habit trackers often revolve around a familiar interaction:

You have a habit. You complete it. You check a box.

Repeat that for a few days, and you have a streak.

There's nothing inherently wrong with that approach. In fact, it works well for certain habits.

But I wanted to explore something slightly different.

**What if tracking a habit wasn't just about marking a task as complete, but about recording the effort you actually put into it?**

Consider reading.

One day, you might read five pages. Another day, you might read for forty minutes. Both sessions represent effort, even if they look different from a simple completed/not-completed status.

The same applies to exercise, meditation, learning to code, and plenty of other activities.

I wanted Happit to make that effort visible.

Instead of building the product around a perfect streak, I wanted to build it around sustainable behavior, recorded activity, and progress over time.

That became the foundation of the product.

---

## Defining the product before writing the code

My next step was to turn the idea into something concrete.

I didn't want to start building screens immediately and figure out the product as I went along. That approach can be fun for a small experiment, but a full-stack application needs more structure.

So I worked on a detailed Product Requirements Document, or PRD.

The goal was to establish a single source of truth for the project.

It covered the product philosophy, target users, feature requirements, user flows, UI/UX expectations, database design, API behavior, security, testing, deployment, and the roadmap.

More importantly, it helped me decide what Happit should *not* be.

I didn't want a bloated productivity platform with dozens of features competing for attention.

I wanted the core experience to remain focused:

- Choose habits that matter to you.
- Record the activities you perform.
- Understand your progress.
- Build routines that you can sustain.

This led to a few product principles that influenced almost every major decision.

### Consistency over perfection

Missing a day shouldn't make previous effort feel worthless.

### Progress over punishment

The application should help users understand their behavior, not make them feel guilty about it.

### Simplicity over feature bloat

Every feature should improve the core habit-building experience.

### Real activity over empty checkboxes

The system should capture meaningful activity data rather than relying exclusively on a binary completion state.

These principles became more than statements in a document. They helped me decide which features belonged in the MVP and which ones could wait.

---

## One important decision: a curated habit catalog

One of the earliest product decisions was how users would create their routines.

I could have allowed everyone to create completely custom habits with arbitrary targets, units, and schedules.

Instead, I chose a curated habit catalog for the MVP.

Users browse predefined habits and adopt the ones they want to include in their personal routine.

Why?

Because letting users define anything sounds flexible, but it also introduces complexity. Different definitions for similar habits can make validation, activity tracking, and progress calculations harder to reason about.

With a curated catalog, each habit has a canonical definition, including its target type, unit, and schedule. A user adopts that habit into their own routine without changing the shared definition.

It gives the application a more predictable foundation.

This was one of my first reminders that product development involves trade-offs. More flexibility isn't always better, especially when you're trying to build a focused first version.

---

## Planning the build in phases

Once the requirements were established, I broke development into phases.

I wanted each phase to have a clear purpose and a set of acceptance criteria, rather than letting the scope expand every time I came up with a new idea.

The implementation gradually brought together the application's foundation, its data model, the habit-management workflow, activity tracking, progress functionality, and the final production setup.

The important part was the dependency between those pieces.

Progress calculations are only useful when activity records are reliable. Activity records are only useful when habits are modeled correctly. And all of that depends on authentication, authorization, and a database that preserves the right relationships.

So I approached Happit as a sequence of connected systems rather than a collection of independent screens.

**The objective was to make each layer dependable before building more complexity on top of it.**

---

## Choosing the stack

For Happit, I decided to use TypeScript across the frontend and backend.

I'd already been working with React and Node.js, so this was an opportunity to use that experience to build something more complete.

The stack became:

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| Routing and UI | React Router, Tailwind CSS, Lucide React, Motion |
| Backend | Node.js, Express, TypeScript |
| Validation | Zod |
| Database | PostgreSQL |
| ORM and migrations | Drizzle ORM, Drizzle Kit |
| Testing | Vitest, Testing Library, Supertest |
| Local development | Docker Compose |
| Frontend deployment | Vercel |
| API deployment | Render |
| Production database | Neon PostgreSQL |

I also organized the project as an npm-workspaces monorepo.

The repository contains separate applications for the web frontend and API, while sharing one repository and a root-level development workflow.

That gave me a clear separation between the client and server without making local development unnecessarily complicated.

---

## Building the foundation: the database and API

Before a habit tracker can show meaningful progress, it needs a reliable way to represent what users do.

That made the data model one of the most important parts of the project.

The core schema includes:

- **Users** for account ownership.
- **Sessions** for authenticated access.
- **Habits** for canonical catalog definitions.
- **User habits** for the habits each user has adopted.
- **Activities** for the work users record against their habits.

The distinction between a catalog habit and an adopted habit is particularly important.

The catalog describes what a habit is. The user-habit relationship describes which habits belong to an individual's routine and how that routine is managed.

Activities then record the work associated with those adopted habits.

This structure lets Happit preserve a consistent catalog while keeping each user's routine separate.

### Why PostgreSQL and Drizzle?

I chose PostgreSQL for persistent, relational data and Drizzle ORM for typed database access and schema management.

Drizzle also gave me a migration workflow, so changes to the schema could be represented as versioned SQL rather than being applied informally.

I used Docker Compose to run PostgreSQL locally. That made it easier to develop and test the backend against a real database environment.

The result was a foundation that could support authentication, habit management, activity logging, and the progress features built on top of them.

---

## Building the habit-management workflow

With the core data model in place, I could build the first meaningful user workflow.

A user should be able to browse the habit catalog, adopt a habit, view their active routine, reorder habits, and manage the habits they've adopted.

That sounds simple, but there are several rules to enforce.

A user shouldn't be able to modify another user's routine. Archived habits shouldn't behave like active ones. Reordering should preserve the intended order. And the frontend shouldn't be trusted to enforce business rules on its own.

I organized the API into feature modules, with route handlers responsible for HTTP interactions and service modules handling the relevant business logic.

The frontend communicates with the API instead of accessing the database directly.

That separation keeps the application easier to reason about and gives the backend control over validation, authorization, and data changes.

It also made it easier to test the behavior of individual features without depending entirely on the UI.

---

## The core of Happit: recording real activity

This was the part where the original product philosophy became an actual implementation.

I wanted users to record activities in two ways:

**1. Timer-based tracking**

Users can start a timer when they begin an activity and record the work they have done.

**2. Manual logging**

Users can enter an activity directly when they don't need a running timer.

Different habits can have different target types and units, so the API needs to validate the recorded information against the relevant habit definition.

For example, a duration-based habit needs duration information, while a repetition-based activity represents a different kind of measurement.

I also wanted activity history to be useful beyond the moment an entry is created. The supported history workflows allow users to review and manage their recorded activities.

### Preventing duplicate activity records

Another detail worth handling was duplicate submissions.

A request can sometimes be retried because of a network issue, a repeated interaction, or another unexpected condition.

If the same activity is accidentally recorded twice, the user's history becomes unreliable.

Happit uses idempotency protection for activity creation to reduce the risk of duplicate records from repeated submissions.

It's not the kind of feature that makes for an impressive screenshot, but it's the kind of engineering detail that matters in an application that stores personal activity data.

**The data needs to be trustworthy before the product can provide useful feedback.**

---

## Turning activity into progress

Once users can record activity reliably, the next question is how to make that information useful.

A list of activity records is valuable, but it doesn't always make patterns obvious.

That's where the progress and history experience comes in.

Happit includes a dashboard and activity-history views that help users understand what they've been working on and how consistently they've been showing up. Progress visualizations, including heatmap-style history where available, make activity patterns easier to scan.

I wanted the dashboard to answer three questions quickly:

- What should I do today?
- What have I completed?
- How am I doing overall?

The goal wasn't to turn every interaction into a score.

It was to give users enough information to understand their behavior and make better decisions about their routines.

This also created a foundation for future features. Any progression system we introduce later should build on meaningful activity records rather than inventing progress disconnected from what the user actually did.

---

## Designing the experience

I didn't want Happit to look like a generic productivity dashboard.

The visual direction was deliberately minimal, premium, and dark.

The interface uses near-black backgrounds, slightly lighter surfaces, subtle borders, restrained rounded corners, and purple as the primary accent.

Typography also plays a role in the visual identity, with distinct type choices for branding, interface text, and numeric or timer-oriented information.

I tried to keep the interface focused on the task at hand.

Habit tracking already requires users to return to the application regularly. The UI shouldn't create more work than necessary.

That meant paying attention to the less glamorous details too:

- Loading states
- Empty states
- Error feedback
- Responsive layouts
- Direct navigation to application routes
- Clear interactions for recording and reviewing activities

A design can look excellent in a static mockup but still feel frustrating when real data, loading delays, and errors enter the picture.

The goal was to make the actual application feel as deliberate as the visual design.

---

## Testing the application instead of just running it

As the project grew, I needed a way to catch regressions without relying entirely on manual testing.

I used Vitest for automated tests, Testing Library for frontend behavior, and Supertest for API-level testing.

The checks covered the important parts of the application, including authentication, habit management, activity validation, and the relevant user workflows.

I also added project-wide quality commands for linting, TypeScript checks, tests, and builds.

One thing I learned is that a test failure doesn't always mean the application code is wrong.

Database-dependent tests, for example, need the expected database to be available and correctly configured. A connection failure can be an environment problem rather than a regression in the application itself.

That distinction matters because tests are only useful when you understand what they're actually verifying.

I treated testing as part of the development process, not a final checkbox before deployment.

---

## Taking Happit to production

Building the application locally was one milestone.

Making it available on the internet was another.

I wanted Happit to be accessible through a proper domain, with the frontend, API, and database deployed as separate services.

The production architecture became:

- **Frontend:** Vercel
- **Backend API:** Render
- **Database:** Neon PostgreSQL
- **Domain:** [happit.online](https://happit.online)

The browser communicates with the deployed frontend, which makes requests to the API. The API connects to PostgreSQL for persistent data.

The frontend's API URL is configured through an environment variable, while the backend uses its own configuration for database access, sessions, and allowed frontend origins.

### Deployment came with its own problems

Getting three services to work together introduces failure points that don't necessarily appear during local development.

The database connection must work in the deployed environment. The API must allow requests from the correct frontend origin. Authentication cookies must behave correctly across the deployed domains. And the frontend must handle direct navigation and page refreshes on nested routes.

I had to work through deployment configuration, database migrations, CORS settings, session behavior, and frontend routing before the complete production flow worked as intended.

I also verified the health endpoint and tested the core user flows against the deployed application.

One lesson from this stage was that deployment isn't just the final command you run after writing code.

**Production is another environment with its own architecture, configuration, and failure modes.**

A feature isn't truly finished just because it works on localhost.

---

## Making Happit installable

I also wanted Happit to feel convenient to return to.

That led to its Progressive Web App (PWA) support.

On supported devices and browsers, users can install Happit from the website and launch it from their home screen in an app-like window.

That means someone can access the habit tracker without going through a traditional app-store installation.

The service worker also supports caching parts of the application shell.

There is an important limitation, though: Happit is not a fully offline-first application. Authentication, fresh server data, and activity submissions still require a network connection. An offline activity queue with synchronization and conflict resolution is a possible future improvement, not something I claim the current version already provides.

I prefer being clear about those boundaries rather than describing a feature as more complete than it is.

---

## The architecture today

At a high level, Happit's request flow looks like this:

\`\`\`text
Browser / Installable PWA
          |
          v
React + Vite frontend
          |
          | HTTPS / REST API
          v
Express + TypeScript API
          |
          v
Feature modules and services
          |
          v
Drizzle ORM
          |
          v
PostgreSQL
\`\`\`

The frontend handles presentation and user interactions.

The API handles request validation, authentication and authorization, feature logic, and coordination with the database.

Drizzle provides the typed database access layer, while PostgreSQL stores the application's persistent data.

The separation gives each part a clear responsibility without adding architectural layers that the current implementation doesn't need.

It also leaves room to expand the product while keeping the core request flow understandable.

---

## What I learned from building Happit

This project taught me a lot more than how to connect React to an Express API.

### 1. Product decisions affect the data model

Choosing a curated catalog instead of arbitrary user-created habits wasn't just a UI decision. It shaped how habits, user-habit relationships, and activities needed to be represented.

### 2. A clear scope makes a project easier to finish

It's easy to keep adding ideas to a product. Writing a PRD and dividing the work into phases helped me distinguish the features needed for the MVP from features that could wait.

### 3. Data integrity matters more than visual polish alone

A beautiful progress dashboard is only useful if the underlying activity records are correct. Validation, authorization, database constraints, and duplicate-submission protection all contribute to that trust.

### 4. Production introduces a different class of problems

Local development doesn't fully reproduce cross-origin sessions, hosting configuration, production database access, DNS, and route-refresh behavior. Those problems require their own testing and debugging.

### 5. Finishing a project means more than making it work once

A production application needs documentation, repeatable setup instructions, migrations, quality checks, and a clear understanding of what is and isn't implemented.

The biggest lesson for me was that **building a product is as much about making deliberate decisions as it is about writing code.**

---

## What's next for Happit?

The current version focuses on getting the fundamentals right: accounts, a curated habit catalog, personal habit management, activity tracking, history, progress views, and a working production deployment.

But there is still plenty of room to grow.

Here are some of the directions I'd like to explore in future phases.

### Points and progression

A target-based points system could reward meaningful activity and make progress more tangible.

I also want to preserve point transactions and history rather than storing only a changing total. That would make the system easier to audit and help users understand where their progress comes from.

### Seasons and challenges

Seasons could introduce a shared timeframe for working toward goals. Challenges could give users a structured way to pursue a target over a period of time.

These systems would need to support consistency without making users feel punished for missing a day.

### Clans and social accountability

Eventually, I would like to explore clans and cooperative challenges.

The interesting question isn't how to create another leaderboard. It's how to make social features encourage people to show up for themselves and support each other without turning habit-building into unhealthy competition.

### Reminders and notifications

Thoughtful reminders could help users return to their routines at useful times.

I'd want these to remain configurable and purposeful rather than becoming another source of notification fatigue.

### Better offline support and analytics

A more capable offline experience could let users record activities without a connection and synchronize them later, with careful handling of duplicate submissions and conflicts.

Additional analytics could also help users identify patterns in their activity over longer periods.

These are future possibilities, not features that are all available today. I'll introduce them in stages, with each addition earning its place in the product.

**The goal is to make Happit more useful without making it more complicated than it needs to be.**

---

## Final thoughts

Happit started with a simple question:

What would a habit tracker look like if it focused more on sustainable consistency and less on perfect streaks?

Answering that question required much more than building a few screens.

I had to define the product, establish a data model, implement authentication, build the habit and activity workflows, create progress views, test the application, and connect everything to a production environment.

There were plenty of smaller decisions along the way, from choosing how users adopt habits to handling duplicate activity submissions and configuring authentication across deployed services.

And eventually, all those pieces came together into a working application.

**Happit is now live at [happit.online](https://happit.online).**

I'm proud of reaching this stage, but I'm also treating it as a foundation rather than a finish line.

There are more features to explore, more engineering decisions to make, and more opportunities to improve the experience.

For now, the most important thing is that the original idea has become something real — an application people can open, use, and return to.

And that is what makes building side projects so rewarding.

You start with a question.

You make a series of decisions.

You work through the problems you didn't anticipate.

And eventually, you have something that didn't exist before.

**That's Happit: built one phase at a time, with consistency at the center.**`,
  },
];
