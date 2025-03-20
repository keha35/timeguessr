'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { WeeklyRanking } from '../types/score';

export default function WeeklyRankingComponent() {
  const [ranking, setRanking] = useState<WeeklyRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/rankings/weekly');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération du classement');
        }

        // Vérifier que la structure des données est correcte
        if (!data.rankings || !Array.isArray(data.rankings)) {
          throw new Error('Format de données invalide');
        }

        setRanking({
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          users: data.rankings,
        });
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
    // Rafraîchir le classement toutes les heures
    const interval = setInterval(fetchRanking, 60 * 60 * 1000);
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

  if (!ranking || !ranking.users || ranking.users.length === 0) {
    return (
      <div className="text-center p-4 bg-yellow-100 rounded-lg">
        Aucun classement disponible pour cette semaine
      </div>
    );
  }

  const weekStart = new Date(ranking.weekStart).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });
  const weekEnd = new Date(ranking.weekEnd).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Classement de la semaine
        <div className="text-sm font-normal text-gray-600">
          Du {weekStart} au {weekEnd}
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
                Victoires
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ranking.users.map((user, index) => (
              <tr key={user.userId} className={index === 0 ? 'bg-yellow-50' : ''}>
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
                    {user.userImage && (
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={user.userImage}
                          alt={user.userName || 'Avatar'}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.userName || 'Anonyme'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.firstPlaceCount} {user.firstPlaceCount > 1 ? 'victoires' : 'victoire'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 