'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getApiUrl } from '../utils/api';

interface Score {
  id: string;
  points: number;
  imageUrl: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export default function DailyRankingComponent() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(getApiUrl('/api/rankings/daily'));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération du classement');
        }

        setScores(data.scores);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    // Rafraîchir le classement toutes les 5 minutes
    const interval = setInterval(fetchScores, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="text-center p-4 bg-yellow-100 rounded-lg">
        Aucun score enregistré aujourd'hui
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Classement du jour
        <div className="text-sm font-normal text-gray-600">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joueur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preuve
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scores.map((score, index) => (
              <tr key={score.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-gray-800' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {score.user.image && (
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={score.user.image}
                          alt={score.user.name || 'Avatar'}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {score.user.name || 'Anonyme'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{score.points} points</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={getApiUrl(score.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Voir la capture
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 