import React, { useState, useEffect } from 'react';
import { secureDataOperations } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Child, Solution, SymptomInput } from '@/types/supabase-types';
import { Loader2 } from 'lucide-react';

// Type for solutions in the form before they're saved to the database
interface FormSolution {
  description: string;
  effectiveness_rating?: number;
  time_to_relief?: string;
  notes?: string;
}

// Helper function to convert FormSolution to Solution
const toSolution = (formSolution: FormSolution): Partial<Solution> => ({
  description: formSolution.description,
  effectiveness_rating: formSolution.effectiveness_rating,
  time_to_relief: formSolution.time_to_relief,
  notes: formSolution.notes,
});

interface Props {
  onSubmit: (data: SymptomInput) => void;
  onCancel: () => void;
  initialData?: SymptomInput;
  submitLabel?: string;
}

export default function SymptomForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Save',
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptom, setSymptom] = useState(initialData?.name || '');
  const [childId, setChildId] = useState<string>(initialData?.child_id || '');
  const [solutions, setSolutions] = useState<FormSolution[]>(
    initialData?.solutions?.map(s => ({
      description: s.description,
      effectiveness_rating: s.effectiveness_rating || undefined,
      time_to_relief: s.time_to_relief || undefined,
      notes: s.notes || undefined,
    })) || [{ description: '' }]
  );
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const data = await secureDataOperations.getChildren();
        setChildren(data || []);
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

    loadChildren();
  }, []);

  const handleSubmit = async () => {
    const symptomName = symptom.trim();
    if (symptomName) {
      setSaving(true);
      try {
        await onSubmit({
          name: symptomName,
          child_id: childId || undefined,
          solutions: solutions.map(toSolution) as Solution[],
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const addSolution = () => {
    setSolutions([...solutions, { description: '' }]);
  };

  const updateSolution = (index: number, field: keyof FormSolution, value: string | number | undefined) => {
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
        return symptom.trim();
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

  return (
    <Card className="mx-4 my-4 mb-20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{initialData ? 'Edit Symptom' : 'Add New Symptom'}</span>
          <div className="text-sm font-normal text-gray-500">
            Step {currentStep} of 2
          </div>
        </CardTitle>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
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
                <label className="block text-sm font-medium mb-1">Child (Optional)</label>
                <div className="flex gap-2">
                  <Select value={childId || ''} onValueChange={setChildId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a child (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {childId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setChildId('')}
                      title="Clear selection"
                    >
                      ×
                    </Button>
                  )}
                </div>
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

                    <div>
                      <label className="block text-sm font-medium mb-1">Effectiveness</label>
                      <StarRating
                        value={solution.effectiveness_rating}
                        onChange={(value) => updateSolution(index, 'effectiveness_rating', value)}
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

                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        placeholder={`e.g.:
* Not recommended under 1 year old
* Doctors number: 1234567890`}
                        value={solution.notes || ''}
                        onChange={(e) => updateSolution(index, 'notes', e.target.value)}
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
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between space-x-8">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={saving}
            >
              Previous
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          {currentStep < 2 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed() || saving}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-emerald-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
