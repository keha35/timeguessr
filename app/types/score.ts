export interface Score {
  id: string;
  userId: string;
  points: number;
  imageUrl: string;
  date: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface DailyRanking {
  date: string;
  scores: Score[];
}

export interface WeeklyRanking {
  weekStart: string;
  weekEnd: string;
  users: {
    userId: string;
    userName: string | null;
    userImage: string | null;
    firstPlaceCount: number;
  }[];
} 