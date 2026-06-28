# Personal Engineering Portfolio

A responsive, high-performance developer portfolio built with **Vite**, **React 19**, **Tailwind CSS**, and **Framer Motion**. This website showcases engineering projects, technical blogs, career experience, and skills with interactive components and smooth, modern micro-interactions.

---

## 🚀 Key Features

*   **Screenshot Slideshows**: Major projects showcase actual application screenshots in an interactive carousel featuring:
    *   Framer Motion horizontal slide transitions.
    *   Autoplay (every 4 seconds) with pause-on-hover logic.
    *   Manual navigation controls (chevron buttons and clickable dot indicators).
*   **Full-Screen Lightbox**: Clicking on screenshots on the details page opens a full-screen, responsive, and uncropped overlay (`object-contain`). Supports arrow keys navigation (`ArrowLeft` / `ArrowRight`) and close shortcut (`Escape`).
*   **Unified Dark Theme**: Beautiful and consistent dark mode styling across the entire portfolio, including a dedicated, fully-dark **All Projects** list.
*   **Responsive & Modular Layouts**:
    *   Alternating image/text project cards.
    *   Graceful fallback for minor projects (rendered as neat grid cards without images/placeholders).
*   **Custom Interactive Cursor**: Smooth cursor tracking and custom hover animations for links and buttons.
*   **Observability & observed latency metrics** documented for production systems.

---

## 🛠️ Tech Stack

*   **Core**: React 19, JavaScript (ESM)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, PostCSS, Autoprefixer
*   **Animations**: Framer Motion (for spring physics and page transitions)
*   **Icons**: React Icons (Tabler Icons, Bootstrap Icons, Font Awesome)
*   **Routing**: React Router Dom v7

---

## 📂 Project Structure

```
illustration-portfolio/
├── public/                  # Static assets (Favicons, Resumes, SVGs)
├── src/
│   ├── assets/              # Component images & project screenshots
│   │   ├── devboard/        # DevBoard demo screenshots (1 to 8)
│   │   └── realtimecodeeditor/ # CodeEditor demo screenshots (1 to 3)
│   ├── components/          # Page sections & layout components
│   │   ├── shared/          # Reusable shared components
│   │   │   ├── ImageSlideshow.jsx # Carousel & Lightbox component
│   │   │   ├── ProjectCard.jsx    # Alternating list card
│   │   │   ├── BlogCard.jsx       # Blog grid card
│   │   │   └── SectionHeader.jsx  # Page section headers
│   │   ├── About.jsx        # Bio and Education
│   │   ├── Skills.jsx       # Interactive skill category grid
│   │   ├── Experience.jsx   # Interactive work history timeline
│   │   ├── Contact.jsx      # Gmail / LinkedIn contact panel
│   │   ├── Navbar.jsx       # Floating sticky navigation bar
│   │   └── Footer.jsx       # Sleek bottom footer
│   ├── data/                # Data structures (projects.js, blogs.js)
│   ├── pages/               # Main React routes (Home, Projects, Details, Blog)
│   ├── utils/               # Canvas cursor particles & configurations
│   ├── App.jsx              # Main App entrypoint & routing config
│   ├── index.css            # Tailwind directives and custom utility fonts
│   └── main.jsx             # React DOM renderer
├── package.json             # NPM dependencies & scripts
└── tailwind.config.js       # Custom configuration (fonts, keyframes, transitions)
```

---

## 🔧 Installation & Local Setup

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   NPM (v9.0.0 or higher)

### Setup Instructions

1.  **Clone the Repository**:
    ```sh
    git clone https://github.com/Saurabhkumargit/my-portfolio.git
    cd my-portfolio
    ```

2.  **Install Dependencies**:
    ```sh
    npm install
    ```

3.  **Start the Local Development Server**:
    ```sh
    npm run dev
    ```
    The site will start running locally at: `http://localhost:5173/`

4.  **Production Build**:
    To compile and minify the project for production deployment:
    ```sh
    npm run build
    ```

5.  **Lint Codebase**:
    To scan and format the files with ESLint:
    ```sh
    npm run lint
    ```

---

## 📦 Projects Showcased

1.  **DevBoard**: Cloud-native task management platform built on backend microservices, Docker, Kubernetes (HPA), and Redis cache. Deployed and automated with GitHub Actions.
2.  **Real-Time Collaborative Code Editor**: Multi-user real-time document editing built using React, WebSockets, and Socket.IO.
3.  **System Monitor**: Node.js WebSocket-driven server monitor visualizing system metrics on a Chart.js dashboard.
4.  **Inventory Manager**: Full-stack inventory manager with role-based access control and detailed audit logs.
5.  **Sorting Visualizer**: Hardware-accelerated SDL2 C++ desktop application showing real-time sorting transitions.

---

## 🤝 Connect With Me

*   **Engineer**: Saurabh Kumar Tiwari
*   **Email**: [saurabhkumar.t21@gmail.com](mailto:saurabhkumar.t21@gmail.com)
*   **LinkedIn**: [linkedin.com/in/saurabhkumartiwari](https://www.linkedin.com/in/saurabhkumartiwari/)
*   **GitHub**: [github.com/Saurabhkumargit](https://github.com/Saurabhkumargit/)
