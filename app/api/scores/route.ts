import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '../../lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Vous devez être connecté pour soumettre un score' },
      { status: 401 }
    );
  }

  try {
    const { points, imageUrl } = await request.json();

    if (!points || !imageUrl) {
      return NextResponse.json(
        { error: 'Les points et l\'image sont requis' },
        { status: 400 }
      );
    }

    if (typeof points !== 'number' || points < 0) {
      return NextResponse.json(
        { error: 'Le score doit être un nombre positif' },
        { status: 400 }
      );
    }

    const score = await prisma.score.create({
      data: {
        points,
        imageUrl,
        userId: session.user.id,
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

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
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
      take: 100,
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scores' },
      { status: 500 }
    );
  }
} 