import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const currentWeek = await prisma.week.findFirst({
      where: {
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
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
          orderBy: {
            points: 'desc',
          },
        },
      },
    });

    if (!currentWeek) {
      return NextResponse.json([]);
    }

    // Grouper les scores par jour et ne garder que le meilleur score par jour pour chaque utilisateur
    const scoresByDay = currentWeek.scores.reduce((acc, score) => {
      const day = new Date(score.date).toDateString();
      if (!acc[day] || acc[day].points < score.points) {
        acc[day] = score;
      }
      return acc;
    }, {} as Record<string, any>);

    // Convertir l'objet en tableau et trier par points
    const scores = Object.values(scoresByDay).sort((a, b) => b.points - a.points);

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scores' },
      { status: 500 }
    );
  }
} 