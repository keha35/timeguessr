'use client';

import { useState } from 'react';
import DailyRanking from './DailyRanking';
import WeeklyRanking from './WeeklyRanking';
import AllTimeRanking from './AllTimeRanking';

export default function Rankings() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'alltime'>('daily');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Classement du jour
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Classement de la semaine
        </button>
        <button
          onClick={() => setActiveTab('alltime')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'alltime'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Classement général
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'daily' && <DailyRanking />}
        {activeTab === 'weekly' && <WeeklyRanking />}
        {activeTab === 'alltime' && <AllTimeRanking />}
      </div>
    </div>
  );
} 