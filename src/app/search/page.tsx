"use client";

import { useState } from 'react';
import { secureDataOperations } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SymptomCard from '@/components/SymptomCard';
import MainLayout from '../main-layout';
import type { SymptomCard as SymptomCardType } from '@/types/symptom';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SymptomCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await secureDataOperations.searchSymptoms(searchTerm);
      
      const formattedData: SymptomCardType[] = data.map(symptom => ({
        id: symptom.id,
        symptom: symptom.name,
        childId: symptom.child_id,
        createdAt: symptom.created_at,
        solutions: symptom.solutions?.map(s => ({
          description: s.description,
          effectiveness_rating: s.effectiveness_rating,
          time_to_relief: s.time_to_relief,
          precautions: s.precautions
        })) || [],
        notes: symptom.notes,
      }));
      
      setResults(formattedData);
      setSearched(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4 px-4">Search Symptoms</h1>
        
        <div className="px-4 mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="p-4 text-center">
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : searched ? (
          <div>
            {results.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>No symptoms found matching your search.</p>
              </div>
            ) : (
              <div>
                <p className="px-4 mb-4 text-gray-600">Found {results.length} result(s)</p>
                {results.map((card) => (
                  <SymptomCard
                    key={card.id}
                    card={card}
                    onDelete={() => {}}
                    onEdit={() => {}}
                    readOnly
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <p>Enter a search term to find symptoms.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
