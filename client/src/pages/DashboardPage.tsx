import { Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLeads } from '../hooks/useLeads';
import { StatsCards } from '../components/dashboard/StatsCards';
import { SearchBar } from '../components/dashboard/SearchBar';
import { StatusFilter } from '../components/dashboard/StatusFilter';
import { LeadsTable } from '../components/dashboard/LeadsTable';
import { Pagination } from '../components/dashboard/Pagination';
import { Button } from '../components/ui/Button';
import { leadService } from '../services/leadService';

export const DashboardPage = () => {
  const {
    leads,
    stats,
    pagination,
    isLoading,
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    setPage,
    updateStatus,
  } = useLeads();

  const handleExportCSV = async () => {
    try {
      try {
        const blob = await leadService.exportLeads();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success('CSV Export downloaded successfully');
        return;
      } catch {
        // Fallback to client-side CSV generation
      }

      if (!leads || leads.length === 0) {
        toast.info('No leads available to export');
        return;
      }

      const header = 'ID,Name,Email,Budget,Status,Message,Created At\n';
      const rows = leads.map((l) => {
        const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
        return [
          l._id,
          escape(l.name),
          escape(l.email),
          escape(l.budget),
          escape(l.status),
          escape((l.message || '').replace(/\n/g, ' ')),
          l.createdAt ? new Date(l.createdAt).toISOString() : '',
        ].join(',');
      });

      const csvContent = header + rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV Export downloaded successfully');
    } catch {
      toast.error('Failed to export leads CSV');
    }
  };


  const hasActiveFilters = Boolean(search || statusFilter);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Lead Intelligence Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Real-time lead tracking, pipeline analytics, and status controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="shadow-2xs">
            <Download className="h-4 w-4 text-gray-600" aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <SearchBar value={search} onChange={setSearch} />
        
        <div className="flex items-center gap-3">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        onStatusChange={updateStatus}
      />

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

