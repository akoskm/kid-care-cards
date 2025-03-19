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
import { motion, AnimatePresence } from 'framer-motion';

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

interface Solution {
  description: string;
  effectiveness_rating?: number;
  time_to_relief?: string;
  precautions?: string;
}

export default function SymptomForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Save',
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptom, setSymptom] = useState(initialData?.symptom || '');
  const [childId, setChildId] = useState<string>(initialData?.childId || '');
  const [solutions, setSolutions] = useState<Solution[]>(
    initialData?.solutions || [{ description: '' }]
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const addSolution = () => {
    setSolutions([...solutions, { description: '' }]);
  };

  const updateSolution = (index: number, field: keyof Solution, value: string | number | undefined) => {
    const newSolutions = [...solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setSolutions(newSolutions);
  };

  const removeSolution = (index: number) => {
    const newSolutions = solutions.filter((_, i) => i !== index);
    setSolutions(newSolutions);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return childId && symptom.trim();
      case 2:
        return solutions.some(s => s.description.trim());
      default:
        return true;
    }
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
        <CardTitle className="flex items-center justify-between">
          <span>{initialData ? 'Edit Symptom' : 'Add New Symptom'}</span>
          <div className="text-sm font-normal text-gray-500">
            Step {currentStep} of 3
          </div>
        </CardTitle>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Child</label>
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
                  placeholder="Enter the symptom"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium mb-4">Solutions</h3>

              {solutions.map((solution, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        placeholder="Describe the solution"
                        value={solution.description}
                        onChange={(e) => updateSolution(index, 'description', e.target.value)}
                        className="mb-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Effectiveness</label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="1-5"
                          value={solution.effectiveness_rating || ''}
                          onChange={(e) => updateSolution(index, 'effectiveness_rating', parseInt(e.target.value) || undefined)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Time to relief</label>
                        <Input
                          placeholder="e.g. 30 minutes"
                          value={solution.time_to_relief || ''}
                          onChange={(e) => updateSolution(index, 'time_to_relief', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        placeholder={`e.g.:
* Not recommended under 1 year old
* Doctors number: 1234567890`}
                        value={solution.precautions || ''}
                        onChange={(e) => updateSolution(index, 'precautions', e.target.value)}
                      />
                    </div>

                    {solutions.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeSolution(index)}
                        className="w-full mt-2"
                      >
                        Remove Solution
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSolution}
                className="w-full mt-4"
              >
                Add Another Solution
              </Button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <Textarea
                  placeholder="Add any additional notes or observations"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-32"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between space-x-2">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
