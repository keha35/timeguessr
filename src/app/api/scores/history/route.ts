import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Score {
  id: string;
  points: number;
  date: Date;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface WeekWithScores {
  id: string;
  startDate: Date;
  endDate: Date;
  scores: Score[];
}

export async function GET() {
  try {
    const weeks = await prisma.week.findMany({
      orderBy: {
        startDate: 'desc',
      },
      include: {
        scores: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Traiter les données pour chaque semaine
    const processedWeeks = weeks.map((week: WeekWithScores) => {
      // Grouper les scores par jour et ne garder que le meilleur score par jour pour chaque utilisateur
      const scoresByDay = week.scores.reduce((acc: Record<string, Score>, score) => {
        const day = new Date(score.date).toDateString();
        if (!acc[day] || acc[day].points < score.points) {
          acc[day] = score;
        }
        return acc;
      }, {});

      // Convertir l'objet en tableau et trier par points
      const sortedScores = Object.values(scoresByDay).sort((a, b) => b.points - a.points);

      // Calculer les positions des gagnants
      const winners = sortedScores.map((score, index) => ({
        position: index + 1,
        user: score.user,
        points: score.points,
      }));

      return {
        id: week.id,
        startDate: week.startDate,
        endDate: week.endDate,
        winners,
      };
    });

    return NextResponse.json(processedWeeks);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
} 