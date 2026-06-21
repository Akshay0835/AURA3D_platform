# AURA 3D — AI-Powered Biomechanical Fitness & Nutrition SaaS

Aura 3D is a next-generation web application designed for hybrid athletes, fitness enthusiasts, and coaches. It integrates cutting-edge **WebGL 3D biomechanics, interactive telemetry dashboards, and an AI coaching engine** to deliver real-time physiological tracking, kinetic simulation, and personalized fitness planning.

---

## 🚀 Key Features

### 1. Interactive 3D Biomechanics & Motion Lab
* **Real-time Kinetic Simulation:** Visualizes joint torque, muscle load, and range of motion.
* **Interactive Anatomy Mapping:** Clickable 3D physiological selection elements that highlight active muscle fibers and load distributions.
* **3D AI Avatar Trainer:** Renders a virtual trainer avatar surrounded by orbiting dynamic telemetry nodes.

### 2. Comprehensive Dashboard HUD
* **Biometric Telemetry HUD:** A dashboard tracking metrics like user streaks, active calorie burn indicators, water consumption, and sleep hours.
* **Calorie Rings & Macro Tracking:** Custom circular progress metrics showing calories consumed vs. targets.
* **Dynamic Historical Visualization:** Interactive line and area charts for weight progression, macro distributions (protein, carbs, fats), and sleep patterns.

### 3. Workout Builder & Live Workout Tracker
* **Interactive Syllabus:** Customize workouts by category (Strength, Cardio, HIIT, Flexibility).
* **Live Workout Timer & Calibration Engine:** Start live sessions with active pacing timers. Check off sets, weights, and reps in real-time.
* **AI Workout Generator:** Instantly generate personalized routine plans using parameters such as fitness goals, experience level, frequency, and available equipment.

### 4. Macro & Nutrition Engine
* **Meal Categorization:** Log meals (Breakfast, Lunch, Dinner, Snacks) with precise macronutrient details.
* **AI Meal Plan Generator:** Custom nutrition plans tailored to caloric goals, target weight, and dietary preferences.

### 5. AI Coach Console & Voice Control
* **Contextual Conversations:** Chat with an AI Coach to adjust weight goals, review nutrition logs, and get recommended plans.
* **Natural Voice Command Simulation:** Voice console interface allows logging foods, starting workouts, or adjusting stats via speech recognition simulation.

---

## 🛠️ Technology Stack

* **Core Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
* **3D Renderers:** [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) & [`@react-three/drei`](https://github.com/pmndrs/drei)
* **Interactive Animations:** [Framer Motion 12](https://www.framer.com/motion/)
* **State Management:** [Zustand 5](https://github.com/pmndrs/zustand)
* **Styling System:** [Tailwind CSS v4.0](https://tailwindcss.com/)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Form & Validation Schema:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📂 File Architecture

```bash
src/
├── app/
│   ├── dashboard/                # Main Application Dashboard
│   │   ├── analytics/            # Biomechanical insight charts
│   │   ├── bmi/                  # Body Mass Index and composition logs
│   │   ├── coach/                # AI Coach conversational interface
│   │   ├── command-center/       # Central configuration & telemetry HUD
│   │   ├── nutrition/            # Daily macro tracking & meal planner
│   │   ├── profile/              # User account & biological profile configuration
│   │   ├── workout/              # Interactive workout builder & live session tracer
│   │   ├── layout.tsx            # Dashboard shell navigation and sidebar
│   │   └── page.tsx              # Biometric Telemetry HUD dashboard page
│   ├── landing/
│   │   └── page.tsx              # Interactive product landing page
│   ├── layout.tsx                # App root layout with theme context
│   └── page.tsx                  # Root redirection node
├── components/
│   ├── dashboard/                # Dashboard Widgets
│   │   ├── ai-avatar-trainer.tsx # 3D Avatar canvas with telemetry rings
│   │   ├── calorie-burn-visualizer.tsx # Recharts calorie history
│   │   ├── insights-panel.tsx    # Recommendations & insights matrix
│   │   ├── interactive-human-body.tsx # Clickable skeletal & muscle maps
│   │   ├── sidebar.tsx           # Sleep, dark mode toggler, and page router
│   │   └── voice-console.tsx     # Voice interactive logging console
│   └── landing/                  # Landing Page Components
│       ├── biomechanical-motion-lab.tsx # WebGL biometric motion tracking
│       ├── coach-demo.tsx        # Simulated AI coach terminal widget
│       ├── fitness-hero-3d.tsx   # 3D canvas rendering holographic charts
│       ├── hero-canvas.tsx       # 3D mesh components and sways
│       ├── interactive-hero-scrubber.tsx # Dynamic timelines & scrubbers
│       └── pricing.tsx           # Subscription levels
└── store/
    └── useAppStore.ts            # Global Zustand State Management Store
```

---

## 📊 State Management Schema (`Zustand`)

The global application state is managed by `useAppStore.ts` and contains:
* **Theme Control:** Toggles and persists `dark` vs `light` mode.
* **User Profile:** Real-time statistics (`weight`, `height`, `streak`, `waterConsumed`, `calorieGoal`).
* **Active Workout Session Engine:**
  * Timer intervals tracking duration.
  * Interactive tracking of sets completed (`toggleExerciseSet`).
  * Live status triggers (`startLiveWorkout`, `pauseLiveWorkout`, `completeLiveWorkout`).
* **Nutrition History:** Logs, structures, and calculates daily nutritional intake totals.
* **AI Coach Logs:** Interactive chat history, milestone tracks, and recommendations.

---

## 🔍 Functional File Mapping (Where Features are Located)

Here is a directory map of the primary user-facing functions, visualizers, and state handlers in the project:

| Feature / Function | Front-end UI Component / Page | State / Logic File |
| :--- | :--- | :--- |
| **Biomechanics WebGL Motion Lab** | [biomechanical-motion-lab.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/landing/biomechanical-motion-lab.tsx) | *Simulated WebGL joint and range of motion trackers* |
| **Interactive 3D Holographic Hero Canvas** | [fitness-hero-3d.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/landing/fitness-hero-3d.tsx) & [hero-canvas.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/landing/hero-canvas.tsx) | *Self-contained Three.js / React Three Fiber visualizers* |
| **Workout Planner & Exercises Builder** | [workout/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/workout/page.tsx) | [useAppStore.ts (Workout State)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L321-L478) |
| **Active Live Workout Session Tracker & Timer** | [workout/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/workout/page.tsx) | [useAppStore.ts (Timer/Completed Sets actions)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L321-L430) |
| **Daily Nutrition Log, Calorie tracker & Meal Plan** | [nutrition/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/nutrition/page.tsx) | [useAppStore.ts (Nutrition Logs)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L480-L540) |
| **Body Composition Log & BMI calculations** | [bmi/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/bmi/page.tsx) | [useAppStore.ts (addBmiEntry & history)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L542-L569) |
| **AI Coach Chat Console & Suggestions** | [coach/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/coach/page.tsx) & [coach-demo.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/landing/coach-demo.tsx) | [useAppStore.ts (Chats store & responses)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L594-L669) |
| **Interactive Voice Console Command Interface** | [voice-console.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/voice-console.tsx) | *Simulated Web Speech API text processor & action trigger* |
| **Interactive 3D Avatar Trainer (with telemetry nodes)** | [ai-avatar-trainer.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/ai-avatar-trainer.tsx) | *Three.js rendering integrated with Zustand user context* |
| **Interactive Skeletal Muscle Selection Map** | [interactive-human-body.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/interactive-human-body.tsx) | *SVG coordinate layout mapping and muscle group selection* |
| **Calorie Logs & Analytics charts visualizer** | [analytics/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/analytics/page.tsx) & [calorie-burn-visualizer.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/calorie-burn-visualizer.tsx) | [useAppStore.ts (calorieHistory / weightHistory)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L571-L592) |
| **Telemetry Command Center HUD** | [command-center/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/command-center/page.tsx) | [useAppStore.ts (Profile calibration)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L212-L242) |
| **User Profile Configuration** | [profile/page.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/app/dashboard/profile/page.tsx) | [useAppStore.ts (updateUser actions)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L244-L246) |
| **Global Theme System (Dark / Light Mode)** | [theme-provider.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/theme-provider.tsx) & [sidebar.tsx](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/components/dashboard/sidebar.tsx) | [useAppStore.ts (theme & toggleTheme)](file:///Users/akshaypartapsingh/Documents/biplove_sir_project/src/store/useAppStore.ts#L193-L210) |

---

## 💻 Developer Setup & Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### ⚙️ Installation
1. Clone the repository and navigate into the root directory:
   ```bash
   cd biplove_sir_project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 🏃 Running Locally (Development Mode)
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 🏗️ Building for Production
Verify typescript compilation and build production assets:
```bash
npm run build
```

### 🔍 Linting
Run static code analysis:
```bash
npm run lint
```
