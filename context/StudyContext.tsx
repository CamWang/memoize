import React, { createContext, useContext, useEffect, useState } from 'react';
import { cardApi, categoryApi, Card, Category, createAuthenticatedRequest } from '@/services/api';
import { useAuth } from './AuthContext';

export interface TagSummary {
  name: string;
  cardCount: number;
  studiedCount: number;
}

export interface CategorySummary extends Category {
  cardCount: number;
  studiedCount: number;
}

interface StudyContextType {
  categories: CategorySummary[];
  tags: TagSummary[];
  totalCards: number;
  studiedCards: number;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getCardsByCategory: (categoryId: number) => Promise<Card[]>;
  getCardsByTag: (tag: string) => Promise<Card[]>;
  getCardById: (cardId: number) => Promise<Card | null>;
  markCardAsStudied: (cardId: number, success: boolean) => Promise<void>;
  getStudyCards: (limit?: number) => Promise<Card[]>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const request = token ? createAuthenticatedRequest(token) : null;

  const loadData = async () => {
    if (!request) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories and cards
      const [categoriesData, cardsData] = await Promise.all([
        categoryApi.list(request)(),
        cardApi.list(request)(),
      ]);

      // Process categories with card counts
      const categoriesWithCounts: CategorySummary[] = categoriesData.map(category => ({
        ...category,
        cardCount: cardsData.filter(card => card.category_id === category.id).length,
        studiedCount: cardsData.filter(card => 
          card.category_id === category.id && card.study_count > 0
        ).length,
      }));

      setCategories(categoriesWithCounts);
      setCards(cardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const getTags = (): TagSummary[] => {
    const tagsMap = new Map<string, TagSummary>();
    
    cards.forEach(card => {
      card.tags.forEach(tag => {
        const current = tagsMap.get(tag) || { name: tag, cardCount: 0, studiedCount: 0 };
        tagsMap.set(tag, {
          ...current,
          cardCount: current.cardCount + 1,
          studiedCount: current.studiedCount + (card.study_count > 0 ? 1 : 0),
        });
      });
    });

    return Array.from(tagsMap.values());
  };

  const getCardsByCategory = async (categoryId: number): Promise<Card[]> => {
    if (!request) throw new Error('Not authenticated');
    return cardApi.list(request)({
      category_id: categoryId,
      limit: 50
    });
  };

  const getCardsByTag = async (tag: string): Promise<Card[]> => {
    if (!request) throw new Error('Not authenticated');
    return cardApi.list(request)({
      tag,
      limit: 50
    });
  };

  const getStudyCards = async (limit: number = 20): Promise<Card[]> => {
    if (!request) throw new Error('Not authenticated');
    return cardApi.list(request)({
      study: true,
      limit
    });
  };

  const getCardById = async (cardId: number): Promise<Card | null> => {
    return cards.find(card => card.id === cardId) || null;
  };

  const markCardAsStudied = async (cardId: number, success: boolean) => {
    if (!request) throw new Error('Not authenticated');
    try {
      await cardApi.study(request)(cardId, success);
      await loadData(); // Refresh data after marking as studied
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record study');
      throw err;
    }
  };

  const value: StudyContextType = {
    categories,
    tags: getTags(),
    totalCards: cards.length,
    studiedCards: cards.filter(card => card.study_count > 0).length,
    isLoading,
    error,
    refreshData: loadData,
    getCardsByCategory,
    getCardsByTag,
    getCardById,
    markCardAsStudied,
    getStudyCards,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
} 