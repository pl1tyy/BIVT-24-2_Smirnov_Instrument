export interface Assignment {
  id: number;
  tool_id: number;
  user_id: number;
  issued_at: string;
  returned_at?: string;
  notes?: string;
}