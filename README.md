
# EDUYUG — Backend API
![Build Status](https://img.shields.io/badge/build-pending-yellow) ![License](https://img.shields.io/badge/license-MIT-blue)

Backend API for the Smart Education hackathon challenge.

One-liner:  
"An AI-powered learning platform that assesses a student's level, provides personalized courses, and uses a token-based economy to incentivize learning."

---

📚 Table of Contents
- [🌊 Application Workflow](#-application-workflow)
  - [Flowchart — User Journey](#flowchart---user-journey)
  - [Flowchart — Course Creation & Background Job](#flowchart---course-creation--background-job)
- [🚀 Setup and Run Instructions](#-setup-and-run-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [🛠️ Tech Stack and Libraries](#️-tech-stack-and-libraries)
- [✨ Key Features](#️-key-features)
- [⚠️ Known Limitations](#️-known-limitations)
- [🤖 AI & Pre-existing Code Disclosure](#️-ai--pre-existing-code-disclosure)
- [🗂️ Backend Structure & Important Files](#️-backend-structure--important-files)
- [📸 Visuals / Diagrams](#️-visuals--diagrams)
- [🔧 Operational Notes & Recommendations](#-operational-notes--recommendations)

---

## 🌊 Application Workflow

High-level user flow implemented by the backend: signup → initial quiz → level & tokens → recommended courses → create/enroll → AI generation → study → progress → badges. An AI chatbot runs in parallel.

### Flowchart — User Journey

```mermaid
flowchart TD
  Start([Start: User Signup])
  Start --> Domains["User selects domains"]
  Domains --> Quiz["Serve initial quiz (domain-based)"]
  Quiz --> Evaluate{Evaluate quiz results}
  Evaluate --> Level[Set user level<br/>(Beginner / Intermediate / Advanced)]
  Evaluate --> Tokens[Award initial tokens]
  Level --> Dashboard["Populate Recommended Courses (by domain+level)"]
  Tokens --> Wallet["User token wallet"]
  Dashboard --> Choice{"User action"}
  Choice -->|Create Course (-10 tokens)| CreateCourse
  Choice -->|Enroll in Course (-5 tokens)| EnrollCourse
  CreateCourse --> Placeholder["Create placeholder course (status=processing)"]
  Placeholder --> Queue["Enqueue AI generation job"]
  Queue --> AI["AI: generate chapters, quizzes, flashcards, Q&A, video metadata"]
  AI --> UpdateDB["Update course doc → status=ready"]
  EnrollCourse --> Enrolled["Add user to course participants"]
  UpdateDB --> Ready["Course ready — visible to users"]
  Ready --> Study["User studies: read | watch video | listen audio"]
  Study --> CompleteChapter{"Complete chapter?"}
  CompleteChapter -->|Yes| MarkComplete["Mark chapter complete"]
  MarkComplete --> Progress["Update progress tracker & streaks"]
  Progress --> Badges{"Course completed?"}
  Badges -->|Yes| AwardBadge["Award badge"]
  Study --> Revision["Quick revision: Quiz | Flashcards | Q&A"]
  Revision --> EarnTokens["Successful quiz → award tokens"]
  EarnTokens --> Wallet
  subgraph Chatbot [AI Chatbot]
    ChatbotUser[AI Chatbot: available anytime]
  end
  ChatbotUser --> Study
```

### Flowchart — Course Creation & Background Job

```mermaid
flowchart TD
  UI[Frontend POST /api/courses] --> API[Courses Controller]
  API --> AuthCheck{Verify tokens}
  AuthCheck -->|ok| Deduct[Deduct 10 tokens]
  Deduct --> CreatePlaceholder[(Insert course doc: status=processing)]
  API --> Enqueue[Enqueue: generateCourse job → JobQueue]
  subgraph Worker[Worker Environment]
    JobQueue[(Redis/Bull Queue)]
    WorkerProc[Worker Process]
    LLM[AI Service (LLM / prompt pipeline)]
    YoutubeSvc[YouTube metadata service]
    Validator[Sanitizer & Validator]
  end
  Enqueue --> JobQueue
  JobQueue --> WorkerProc
  WorkerProc --> LLM
  WorkerProc --> YoutubeSvc
  LLM --> Validator
  YoutubeSvc --> Validator
  Validator --> Update[(Update course doc with content)]
  Update --> CreatePlaceholder
  CreatePlaceholder -->|status=ready| API
  API --> UI
```

---

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js 18+ (or LTS matched to project)
- npm (or yarn)
- MongoDB (local or cloud)
- (Optional) Redis for job queue
- Git

### Installation

Open a terminal (Windows cmd / PowerShell):

```cmd
cd "d:\All Programs and Projects\Smart Education\backend"
git clone <your-repo-url> .
npm install
```

### Environment Variables

Copy the example env and populate keys:

```cmd
copy .env.example .env
```

Key variables (add to `.env`):

- MONGO_URI or DATABASE_URL = mongodb connection string
- JWT_SECRET = secret for JWT tokens
- PORT = 4000 (or your port)
- OPENAI_API_KEY (or other LLM key) = AI provider key
- YOUTUBE_API_KEY = (for Youtube metadata)
- REDIS_URL = (if using Bull/BullMQ)
- NODE_ENV = development

> Note: some config files are under `src/config/` (AI-Config.js, YoutubeConfig.js).

### Running the Server

Development:

```cmd
npm run dev
```

Production:

```cmd
npm run start
```

Seeder (populate initial courses & quizzes):

```cmd
npm run seed
```

(Seeder reads `src/config/datanew.json` and `quizzes.json`)

---

## 🛠️ Tech Stack and Libraries

| Category         | Technology / Libraries |
|------------------|------------------------|
| Runtime          | Node.js (v18+) |
| Framework        | Express.js |
| Database         | MongoDB (Mongoose) |
| Authentication   | JWT, bcrypt |
| AI / LLM         | Gemini API helper (AI-Config.js) |
| Media API        | YouTube Data API (YoutubeConfig.js) |
| Utils / Others   | axios, dotenv, nodemon, (logging) |

---

## ✨ Key Features

- Smart Onboarding: Initial domain-based quiz to assess level.
- Token Economy: Create (10 tokens) / Enroll (5 tokens) & earn tokens via quizzes.
- AI Course Generation: Background generation of chapters, quizzes, flashcards, and Q&A.
- Personalized Recommendations: Courses suggested by domain + user level.
- Multi-Modal Learning: Text chapters, embedded YouTube videos, audio lessons.
- Progress Tracking & Gamification: Chapter completion, course progress, badges.
- Integrated AI Chatbot: On-demand help for learners.

---

## ⚠️ Known Limitations

- AI generation is synchronous in code by default and can be slow — moving to a job queue is recommended.
- Limited retry / failure handling for long-running AI tasks (use persistent job queue & retries).
- No comprehensive test suite included (time constraints for hackathon).
- Some routes have minimal validation; sanitization may be required for untrusted LLM output.
- Large media (video audio) is represented by metadata only — no heavy media hosting implemented.

---

## 🤖 AI & Pre-existing Code Disclosure

- AI-Generated Code: Parts of boilerplate and helper functions were scaffolded with AI assistants (GitHub Copilot) and manual edits. This README’s flowcharts were composed manually and adapted from project logic.
- Pre-existing Code: The project uses an existing Express + Mongoose boilerplate (personal starter) and seeder JSON files (`src/config/*.json`) to accelerate development.
- Responsible AI Use: LLM outputs are sanitized where possible (see `src/config/getCourseLevel.js` and sanitizers). Do not expose raw LLM output to users without review in production.

---

## 🗂️ Backend Structure & Important Files

Top-level backend files/folders:

```
backend/
  ├─ src/
  │   ├─ config/
  │   │   ├─ AI-Config.js
  │   │   ├─ courseSeed.js
  │   │   ├─ datanew.json
  │   │   ├─ db.js
  │   │   ├─ env.js
  │   │   ├─ getCourseLevel.js
  │   │   ├─ quizSeed.js
  │   │   └─ YoutubeConfig.js
  │   ├─ controllers/
  │   │   ├─ auth.controller.js
  │   │   └─ course.controller.js
  │   ├─ middleware/
  │   │   └─ auth.middleware.js
  │   ├─ models/
  │   │   ├─ auth.model.js
  │   │   ├─ course.model.js
  │   │   └─ quiz.model.js
  │   └─ routes/
  │       ├─ auth.routes.js
  │       └─ course.routes.js
  ├─ package.json
  └─ README.md
```

Important endpoints (quick reference)
- POST /api/auth/signup — sign up & domain selection, returns initial quiz
- POST /api/auth/submit-initial-quiz — submit initial quiz, award tokens and assign level
- POST /api/courses — create course (deduct tokens, enqueue generation)
- GET /api/courses/:id — get course by id (polling for status)
- POST /api/courses/:id/enroll — enroll user (deduct tokens)
- GET /api/quizzes/:courseId — fetch quizzes
- POST /api/quizzes/:quizId/submit — submit quiz (earn tokens)

(See `src/routes/` for full route definitions.)

---

## 📸 Visuals / Diagrams

Use the two provided images to visually explain onboarding and progress — place them here so GitHub can render them in the README.

Place the images in `backend/docs/` and name them:

- `backend/docs/onboarding_flow.png` (user onboarding & personalization)
- `backend/docs/progress_flow.png` (learning & progress tracking)

Embed in README:

![Onboarding & Personalization](./assets/images/flow-chart-1.jpg)
![Learning & Progress Tracking](./assets/images/flow-chart-2.jpg)

> NOTE: I included two diagram **Mermaid** charts above for direct rendering on GitHub. If you prefer static images, add the two PNGs into `backend/docs/` using the filenames above.

---

## 🔧 Operational Notes & Recommendations

- Use a robust job queue (Bull/BullMQ + Redis) for AI course generation. This prevents timeouts and allows retries.
- Add monitoring/observability (Sentry / Datadog / Prometheus) for long-running tasks.
- Implement content moderation for LLM outputs.
- Scale AI calls: batch requests and cache repeated prompts.
- Consider rate-limiting endpoints that invoke AI.

---

If you want, I can:
- A) Commit the two PNGs into `backend/docs/` and update the README to reference them (upload the images here or confirm names).
- B) Export the Mermaid diagrams to SVG and place them into `backend/docs/` for guaranteed rendering.
- C) Scaffold a BullMQ worker and sample `generateCourse` job (producer + consumer) and add it to `src/workers/`.

