'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function ScoreSubmission() {
  const [points, setPoints] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Vous devez être connecté pour soumettre un score');
      return;
    }

    if (!image) {
      setError('Veuillez sélectionner une capture d\'écran');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload image
      const formData = new FormData();
      formData.append('file', image);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        throw new Error(uploadData.error || 'Erreur lors de l\'upload de l\'image');
      }

      const uploadData = await uploadRes.json();

      // Submit score
      const scoreRes = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: parseInt(points),
          imageUrl: uploadData.url,
        }),
      });

      if (!scoreRes.ok) {
        const scoreData = await scoreRes.json();
        throw new Error(scoreData.error || 'Erreur lors de la soumission du score');
      }

      setSuccess(true);
      setPoints('');
      setImage(null);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError('Le fichier est trop volumineux (maximum 10MB)');
        e.target.value = '';
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image');
        e.target.value = '';
        return;
      }
      setImage(file);
      setError(null);
    }
  };

  if (!session) {
    return (
      <div className="text-center p-4 bg-yellow-100 rounded-lg">
        Veuillez vous connecter pour soumettre un score
      </div>
    );
  }

  return (
    <form 
      ref={formRef} 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto p-4 space-y-4"
      encType="multipart/form-data"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Score soumis avec succès !
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Points
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Capture d'écran
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Format accepté : images uniquement, taille maximale : 10MB
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Envoi en cours...' : 'Soumettre le score'}
      </button>
    </form>
  );
} 