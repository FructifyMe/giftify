export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string
          avatar_url: string | null
          notifications: boolean
          visibility: 'public' | 'private' | 'friends'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email: string
          avatar_url?: string | null
          notifications?: boolean
          visibility?: 'public' | 'private' | 'friends'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string
          avatar_url?: string | null
          notifications?: boolean
          visibility?: 'public' | 'private' | 'friends'
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          product_url: string | null
          is_claimed: boolean
          is_on_sale: boolean
          sale_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          product_url?: string | null
          is_claimed?: boolean
          is_on_sale?: boolean
          sale_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          product_url?: string | null
          is_claimed?: boolean
          is_on_sale?: boolean
          sale_price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}