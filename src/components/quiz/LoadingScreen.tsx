
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingScreenProps {
  topic: string;
  questionCount: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic, questionCount }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Questions...</h3>
          <p className="text-gray-600">AI is creating {questionCount} questions about {topic}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingScreen;
