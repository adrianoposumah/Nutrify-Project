'use client';
import { useEffect } from 'react';

interface DocumentTitleProps {
  title: string;
}

export function DocumentTitle({ title }: DocumentTitleProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
