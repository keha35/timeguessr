import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { points, imageUrl } = await request.json();

    // Trouver ou créer la semaine en cours
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    let currentWeek = await prisma.week.findFirst({
      where: {
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
    });

    if (!currentWeek) {
      currentWeek = await prisma.week.create({
        data: {
          startDate: startOfWeek,
          endDate: endOfWeek,
        },
      });
    }

    // Créer le score
    const score = await prisma.score.create({
      data: {
        points,
        imageUrl,
        userId: session.user.id,
        weekId: currentWeek.id,
      },
    });

    return NextResponse.json(score);
  } catch (error) {
    console.error('Erreur lors de la création du score:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du score' },
      { status: 500 }
    );
  }
} 