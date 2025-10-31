"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ImageModalContextType {
  imageUrl: string | null;
  openModal: (url: string) => void;
  closeModal: () => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export function ImageModalProvider({ children }: { children: ReactNode }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openModal = (url: string) => {
    setImageUrl(url);
  };

  const closeModal = () => {
    setImageUrl(null);
  };

  return (
    <ImageModalContext.Provider value={{ imageUrl, openModal, closeModal }}>
      {children}
    </ImageModalContext.Provider>
  );
}

export function useImageModal() {
  const context = useContext(ImageModalContext);
  if (context === undefined) {
    throw new Error('useImageModal must be used within an ImageModalProvider');
  }
  return context;
}
