# 🏆 Quiz AI Champions Arena

A full-stack AI-powered quiz web application built with React, Lovable Cloud, and Supabase. Players can generate custom quizzes on any topic using AI, compete for high scores, and view a live leaderboard backed by an external Supabase database.

---

## 🚀 Live Demo

https://quiz-ai-champions-arena.vercel.app

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database](#database)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [CRUD Operations](#crud-operations)
- [RLS Policies](#rls-policies)
- [Project Structure](#project-structure)
- [Author](#author)

---

## ✨ Features

- 🤖 **AI-Generated Questions** — Enter any topic and difficulty, and the app generates quiz questions in real time using Claude AI
- 🎮 **Lives System** — Players have 3 lives; wrong answers cost a life
- 💰 **Credits System** — Earn +10 credits per correct answer
- 🏅 **Leaderboard** — Live leaderboard showing top scores from all players, powered by Supabase
- ✏️ **Full CRUD** — Create, read, update, and delete quiz results directly from the leaderboard
- 🔐 **Authentication** — User sign-up and login via Lovable Cloud Auth
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router |
| Backend / Auth | Lovable Cloud (Supabase-powered) |
| External Database | Supabase (PostgreSQL) |
| AI | Claude AI (Anthropic) via Lovable |
| Hosting | Lovable Cloud |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│             React Frontend               │
│         (Lovable Cloud hosted)           │
├──────────────────┬──────────────────────┤
│  Lovable Cloud   │   External Supabase  │
│  (Auth, Quizzes, │   (quiz_results      │
│   Questions,     │    table — CRUD)     │
│   Scores)        │                      │
└──────────────────┴──────────────────────┘
```

The app uses **two Supabase backends**:
- **Lovable Cloud** — handles authentication, quiz generation metadata, internal scores, and questions
- **External Supabase** — dedicated `quiz_results` table demonstrating full CRUD with RLS policies

---

## 🗄 Database

### External Supabase — `quiz_results` Table

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `player_name` | TEXT | Name of the player |
| `score` | INTEGER | Number of correct answers |
| `total_questions` | INTEGER | Total questions in the quiz |
| `category` | TEXT | Topic of the quiz |
| `created_at` | TIMESTAMP | Auto-generated timestamp |

### Schema

```sql
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER,
  category TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/shlok-03/quiz-ai-champions-arena.git

# Navigate into the project
cd quiz-ai-champions-arena

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> The external Supabase client is configured in `src/integrations/external-supabase.ts`.

---

## ⚙️ CRUD Operations

All four CRUD operations are implemented via the external Supabase client in `src/integrations/external-supabase.ts`.

### Create
A quiz result is automatically inserted into `quiz_results` when a player finishes a quiz. A manual entry form is also available on the Leaderboard page.

```ts
await insertQuizResult({ player_name, score, total_questions, category });
```

### Read
The leaderboard fetches all results from Supabase, sorted by score descending.

```ts
const results = await fetchQuizResults();
```

### Update
Each row on the leaderboard has an Edit button that opens inline editing for `player_name`, `score`, and `category`.

```ts
await updateQuizResult(id, { player_name, score, category });
```

### Delete
Each row has a Delete button with a confirmation dialog before removal.

```ts
await deleteQuizResult(id);
```

---

## 🔒 RLS Policies

Row Level Security is enabled on the `quiz_results` table. The following policies allow both anonymous and authenticated users to perform all operations:

```sql
-- SELECT
CREATE POLICY "Allow all select" ON quiz_results
FOR SELECT TO anon, authenticated USING (true);

-- INSERT
CREATE POLICY "Allow all insert" ON quiz_results
FOR INSERT TO anon, authenticated WITH CHECK (true);

-- UPDATE
CREATE POLICY "Allow anon update" ON quiz_results
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- DELETE
CREATE POLICY "Allow anon delete" ON quiz_results
FOR DELETE TO anon, authenticated USING (true);
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── quiz/
│   │   ├── SetupScreen.tsx       # Quiz configuration screen
│   │   ├── PlayingScreen.tsx     # Active quiz gameplay
│   │   └── LoadingScreen.tsx     # AI generation loading state
│   ├── Leaderboard.tsx           # Full CRUD leaderboard
│   ├── QuizGame.tsx              # Main quiz controller
│   └── TrophyDisplay.tsx        # Results screen
├── integrations/
│   ├── supabase/
│   │   └── client.ts             # Lovable Cloud client
│   └── external-supabase.ts     # External Supabase client (CRUD)
├── services/
│   ├── QuizService.ts            # AI question generation
│   └── LeaderboardService.ts    # Lovable Cloud leaderboard
├── hooks/
│   └── useAuth.ts                # Authentication hook
└── types/
    └── quiz.ts                   # TypeScript interfaces
```

---

## 👤 Author

**Shlok Gor**
- Email: shlok3330@gmail.com
- LinkedIn: [linkedin.com/in/shlok-gor-a82717270](https://linkedin.com/in/shlok-gor-a82717270)
- Montreal, QC

---

## 📄 License

This project was built as part of the AEC Internet Programming program at TAV College, Montreal.
