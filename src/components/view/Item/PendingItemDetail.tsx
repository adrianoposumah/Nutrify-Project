'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { DialogHeader, DialogTitle, Card, CardContent, Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components';
import { PendingItem } from '@/types';

interface PendingItemDetailProps {
  selectedItem: PendingItem | null;
}

export default function PendingItemDetail({ selectedItem }: PendingItemDetailProps) {
  if (!selectedItem) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status.toUpperCase()) {
      case 'CAUTION':
      case 'HIGH RISK':
      case 'WARNING':
        return 'destructive';
      case 'MODERATE CONSUMPTION':
      case 'NEUTRAL':
        return 'secondary';
      case 'SAFE':
      case 'NORMAL CONSUMPTION':
      case 'BENEFICIAL':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatVitaminName = (key: string): string => {
    const vitaminNames: Record<string, string> = {
      vitamin_A: 'Vitamin A',
      vitamin_B1: 'Vitamin B1',
      vitamin_B2: 'Vitamin B2',
      vitamin_B3: 'Vitamin B3',
      vitamin_B5: 'Vitamin B5',
      vitamin_B6: 'Vitamin B6',
      vitamin_B9: 'Vitamin B9',
      vitamin_B11: 'Vitamin B11',
      vitamin_B12: 'Vitamin B12',
      vitamin_C: 'Vitamin C',
      vitamin_D: 'Vitamin D',
      vitamin_E: 'Vitamin E',
      vitamin_K: 'Vitamin K',
    };
    return vitaminNames[key] || key;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{selectedItem.name}</DialogTitle>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{selectedItem.nation || selectedItem.origin}</span>
        </div>{' '}
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-6">
        {/* Image - Top on mobile, right on desktop */}
        <div className="order-1 lg:order-2 col-span-full lg:col-span-3 space-y-6">
          <div>
            <Image src={selectedItem.image || '/placeholder.svg'} alt={selectedItem.name} width={400} height={300} className="w-full h-auto rounded-lg object-cover shadow-md" />
          </div>

          {/* Nutrition Facts */}
          {selectedItem.nutrition_total && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span>{selectedItem.nutrition_total.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>{selectedItem.nutrition_total.fat} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbohydrates</span>
                    <span>{selectedItem.nutrition_total.carbohydrates} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{selectedItem.nutrition_total.protein} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiber</span>
                    <span>{selectedItem.nutrition_total.fiber} g</span>
                  </div>

                  {/* Vitamins */}
                  {(Object.entries(selectedItem.nutrition_total).filter(([key]) => key.startsWith('vitamin_')).length > 0 || selectedItem.nutrition_total.vitamins) && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <h4 className="font-medium mb-2">Vitamins</h4>
                        {selectedItem.nutrition_total.vitamins
                          ? // Nested structure
                            Object.entries(selectedItem.nutrition_total.vitamins)
                              .filter(([, value]) => value > 0)
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span>{formatVitaminName(key)}</span>
                                  <span>{value} mg</span>
                                </div>
                              ))
                          : // Flat structure
                            Object.entries(selectedItem.nutrition_total)
                              .filter(([key, value]) => key.startsWith('vitamin_') && value && value > 0)
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span>{formatVitaminName(key)}</span>
                                  <span>{value} mg</span>
                                </div>
                              ))}
                      </div>
                    </>
                  )}

                  {/* Minerals */}
                  {(selectedItem.nutrition_total.minerals ||
                    selectedItem.nutrition_total.calcium ||
                    selectedItem.nutrition_total.iron ||
                    selectedItem.nutrition_total.magnesium ||
                    selectedItem.nutrition_total.phosphorus ||
                    selectedItem.nutrition_total.potassium ||
                    selectedItem.nutrition_total.zinc) && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <h4 className="font-medium mb-2">Minerals</h4>
                        {selectedItem.nutrition_total.minerals ? (
                          // Nested structure
                          <>
                            <div className="flex justify-between text-sm">
                              <span>Kalsium</span>
                              <span>{selectedItem.nutrition_total.minerals.calcium} mg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Besi</span>
                              <span>{selectedItem.nutrition_total.minerals.iron} mg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Magnesium</span>
                              <span>{selectedItem.nutrition_total.minerals.magnesium} mg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Fosfor</span>
                              <span>{selectedItem.nutrition_total.minerals.phosphorus} mg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Kalium</span>
                              <span>{selectedItem.nutrition_total.minerals.potassium} mg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Seng</span>
                              <span>{selectedItem.nutrition_total.minerals.zinc} mg</span>
                            </div>
                          </>
                        ) : (
                          // Flat structure
                          <>
                            {selectedItem.nutrition_total.calcium && (
                              <div className="flex justify-between text-sm">
                                <span>Kalsium</span>
                                <span>{selectedItem.nutrition_total.calcium} mg</span>
                              </div>
                            )}
                            {selectedItem.nutrition_total.iron && (
                              <div className="flex justify-between text-sm">
                                <span>Besi</span>
                                <span>{selectedItem.nutrition_total.iron} mg</span>
                              </div>
                            )}
                            {selectedItem.nutrition_total.magnesium && (
                              <div className="flex justify-between text-sm">
                                <span>Magnesium</span>
                                <span>{selectedItem.nutrition_total.magnesium} mg</span>
                              </div>
                            )}
                            {selectedItem.nutrition_total.phosphorus && (
                              <div className="flex justify-between text-sm">
                                <span>Fosfor</span>
                                <span>{selectedItem.nutrition_total.phosphorus} mg</span>
                              </div>
                            )}
                            {selectedItem.nutrition_total.potassium && (
                              <div className="flex justify-between text-sm">
                                <span>Kalium</span>
                                <span>{selectedItem.nutrition_total.potassium} mg</span>
                              </div>
                            )}
                            {selectedItem.nutrition_total.zinc && (
                              <div className="flex justify-between text-sm">
                                <span>Seng</span>
                                <span>{selectedItem.nutrition_total.zinc} mg</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content - Bottom on mobile, left on desktop */}
        <div className="order-2 lg:order-1 col-span-full lg:col-span-4 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{selectedItem.description}</p>
          </div>

          {/* Ingredients */}
          {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <div className="border rounded-lg overflow-hidden">
                {selectedItem.ingredients.map((ingredient, index) => (
                  <div key={index} className={`flex justify-between py-3 px-4 ${index < selectedItem.ingredients!.length - 1 ? 'border-b' : ''}`}>
                    <span className="font-medium">{ingredient.ingredientName}</span>
                    <span className="text-muted-foreground">{ingredient.ingredientDose}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Considerations */}
          {selectedItem.disease_rate && selectedItem.disease_rate.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Health Considerations</h3>
              <Accordion type="single" collapsible className="w-full">
                {selectedItem.disease_rate.map((diseaseItem, index) => (
                  <AccordionItem key={index} value={`disease-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>{diseaseItem.disease.replace(/_/g, ' ')}</span>
                        <Badge variant={getStatusBadgeVariant(diseaseItem.status)}>{diseaseItem.status}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground">
                        Level: <span className="capitalize">{diseaseItem.level}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Submission Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Submission Information</h3>{' '}
            <div className="space-y-2 text-sm">
              {' '}
              <div>
                <span className="font-medium">Submitted by:</span>{' '}
                {typeof selectedItem.submittedBy === 'object' && selectedItem.submittedBy !== null && 'name' in selectedItem.submittedBy ? `${selectedItem.submittedBy.name} (${selectedItem.submittedBy.email})` : 'Unknown'}
              </div>
              <div>
                <span className="font-medium">Submitted at:</span> {formatDate(selectedItem.submittedAt)}
              </div>
              <div>
                <span className="font-medium">Status:</span> <Badge variant="secondary">{selectedItem.status}</Badge>
              </div>
            </div>{' '}
          </div>
        </div>
      </div>
    </>
  );
}
