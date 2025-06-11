'use client';

import React from 'react';
import PredictionForm from '@/components/predictions/PredictionForm';

export default function ToolsPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Prediction Tool</h1>
      <PredictionForm />
    </div>
  );
}
