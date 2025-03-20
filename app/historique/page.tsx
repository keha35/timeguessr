'use client';

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

interface WeeklyRanking {
  id: string;
  startDate: string;
  endDate: string;
  winners: {
    position: number;
    user: {
      name: string;
      image: string;
    };
    points: number;
  }[];
}

export default function Historique() {
  const [weeks, setWeeks] = useState<WeeklyRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/scores/history');
        const data = await response.json();
        setWeeks(data);
        if (data.length > 0) {
          setSelectedWeek(data[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const selectedWeekData = weeks.find(week => week.id === selectedWeek);

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Historique des Classements
        </h1>
        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner une semaine
              </label>
              <select
                value={selectedWeek || ''}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    Du {new Date(week.startDate).toLocaleDateString()} au{' '}
                    {new Date(week.endDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {selectedWeekData && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    Classement du{' '}
                    {new Date(selectedWeekData.startDate).toLocaleDateString()} au{' '}
                    {new Date(selectedWeekData.endDate).toLocaleDateString()}
                  </h2>
                </div>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedWeekData.winners.map((winner) => (
                      <tr key={`${selectedWeekData.id}-${winner.position}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {winner.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {winner.user.image && (
                              <img
                                src={winner.user.image}
                                alt={winner.user.name}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                            )}
                            <span>{winner.user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {winner.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 