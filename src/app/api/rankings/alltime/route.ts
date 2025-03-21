import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DailyWinsResult {
  wins: bigint;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Récupérer tous les scores groupés par utilisateur
    const rankings = await prisma.score.groupBy({
      by: ['userId'],
      _count: {
        _all: true,
      },
      _sum: {
        points: true,
      },
    });

    // Récupérer les informations des utilisateurs
    const usersWithStats = await Promise.all(
      rankings.map(async (ranking) => {
        const user = await prisma.user.findUnique({
          where: { id: ranking.userId },
          select: {
            id: true,
            name: true,
            image: true,
          },
        });

        // Compter le nombre de victoires (premières places par jour)
        const dailyWins = await prisma.$queryRaw<DailyWinsResult[]>`
          WITH DailyRankings AS (
            SELECT 
              "userId",
              DATE("date") as day,
              RANK() OVER (PARTITION BY DATE("date") ORDER BY points DESC) as rank
            FROM "Score"
          )
          SELECT COUNT(*) as wins
          FROM DailyRankings
          WHERE "userId" = ${ranking.userId}
          AND rank = 1
        `;

        // Compter le nombre total de jours joués
        const totalDays = await prisma.$queryRaw<{ days: bigint }[]>`
          SELECT COUNT(DISTINCT DATE("date")) as days
          FROM "Score"
          WHERE "userId" = ${ranking.userId}
        `;

        return {
          userId: user?.id || ranking.userId,
          userName: user?.name,
          userImage: user?.image,
          totalVictories: Number(dailyWins[0].wins),
          totalDays: Number(totalDays[0].days),
          totalPoints: ranking._sum.points || 0,
        };
      })
    );

    // Trier par nombre de victoires puis par points totaux
    const sortedRankings = usersWithStats.sort((a, b) => {
      if (b.totalVictories !== a.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      return b.totalPoints - a.totalPoints;
    });

    return NextResponse.json({ rankings: sortedRankings });
  } catch (error) {
    console.error('Erreur lors de la récupération du classement général:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement' },
      { status: 500 }
    );
  }
} 