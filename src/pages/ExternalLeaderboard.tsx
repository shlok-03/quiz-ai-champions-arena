import { useNavigate } from 'react-router-dom';
import Leaderboard from '@/components/Leaderboard';

const ExternalLeaderboardPage = () => {
  const navigate = useNavigate();
  return <Leaderboard onBack={() => navigate('/')} />;
};

export default ExternalLeaderboardPage;
