import ScoreSubmission from './components/ScoreSubmission';
import Rankings from './components/Rankings';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          TimeGuessr Weekly
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ScoreSubmission />
          </div>
          <div>
            <Rankings />
          </div>
        </div>
      </div>
    </main>
  );
} 