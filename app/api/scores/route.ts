import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/options';
import prisma from '../../../src/lib/prisma';

export async function GET() {
  try {
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
    console.error('Erreur lors de la récupération des scores:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { points, imageUrl } = await request.json();

    if (!points || !imageUrl) {
      return NextResponse.json(
        { error: 'Points et image requis' },
        { status: 400 }
      );
    }

    // Trouver ou créer la semaine courante
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    let week = await prisma.week.findFirst({
      where: {
        startDate: startOfWeek,
        endDate: endOfWeek,
      },
    });

    if (!week) {
      week = await prisma.week.create({
        data: {
          startDate: startOfWeek,
          endDate: endOfWeek,
        },
      });
    }

    const score = await prisma.score.create({
      data: {
        points,
        imageUrl,
        userId: session.user.id,
        weekId: week.id,
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