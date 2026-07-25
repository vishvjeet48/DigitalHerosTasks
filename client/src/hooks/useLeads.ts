import { useCallback, useEffect, useState } from 'react';
import { leadService } from '../services/leadService';
import { Lead, LeadStats, PaginationMeta, StatusOption } from '../types/lead';
import { ITEMS_PER_PAGE } from '../utils/constants';
import { useDebounce } from './useDebounce';
import { toast } from 'sonner';

interface UseLeadsReturn {
  leads: Lead[];
  stats: LeadStats;
  pagination: PaginationMeta;
  isLoading: boolean;
  search: string;
  statusFilter: string;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPage: (page: number) => void;
  updateStatus: (id: string, status: StatusOption) => Promise<void>;
  refetch: () => Promise<void>;
}

const defaultStats: LeadStats = { total: 0, New: 0, Contacted: 0, Closed: 0 };
const defaultPagination: PaginationMeta = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  total: 0,
  totalPages: 0,
};

export const useLeads = (): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>(defaultStats);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads({
        page,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        sort: 'newest',
      });
      setLeads(data.leads);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (id: string, status: StatusOption) => {
    try {
      const updatedLead = await leadService.updateLeadStatus(id, status);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === id ? updatedLead : lead))
      );
      toast.success(`Status updated to ${status}`);
      await fetchLeads();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSetSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSetStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return {
    leads,
    stats,
    pagination,
    isLoading,
    search,
    statusFilter,
    setSearch: handleSetSearch,
    setStatusFilter: handleSetStatusFilter,
    setPage,
    updateStatus,
    refetch: fetchLeads,
  };
};
