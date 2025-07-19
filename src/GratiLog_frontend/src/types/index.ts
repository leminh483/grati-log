import { Principal } from '@dfinity/principal';

export type GratitudeCategory = 
  | { Family: null }
  | { Health: null }
  | { Work: null }
  | { Friends: null }
  | { Nature: null }
  | { Achievement: null }
  | { Experience: null }
  | { Other: null };

export interface GratitudeEntry {
  id: bigint;
  author: Principal;
  title: string;
  content: string;
  category: GratitudeCategory;
  mood_rating: bigint;
  is_public: boolean;
  created_at: bigint;
  appreciations: bigint;
}

export interface Appreciation {
  entry_id: bigint;
  appreciator: Principal;
  timestamp: bigint;
}

export interface UserStats {
  total_entries: bigint;
  current_streak: bigint;
  longest_streak: bigint;
  entries_by_category: Array<[GratitudeCategory, bigint]>;
  average_mood: number;
}

export interface EntryInput {
  title: string;
  content: string;
  category: GratitudeCategory;
  mood_rating: bigint;
  is_public: boolean;
}

export interface SystemStats {
  total_users: bigint;
  total_entries: bigint;
  total_public_entries: bigint;
  total_appreciations: bigint;
}

export type Result<T> = 
  | { ok: T }
  | { err: string };

// Helper types for UI
export type CategoryKey = 'Family' | 'Health' | 'Work' | 'Friends' | 'Nature' | 'Achievement' | 'Experience' | 'Other';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  emoji: string;
  color: string;
}

export interface MoodRating {
  value: number;
  label: string;
  emoji: string;
  color: string;
}