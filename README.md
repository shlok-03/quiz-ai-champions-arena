# Quiz AI Champions Arena
## Project Description

Quiz AI Champions Arena is an AI-powered quiz web application where users can enter their name, choose a topic, select difficulty, generate quiz questions, answer them, earn credits, and appear on a live leaderboard. The app uses React and TypeScript for the frontend and Supabase for backend database integration.
## Local Setup

1. Clone the repository

git clone https://github.com/shlok-03/quiz-ai-champions-arena.git

2. Open the project folder

cd quiz-ai-champions-arena

3. Install dependencies

npm install

4. Create a .env file

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id

5. Run the app

npm run dev
## Supabase Integration

The project uses Supabase for backend storage and quiz data persistence.

Main tables:
- quizzes
- questions
- scores
- leaderboard

The app stores generated quizzes, question options, player scores, lives remaining, credits, and leaderboard rankings.
