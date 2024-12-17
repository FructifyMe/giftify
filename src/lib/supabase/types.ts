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
          notifications: boolean | null
          visibility: 'public' | 'private' | 'friends' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email: string
          avatar_url?: string | null
          notifications?: boolean | null
          visibility?: 'public' | 'private' | 'friends' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string
          avatar_url?: string | null
          notifications?: boolean | null
          visibility?: 'public' | 'private' | 'friends' | null
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
          is_claimed: boolean | null
          is_on_sale: boolean | null
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
          is_claimed?: boolean | null
          is_on_sale?: boolean | null
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
          is_claimed?: boolean | null
          is_on_sale?: boolean | null
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
      gift_groups: {
        Row: {
          id: string
          created_by: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
      }
      group_invites: {
        Row: {
          id: string
          group_id: string
          email: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          email: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          email?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
      }
    }
  }
}