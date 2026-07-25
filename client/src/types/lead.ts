export const BUDGET_OPTIONS = [
  'Under $500',
  '$500-$1000',
  '$1000-$5000',
  'Above $5000',
] as const;

export const STATUS_OPTIONS = ['New', 'Contacted', 'Closed'] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];
export type StatusOption = (typeof STATUS_OPTIONS)[number];

export interface Lead {
  _id: string;
  name: string;
  email: string;
  budget: BudgetOption;
  message: string;
  status: StatusOption;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  budget: BudgetOption;
  message: string;
}

export interface LeadStats {
  total: number;
  New: number;
  Contacted: number;
  Closed: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMeta;
  stats: LeadStats;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}
