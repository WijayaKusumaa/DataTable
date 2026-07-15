# 📊 Wijaya Data Table Explorer

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TanStack Table v8](https://img.shields.io/badge/TanStack_Table-v8-FF4154.svg?logo=react&logoColor=white)](https://tanstack.com/table/v8)

**Wijaya Data Table Explorer** is a premium, high-performance interactive data management and exploration application. Built on a modern tech stack featuring **React**, **TypeScript**, **Tailwind CSS v4**, and **TanStack Table v8**, it is polished with an elegant glassmorphic dark theme and fluid micro-interactions.

![Data Table Demo](Data%20Table.png)

---

## ✨ Key Features

*   🚀 **High Performance & Scalability**: Instantly loads and renders a dataset of **18,426 mock employee records** without any compromise on speed or responsiveness.
*   🔍 **Multidimensional Filtering & Search**: Offers an instant global search alongside column-specific filters (such as Status, Department, and Role).
*   ⚙️ **Dynamic Column Visibility**: Easily show or hide columns on the fly to customize the view according to your analysis requirements.
*   ↕️ **Multi-Column Sorting**: Sort records across multiple fields with clean, intuitive visual indicators.
*   ☑️ **Row Selection & Batch Actions**: Select individual or multiple rows with support for an indeterminate checkbox state.
*   📑 **Detailed Inspector Panel (Sidebar Drawer)**: Click on any row to slide open an interactive panel containing deep-dive employee details, activity logs, and system audit history.
*   🎨 **Premium Glassmorphic UI**: Tailored with HSL color systems, responsive layouts, icons by Lucide React, and smooth animations using Motion.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework & Engine** | [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Core application structure ensuring type safety and modular components. |
| **Build System** | [Vite](https://vite.dev/) | High-speed frontend build tool optimizing hot module replacement (HMR). |
| **Table Engine** | [TanStack Table v8](https://tanstack.com/table) | Powerful headless utility for managing state and formatting table data. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first CSS framework for rapid and performant layouts. |
| **UI Components** | [Radix UI primitives](https://www.radix-ui.com/) | Fully accessible, unstyled primitives for UI components like dropdowns, dialogs, and popovers. |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) & [Motion](https://motion.dev/) | Crisp vector iconography and micro-animations. |

---

## 📂 Project Directory Structure

```bash
6.Data Table/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── ui/         # Reusable UI component library (Radix & Shadcn UI)
│   │   │       ├── button.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── table.tsx
│   │   │       └── ...
│   │   └── App.tsx         # Main application layout and table logic
│   ├── styles/             # Global CSS styles & Tailwind configuration
│   └── main.tsx            # React application entry point
├── ATTRIBUTIONS.md         # Open-source attributions and licenses
├── package.json            # Scripts and dependencies configurations
└── vite.config.ts          # Vite configuration settings
```

---

## 🚀 Getting Started

Follow these steps to run the project locally on your system:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ is recommended).

### 2. Install Dependencies
Run the following command in the root folder of the project:
```bash
npm install
```
*(or use `pnpm install` / `yarn install` if preferred)*

### 3. Start Development Server
Launch the local development environment:
```bash
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### 4. Build for Production
To compile and optimize the application for production deployment:
```bash
npm run build
```

---

## 👥 Credits & Attribution

Designed, architected, and built with care by **Wijaya Kusuma**.

*   Modular UI component configurations inspired by [shadcn/ui](https://ui.shadcn.com/) (licensed under MIT).
*   Data schema optimized for demonstrating high-density visual exploration.

---
*Crafted to meet the highest standards of modern UI Engineering.*