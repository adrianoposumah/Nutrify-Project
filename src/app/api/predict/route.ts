import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Replace with your actual ML API endpoint
    const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URI_PROD;

    if (!mlApiUrl) {
    throw new Error('Environment variable NEXT_PUBLIC_ML_API_URI_DEV is not defined');
    }

    
    const response = await fetch(mlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction from ML API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { message: 'Failed to get prediction' },
      { status: 500 }
    );
  }
} 