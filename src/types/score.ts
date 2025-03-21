export interface Score {
  id: string;
  points: number;
  imageUrl: string;
  date: string;
  userId: string;
  weekId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface WeeklyRanking {
  id: string;
  startDate: string;
  endDate: string;
  scores: Score[];
}

export interface DailyRanking {
  scores: Score[];
} 