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
      links: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          type: string
          data: Json
          position: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          type: string
          data: Json
          position: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          type?: string
          data?: Json
          position?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string | null
          bio: string | null
          avatar: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name?: string | null
          bio?: string | null
          avatar?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string | null
          bio?: string | null
          avatar?: string | null
        }
      }
      themes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          background_color: string
          button_color: string
          text_color: string
          font_family: string
          button_style: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          background_color?: string
          button_color?: string
          text_color?: string
          font_family?: string
          button_style?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          background_color?: string
          button_color?: string
          text_color?: string
          font_family?: string
          button_style?: string
        }
      }
    }
  }
}