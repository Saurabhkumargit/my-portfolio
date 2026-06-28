import devboard1 from '../assets/devboard/devboarddemo1.png';
import devboard2 from '../assets/devboard/devboarddemo2.png';
import devboard3 from '../assets/devboard/devboarddemo3.png';
import devboard4 from '../assets/devboard/devboarddemo4.png';
import devboard5 from '../assets/devboard/devboarddemo5.png';
import devboard6 from '../assets/devboard/devboarddemo6.png';
import devboard7 from '../assets/devboard/devboarddemo7.png';
import devboard8 from '../assets/devboard/devboarddemo8.png';

import realtime1 from '../assets/realtimecodeeditor/realtimedemo1.png';
import realtime2 from '../assets/realtimecodeeditor/realtimedemo2.png';
import realtime3 from '../assets/realtimecodeeditor/realtimedemo3.png';

export const projects = [
  {
    id: 1,
    slug: 'devboard',
    title: 'DevBoard',
    shortDescription:
      'Cloud-native task management platform built with modern backend and DevOps practices.',
    fullDescription:
      'DevBoard is a production-grade task management platform designed around cloud-native principles. It features JWT-based authentication, a PostgreSQL database with Prisma ORM, Redis for caching and session management, and is fully containerized with Docker.\n\nThe application is deployed on Kubernetes with Horizontal Pod Autoscaling (HPA), monitored via Prometheus and Grafana dashboards, and automated through GitHub Actions CI/CD pipelines.\n\nThe architecture prioritizes observability and scalability from the outset — with structured logging, metric scraping, and threshold-based alerting configured for every service.',
    technologies: [
      'React',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Prisma',
      'Redis',
      'Docker',
      'Kubernetes',
      'Prometheus',
      'Grafana',
      'GitHub Actions',
      'JWT',
    ],
    github: 'https://github.com/Saurabhkumargit/devboard/',
    liveDemo: 'https://devboard-rouge.vercel.app/login/',
    homepage: true,
    completed: true,
    category: 'devops',
    year: 2024,
    coverImage: devboard1,
    screenshots: [
      devboard1,
      devboard2,
      devboard3,
      devboard4,
      devboard5,
      devboard6,
      devboard7,
      devboard8,
    ],
    metrics: [
      'HPA scaling from 2 to 5 pods under load',
      '500+ concurrent request load testing',
      'Sub-100ms P95 API latency',
    ],
  },
  {
    id: 2,
    slug: 'realtime-code-editor',
    title: 'Real-Time Collaborative Code Editor',
    shortDescription:
      'Collaborative coding platform supporting synchronized multi-user editing in real time.',
    fullDescription:
      'A real-time collaborative code editor built on WebSockets using Socket.IO. The platform supports multiple users editing the same document simultaneously, with live presence tracking showing active collaborators, a room-based architecture for session isolation, and intelligent reconnection logic to handle network disruptions gracefully.\n\nThe synchronization engine uses an event-driven approach to broadcast diff updates between clients, minimizing data transfer while maintaining consistent state across all connected sessions.',
    technologies: ['Node.js', 'React', 'Socket.IO', 'WebSockets', 'Express.js'],
    github: 'https://github.com/Saurabhkumargit/RealTime-CodeEditor/',
    liveDemo: 'https://synccodex.vercel.app/',
    homepage: true,
    completed: true,
    category: 'real-time',
    year: 2024,
    coverImage: realtime1,
    screenshots: [
      realtime1,
      realtime2,
      realtime3,
    ],
    metrics: [],
  },
  {
    id: 3,
    slug: 'system-monitor',
    title: 'System Monitor',
    shortDescription:
      'Real-time system resource monitoring and alerting platform for distributed infrastructure.',
    fullDescription:
      'A lightweight but capable system monitoring tool that tracks CPU, memory, disk I/O, and network usage across distributed nodes in real time. Metrics are streamed via WebSockets and visualized on a live dashboard. Alerting rules can be configured per metric with configurable thresholds.\n\nBuilt with extensibility in mind — new metric collectors can be added as plugins without modifying the core monitoring engine.',
    technologies: ['Node.js', 'WebSockets', 'React', 'Prometheus', 'Chart.js'],
    github: 'https://github.com/Saurabhkumargit/System-Monitor/',
    homepage: false,
    completed: true,
    category: 'devops',
    year: 2024,
    coverImage: null,
    screenshots: [],
    metrics: [],
  },
  {
    id: 4,
    slug: 'inventory-manager',
    title: 'Inventory Manager',
    shortDescription:
      'Scalable inventory tracking system with role-based access control and detailed reporting.',
    fullDescription:
      'A full-stack inventory management system designed for small-to-medium businesses. Features include role-based access control (admin, manager, viewer), real-time stock updates, complete audit logging for all inventory mutations, and exportable reports in CSV format.\n\nBuilt with an Express.js REST API backend, a MongoDB database, and a React frontend using Chakra UI components for a clean, accessible interface.',
    technologies: ['React', 'Express.js', 'MongoDB', 'Chakra UI', 'JWT'],
    github: 'https://github.com/Saurabhkumargit/Inventory-Manager/',
    homepage: false,
    completed: true,
    category: 'fullstack',
    year: 2023,
    coverImage: null,
    screenshots: [],
    metrics: [],
  },
  {
    id: 5,
    slug: 'sorting-visualizer',
    title: 'Sorting Visualizer',
    shortDescription:
      'Desktop application built with C++ and SDL2 that visually demonstrates how different sorting algorithms work using animated, color-coded bars.',
    fullDescription:
      'A high-performance desktop application designed to visually demonstrate the behavior of six classic sorting algorithms. The visualizer uses animated, color-coded bars to represent array elements, showing real-time comparisons, swaps, and final sorting states.\n\nBuilt natively with C++17 and SDL2 for smooth, hardware-accelerated rendering. It features adjustable array size and delay settings (configurable via the source code) and clean, outlined bars to maximize clarity. This tool serves as an intuitive educational resource for students, educators, and anyone interested in understanding data structures and algorithms.',
    technologies: ['C++', 'SDL2', 'MinGW', 'C++17'],
    github: 'https://github.com/Saurabhkumargit/sortingvisualizer/',
    homepage: false,
    completed: true,
    category: 'Algorithms & Data Structures',
    year: 2024,
    coverImage: null,
    screenshots: [],
    metrics: [
      'Visual representation of 6 sorting algorithms',
      'Smooth hardware-accelerated SDL2 rendering',
      'Interactive color-coded state tracking (comparisons, swaps, sorted)',
    ],
  },
];
