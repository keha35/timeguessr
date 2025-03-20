import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Calculer le début et la fin de la semaine
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Récupérer tous les scores de la semaine
    const weeklyScores = await prisma.score.findMany({
      where: {
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          date: 'asc',
        },
        {
          points: 'desc',
        },
      ],
    });

    // Grouper les scores par jour
    const scoresByDay = weeklyScores.reduce((acc, score) => {
      const date = score.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(score);
      return acc;
    }, {} as Record<string, typeof weeklyScores>);

    // Compter le nombre de fois où chaque utilisateur a été premier
    const userFirstPlaces = new Map<string, {
      userId: string;
      userName: string | null;
      userImage: string | null;
      firstPlaceCount: number;
    }>();

    Object.values(scoresByDay).forEach(dayScores => {
      if (dayScores.length > 0) {
        // Trier les scores du jour par points décroissants
        const sortedScores = [...dayScores].sort((a, b) => b.points - a.points);
        const winner = sortedScores[0];

        const userStats = userFirstPlaces.get(winner.userId) || {
          userId: winner.userId,
          userName: winner.user.name,
          userImage: winner.user.image,
          firstPlaceCount: 0,
        };

        userFirstPlaces.set(winner.userId, {
          ...userStats,
          firstPlaceCount: userStats.firstPlaceCount + 1,
        });
      }
    });

    // Convertir la Map en tableau et trier par nombre de premières places
    const rankings = Array.from(userFirstPlaces.values()).sort(
      (a, b) => b.firstPlaceCount - a.firstPlaceCount
    );

    return NextResponse.json({
      weekStart: startOfWeek.toISOString(),
      weekEnd: endOfWeek.toISOString(),
      rankings,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du classement hebdomadaire:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement' },
      { status: 500 }
    );
  }
} 