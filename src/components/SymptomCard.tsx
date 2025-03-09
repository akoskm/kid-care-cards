import React, { useState } from 'react';
import { SymptomCard as SymptomCardType } from '@/types/symptom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  card: SymptomCardType;
  onDelete: (id: string) => void;
  onEdit: (card: SymptomCardType) => void;
  readOnly?: boolean;
}

export default function SymptomCard({ card, onDelete, onEdit, readOnly = false }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(card.createdAt), { addSuffix: true });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mb-4">
      <AnimatePresence initial={false} mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
          >
            <Card className="cursor-pointer" onClick={handleFlip}>
              <CardHeader>
                <CardTitle className="text-xl">{card.symptom}</CardTitle>
                <div className="text-sm text-gray-500">{formattedDate}</div>
              </CardHeader>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
          >
            <Card className="cursor-pointer" onClick={handleFlip}>
              <CardContent>
        {card.solutions.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold mb-2">Solutions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {card.solutions.map((solution, index) => (
                <li key={index}>
                  <div className="font-medium">{solution.description}</div>
                  {solution.effectiveness_rating && (
                    <div className="text-sm text-gray-600">
                      Effectiveness: {solution.effectiveness_rating}/5
                    </div>
                  )}
                  {solution.time_to_relief && (
                    <div className="text-sm text-gray-600">
                      Time to relief: {solution.time_to_relief}
                    </div>
                  )}
                  {solution.precautions && (
                    <div className="text-sm text-gray-600">
                      Precautions: {solution.precautions}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {card.notes && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Notes:</h4>
            <p className="text-gray-700">{card.notes}</p>
          </div>
        )}
              </CardContent>

              {!readOnly && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(card);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
