import api from './api';
import { ApiResponse, LeadFormData, LeadsResponse, Lead, StatusOption } from '../types/lead';

export const leadService = {
  createLead: async (data: LeadFormData): Promise<Lead> => {
    const response = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return response.data.data!.lead;
  },

  getLeads: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
  }): Promise<LeadsResponse> => {
    const response = await api.get<ApiResponse<LeadsResponse>>('/leads', { params });
    return response.data.data!;
  },

  updateLeadStatus: async (id: string, status: StatusOption): Promise<Lead> => {
    const response = await api.patch<ApiResponse<{ lead: Lead }>>(`/leads/${id}/status`, {
      status,
    });
    return response.data.data!.lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportLeads: async (): Promise<Blob> => {
    const response = await api.get('/leads/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

