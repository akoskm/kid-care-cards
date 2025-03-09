"use client";

import { useState, useEffect, useCallback } from 'react';
import { secureDataOperations } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChildForm from '@/components/ChildForm';
import MainLayout from '../main-layout';
import { format } from 'date-fns';

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    try {
      const data = await secureDataOperations.getChildren();
      setChildren(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const addChild = async (data: { name: string; date_of_birth: string }) => {
    try {
      setError(null);
      await secureDataOperations.insertChild(data);
      loadChildren();
      setShowForm(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const updateChild = async (data: { name: string; date_of_birth: string }) => {
    if (!editingChild) return;

    try {
      setError(null);
      await secureDataOperations.updateChild(editingChild.id, data);
      loadChildren();
      setEditingChild(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const deleteChild = async (id: string) => {
    try {
      await secureDataOperations.deleteChild(id);
      loadChildren();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4 px-4">Children</h1>

        {loading ? (
          <div className="p-4">
            <p className="text-gray-600">Loading children...</p>
          </div>
        ) : (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4">
                {error}
              </div>
            )}

            {showForm ? (
              <ChildForm
                onSubmit={addChild}
                onCancel={() => setShowForm(false)}
              />
            ) : editingChild ? (
              <ChildForm
                initialData={editingChild}
                onSubmit={updateChild}
                onCancel={() => setEditingChild(null)}
                submitLabel="Update"
              />
            ) : (
              <div className="px-4 mb-4">
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Add New Child
                </Button>
              </div>
            )}

            {children.length === 0 && !showForm && !editingChild ? (
              <div className="text-center p-8 text-gray-500">
                <p>No children added yet. Add your first child to get started.</p>
              </div>
            ) : (
              <div className="px-4 space-y-4">
                {children.map((child) => (
                  <Card key={child.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{child.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        Birth Date: {formatDate(child.date_of_birth)}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(child)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteChild(child.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
