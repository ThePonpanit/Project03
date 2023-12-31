﻿export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          created_at: string;
          id: number;
          title: string;
          info: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          title: string;
          info?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          title?: string;
          info?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
