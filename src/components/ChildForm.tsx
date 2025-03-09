import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  onSubmit: (data: {
    name: string;
    date_of_birth: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    name: string;
    date_of_birth: string;
  };
  submitLabel?: string;
}

export default function ChildForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Save',
}: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [birthDate, setBirthDate] = useState(initialData?.date_of_birth || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    onSubmit({
      name: name.trim(),
      date_of_birth: birthDate,
    });
  };

  return (
    <Card className="mx-4 my-4">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Child' : 'Add New Child'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              placeholder="Child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Birth Date</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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
