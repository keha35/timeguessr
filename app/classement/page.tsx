'use client';

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

interface Score {
  id: string;
  points: number;
  imageUrl: string;
  date: string;
  user: {
    name: string;
    image: string;
  };
}

export default function Classement() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/scores/current-week');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Erreur lors du chargement des scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Classement de la Semaine
        </h1>
        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preuve
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.map((score, index) => (
                    <tr key={score.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {score.user.image && (
                            <img
                              src={score.user.image}
                              alt={score.user.name}
                              className="h-8 w-8 rounded-full mr-2"
                            />
                          )}
                          <span>{score.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {score.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(score.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={score.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
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
        )}
      </div>
    </main>
  );
} 