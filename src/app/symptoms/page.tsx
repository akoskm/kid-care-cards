"use client";

import { useState, useEffect } from 'react';
import { secureDataOperations } from '@/lib/supabase';
import SymptomCard from '@/components/SymptomCard';
import SymptomForm from '@/components/SymptomForm';
import MainLayout from '../main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SymptomCard as SymptomCardType } from '@/types/symptom';
import { SymptomInput } from '@/types/supabase-types';
import { VoiceRecorder } from '@/components/VoiceRecorder';

export default function SymptomsPage() {
  const [cards, setCards] = useState<SymptomCardType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<SymptomCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SymptomCardType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      const data = await secureDataOperations.getSymptoms();

      const formattedData: SymptomCardType[] = data.map(symptom => ({
        ...symptom,
        symptom: symptom.name,
        childId: symptom.child_id,
        createdAt: symptom.created_at,
      }));

      setCards(formattedData);
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

  const addCard = async (data: SymptomInput) => {
    try {
      setError(null);

      await secureDataOperations.insertSymptom(data);
      loadSymptoms();
      setShowForm(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const updateCard = async (data: SymptomInput) => {
    if (!editingCard) return;

    try {
      setError(null);

      await secureDataOperations.updateSymptom(editingCard.id, data);
      loadSymptoms();
      setEditingCard(null);
      setShowForm(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await secureDataOperations.deleteSymptom(id);
      loadSymptoms();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEdit = (card: SymptomCardType) => {
    setEditingCard(card);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const data = await secureDataOperations.searchSymptoms(searchTerm);

      const formattedData: SymptomCardType[] = data.map(symptom => ({
        ...symptom,
        symptom: symptom.name,
        childId: symptom.child_id,
        createdAt: symptom.created_at,
      }));

      setSearchResults(formattedData);
      setHasSearched(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4 px-4">Symptoms</h1>

        <div className="px-4 mb-4">
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
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {hasSearched && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="border-gray-300"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <p className="text-gray-600">Loading symptoms...</p>
          </div>
        ) : (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4">
                {error}
              </div>
            )}

            {showForm ? (
              <SymptomForm
                onSubmit={addCard}
                onCancel={() => setShowForm(false)}
              />
            ) : editingCard ? (
              <SymptomForm
                initialData={editingCard}
                onSubmit={updateCard}
                onCancel={() => setEditingCard(null)}
                submitLabel="Update"
              />
            ) : (
              <div>
                {hasSearched ? (
                  <div>
                    {searchResults.length === 0 ? (
                      <div className="text-center p-8 text-gray-500">
                        <p>No symptoms found matching your search.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="px-4 mb-4 text-gray-600">Found {searchResults.length} result(s)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                          {searchResults.map((card) => (
                            <SymptomCard
                              key={card.id}
                              card={card}
                              onEdit={() => handleEdit(card)}
                              onDelete={deleteCard}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="px-4 mb-4 flex items-center gap-2">
                      <Button
                        onClick={() => setShowForm(true)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      >
                        Add New Symptom
                      </Button>
                      <VoiceRecorder onSuccess={loadSymptoms} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {cards.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          No symptoms recorded yet. Add your first one!
                        </div>
                      ) : (
                        cards.map(card => (
                          <SymptomCard
                            key={card.id}
                            card={card}
                            onEdit={() => handleEdit(card)}
                            onDelete={deleteCard}
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}