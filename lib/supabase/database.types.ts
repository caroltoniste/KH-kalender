export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          team: string;
          title: string;
          type: string;
          datetime: string;
          time: string | null;
          owner: string | null;
          channels: string[];
          notes: string | null;
          copy: string | null;
          materials: string | null;
          done: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team: string;
          title: string;
          type: string;
          datetime: string;
          time?: string | null;
          owner?: string | null;
          channels?: string[];
          notes?: string | null;
          copy?: string | null;
          materials?: string | null;
          done?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team?: string;
          title?: string;
          type?: string;
          datetime?: string;
          time?: string | null;
          owner?: string | null;
          channels?: string[];
          notes?: string | null;
          copy?: string | null;
          materials?: string | null;
          done?: boolean;
          created_at?: string;
          updated_at?: string;
        };
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
  };
}
