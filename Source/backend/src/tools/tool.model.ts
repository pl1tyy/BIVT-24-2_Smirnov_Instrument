export interface Tool {
  id: number;
  inventory_number: string;
  name: string;
  category_id?: number;
  status: string;
  purchase_date?: string;
  condition_score?: number;
}