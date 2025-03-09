import React, { useState, useEffect } from 'react';
import { secureDataOperations } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Child {
  id: string;
  name: string;
}

interface Props {
  onSubmit: (data: {
    symptom: string;
    childId: string;
    solutions: Array<{
      description: string;
      effectiveness_rating?: number;
      time_to_relief?: string;
      precautions?: string;
    }>;
    notes?: string
  }) => void;
  onCancel: () => void;
  initialData?: {
    symptom: string;
    childId: string;
    solutions: Array<{
      description: string;
      effectiveness_rating?: number;
      time_to_relief?: string;
      precautions?: string;
    }>;
    notes?: string;
  };
  submitLabel?: string;
}

export default function SymptomForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Save',
}: Props) {
  const [symptom, setSymptom] = useState(initialData?.symptom || '');
  const [childId, setChildId] = useState<string>(initialData?.childId || '');
  const [solutions, setSolutions] = useState<Array<{
    description: string;
    effectiveness_rating?: number;
    time_to_relief?: string;
    precautions?: string;
  }>>(
    initialData?.solutions || [{ description: '' }]
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using useCallback to memoize the loadChildren function
  const loadChildren = React.useCallback(async () => {
    try {
      const data = await secureDataOperations.getChildren();
      setChildren(data || []);
      if (data && data.length === 1 && !childId) {
        setChildId(data[0].id);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);



  const handleSubmit = () => {
    if (!childId) {
      setError('Please select a child');
      return;
    }

    const symptomName = symptom.trim();
    if (symptomName) {
      onSubmit({
        symptom: symptomName,
        childId,
        solutions: solutions,
        notes: notes.trim() || undefined,
      });
    }
  };

  const addSolutionField = () => {
    setSolutions([...solutions, { description: '' }]);
  };

  const updateSolution = (text: string, index: number) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], description: text };
    setSolutions(newSolutions);
  };

  const updateSolutionField = (index: number, field: string, value: string | number | undefined) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setSolutions(newSolutions);
  };

  const removeSolution = (index: number) => {
    const newSolutions = solutions.filter((_, i) => i !== index);
    setSolutions(newSolutions);
  };

  if (loading) {
    return (
      <Card className="mx-4 my-4">
        <CardContent className="pt-6">
          <p>Loading children...</p>
        </CardContent>
      </Card>
    );
  }

  if (children.length === 0) {
    return (
      <Card className="mx-4 my-4">
        <CardContent className="pt-6">
          <p className="text-red-500">
            Please add a child first in the Children tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 my-4">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Symptom' : 'Add New Symptom'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Children</label>
            <Select value={childId} onValueChange={setChildId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Symptom name</label>
            <Input
              placeholder="Symptom"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
          </div>

          {solutions.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Solutions</label>
              {solutions.map((solution, index) => (
                <div key={index} className="p-4 border rounded-md mb-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      placeholder={`Solution ${index + 1}`}
                      value={solution.description}
                      onChange={(e) => updateSolution(e.target.value, index)}
                      className="mb-2"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Effectiveness (1-5)</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="1-5"
                      value={solution.effectiveness_rating || ''}
                      onChange={(e) => updateSolutionField(index, 'effectiveness_rating', parseInt(e.target.value) || undefined)}
                      className="w-20"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Time to relief</label>
                    <Input
                      placeholder="e.g. 30 minutes"
                      value={solution.time_to_relief || ''}
                      onChange={(e) => updateSolutionField(index, 'time_to_relief', e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Precautions</label>
                    <Textarea
                      placeholder="Any precautions"
                      value={solution.precautions || ''}
                      onChange={(e) => updateSolutionField(index, 'precautions', e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSolution(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addSolutionField}
                className="mt-2"
              >
                Add Another Solution
              </Button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              placeholder="Additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
