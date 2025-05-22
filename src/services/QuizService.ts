
import { Question } from '@/types/quiz';
import { toast } from 'sonner';

export async function generateQuestions(topic: string, questionCount: number): Promise<Question[]> {
  try {
    // Attempt to generate questions with OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Create multiple choice questions based on the topic provided."
          },
          {
            role: "user",
            content: `Generate ${questionCount} multiple choice questions about "${topic}". 
              Format the response as a JSON array with each question having: 
              id (number), question (string), 
              options (array of 4 strings), 
              correctAnswer (index number 0-3 indicating which option is correct), 
              explanation (string explaining why the answer is correct)`
          }
        ],
        response_format: { type: "json_object" }
      })
    }).catch(error => {
      console.error("Error fetching from OpenAI:", error);
      throw new Error("Failed to connect to AI service");
    });

    if (!response || !response.ok) {
      throw new Error("Failed to generate questions");
    }

    const data = await response.json();
    let generatedQuestions: Question[] = [];
    
    try {
      // Try to parse the AI response
      generatedQuestions = JSON.parse(data.choices[0].message.content).questions;
    } catch (e) {
      console.error("Error parsing AI response:", e);
      throw new Error("Invalid response from AI service");
    }

    if (!generatedQuestions || generatedQuestions.length === 0) {
      throw new Error("No questions generated");
    }

    toast.success(`Generated ${questionCount} questions about ${topic}!`);
    return generatedQuestions;
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Return sample questions as fallback
    const sampleQuestions = getSampleQuestions(topic, questionCount);
    toast.error('Using sample questions - AI service unavailable', { duration: 3000 });
    return sampleQuestions;
  }
}

function getSampleQuestions(topic: string, questionCount: number): Question[] {
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: `What is a key characteristic of ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is the correct answer because it represents the fundamental aspect of the topic.'
    },
    {
      id: 2,
      question: `Which of these is most related to ${topic}?`,
      options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
      correctAnswer: 1,
      explanation: 'This choice has the strongest historical and conceptual connection to the topic.'
    },
    {
      id: 3,
      question: `What best describes ${topic}?`,
      options: ['Description A', 'Description B', 'Description C', 'Description D'],
      correctAnswer: 2,
      explanation: 'This description captures the essential nature of the topic most accurately.'
    },
    {
      id: 4,
      question: `In the context of ${topic}, which is true?`,
      options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'],
      correctAnswer: 0,
      explanation: 'This statement aligns with the established facts about the topic.'
    },
    {
      id: 5,
      question: `What is an important aspect of ${topic}?`,
      options: ['Aspect A', 'Aspect B', 'Aspect C', 'Aspect D'],
      correctAnswer: 3,
      explanation: 'This aspect is crucial to understanding the full scope of the topic.'
    },
    {
      id: 6,
      question: `How does ${topic} relate to modern society?`,
      options: ['Relationship 1', 'Relationship 2', 'Relationship 3', 'Relationship 4'],
      correctAnswer: 1,
      explanation: 'This relationship illustrates how the topic influences contemporary life.'
    },
    {
      id: 7,
      question: `What is a common misconception about ${topic}?`,
      options: ['Misconception A', 'Misconception B', 'Misconception C', 'Misconception D'],
      correctAnswer: 2,
      explanation: 'This is a widely held but incorrect belief about the topic.'
    },
    {
      id: 8,
      question: `Which factor most influences ${topic}?`,
      options: ['Factor 1', 'Factor 2', 'Factor 3', 'Factor 4'],
      correctAnswer: 0,
      explanation: 'This factor has been shown to have the greatest impact on the development of the topic.'
    },
    {
      id: 9,
      question: `What is the primary purpose of ${topic}?`,
      options: ['Purpose A', 'Purpose B', 'Purpose C', 'Purpose D'],
      correctAnswer: 3,
      explanation: 'This purpose represents the main reason for the existence or development of the topic.'
    },
    {
      id: 10,
      question: `How has ${topic} evolved over time?`,
      options: ['Evolution 1', 'Evolution 2', 'Evolution 3', 'Evolution 4'],
      correctAnswer: 1,
      explanation: 'This evolutionary path most accurately represents the historical development of the topic.'
    }
  ];
  
  return sampleQuestions.slice(0, questionCount);
}
