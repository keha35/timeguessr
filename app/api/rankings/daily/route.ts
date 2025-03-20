import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer les scores du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scores = await prisma.score.findMany({
      where: {
        date: {
          gte: today,
        },
      },
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
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Erreur lors de la récupération du classement journalier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement' },
      { status: 500 }
    );
  }
} 