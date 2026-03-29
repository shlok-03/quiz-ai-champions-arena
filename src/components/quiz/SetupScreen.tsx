import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, Heart } from 'lucide-react';
import { Difficulty } from '@/types/quiz';

interface SetupScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  onStart: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  playerName,
  setPlayerName,
  topic,
  setTopic,
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  onStart,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Quiz Master</CardTitle>
          <p className="text-gray-600">Create your personalized quiz!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Topic</label>
            <Input
              placeholder="e.g., Space, History, Science..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
            <Select
              value={questionCount.toString()}
              onValueChange={(value) => setQuestionCount(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center text-gray-700 py-2">
            <div className="flex items-center justify-center space-x-1">
              <Heart className="h-5 w-5 text-red-500" fill="red" />
              <Heart className="h-5 w-5 text-red-500" fill="red" />
              <Heart className="h-5 w-5 text-red-500" fill="red" />
              <span className="ml-2 font-medium">3 lives</span>
            </div>
            <p className="text-sm mt-1">You lose a life for each wrong answer!</p>
          </div>

          <Button 
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            disabled={!topic.trim() || !playerName.trim()}
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupScreen;
