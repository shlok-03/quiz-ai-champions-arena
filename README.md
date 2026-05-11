# 🧠 Quiz AI Champions Arena

An AI-powered quiz generator that creates custom multiple-choice questions on any topic, with live scoring, difficulty levels, and a player leaderboard.

🔗 **Live App:** [quiz-ai-champions-arena.lovable.app](https://quiz-ai-champions-arena.lovable.app)

---

## ✨ Features

- 🤖 **AI-Generated Questions** — Enter any topic and get unique questions every time
- 🎯 **3 Difficulty Levels** — Easy, Medium, and Hard with adaptive question depth
- 🏆 **Leaderboard** — Track top scores across players
- 📊 **Score History** — View past quiz attempts by player name
- 💡 **Explanations** — Every answer includes an AI-generated explanation
- 🔒 **Secure Backend** — AI calls handled server-side via Supabase Edge Functions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Database + Edge Functions) |
| AI | Google Gemini via Lovable AI Gateway |
| Hosting | Lovable |

---

## 🗄 Database Schema

```sql
-- Stores each quiz session
quizzes (
  id uuid PRIMARY KEY,
  topic text,
  difficulty text,
  player_name text,
  question_count integer,
  created_at timestamptz
)

-- Stores individual questions per quiz
questions (
  id uuid PRIMARY KEY,
  quiz_id uuid REFERENCES quizzes(id),
  question_index integer,
  question text,
  options jsonb,
  correct_answer text,
  explanation text
)

-- Stores final scores
scores (
  id uuid PRIMARY KEY,
  quiz_id uuid REFERENCES quizzes(id),
  player_name text,
  topic text,
  difficulty text,
  score integer,
  total_questions integer,
  credits integer,
  lives_remaining integer,
  created_at timestamptz
)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Lovable](https://lovable.dev) account

### Local Development

```bash
# Clone the repo
git clone https://github.com/shlok-03/quiz-ai-champions-arena.git
cd quiz-ai-champions-arena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file at the root with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```


### Supabase Setup

1. Create a new Supabase project
2. Run the migration files in `supabase/migrations/` via the SQL Editor
3. Deploy the edge function:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy generate-quiz
```

4. Add the `LOVABLE_API_KEY` secret in **Supabase → Edge Functions → Secrets**

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── integrations/
│   └── supabase/      # Supabase client + generated types
├── pages/             # Route-level page components
├── types/             # TypeScript type definitions
└── utils/             # Helper functions (quiz generation, scoring)

supabase/
├── functions/
│   └── generate-quiz/ # Edge function — AI question generation
└── migrations/        # Database schema migrations
```

---

## 🎮 How It Works

1. Player enters their name, a topic, question count, and difficulty
2. The app calls the `generate-quiz` Supabase Edge Function
3. The edge function sends a structured prompt to the AI model
4. Questions are returned with 4 options, a correct answer, and an explanation
5. Quiz data is saved to Supabase (`quizzes` + `questions` tables)
6. Player answers questions and receives a final score
7. Score is saved to the `scores` table and shown on the leaderboard

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License — feel free to use and modify for your own projects.

---

## 👤 Author

**Shlok Gor**
- GitHub: [@shlok-03](https://github.com/shlok-03)
- LinkedIn: [linkedin.com/in/shlok-gor-a82717270](https://linkedin.com/in/shlok-gor-a82717270)
