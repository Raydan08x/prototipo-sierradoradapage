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
          full_name: string | null
          birth_date: string | null
          address: string | null
          phone: string | null
          gender: 'male' | 'female' | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          newsletter_subscription: boolean
          marketing_consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          birth_date?: string | null
          address?: string | null
          phone?: string | null
          gender?: 'male' | 'female' | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          newsletter_subscription?: boolean
          marketing_consent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          birth_date?: string | null
          address?: string | null
          phone?: string | null
          gender?: 'male' | 'female' | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          newsletter_subscription?: boolean
          marketing_consent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          abv: number | null
          ibu: number | null
          color_hex: string | null
          color_name: string | null
          serving_temp: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          abv?: number | null
          ibu?: number | null
          color_hex?: string | null
          color_name?: string | null
          serving_temp?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          abv?: number | null
          ibu?: number | null
          color_hex?: string | null
          color_name?: string | null
          serving_temp?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_amount: number
          shipping_address: string
          shipping_phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total_amount: number
          shipping_address: string
          shipping_phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_amount?: number
          shipping_address?: string
          shipping_phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}