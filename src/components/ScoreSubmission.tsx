'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getApiUrl } from '../utils/api';

export default function ScoreSubmission() {
  const { data: session } = useSession();
  const [points, setPoints] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!file) {
        throw new Error('Veuillez sélectionner une capture d\'écran');
      }

      // Upload de l'image
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Erreur lors de l\'upload de l\'image');
      }

      const { url } = await uploadResponse.json();

      // Création du score
      const scoreResponse = await fetch(getApiUrl('/api/scores'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points,
          imageUrl: url,
        }),
      });

      if (!scoreResponse.ok) {
        const data = await scoreResponse.json();
        throw new Error(data.error || 'Erreur lors de la création du score');
      }

      setSuccess(true);
      setPoints(0);
      setFile(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-yellow-100 p-4 rounded-lg text-center">
        Connectez-vous pour soumettre un score
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Soumettre un score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700">
            Points
          </label>
          <input
            type="number"
            id="points"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value, 10))}
            min="0"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
            Capture d'écran
          </label>
          <input
            type="file"
            id="screenshot"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md">
            Score soumis avec succès !
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Envoi en cours...' : 'Soumettre'}
        </button>
      </form>
    </div>
  );
} 