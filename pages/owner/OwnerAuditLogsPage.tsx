
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ownerService } from '../../services/ownerService';
import { AuditLog, UserRole, AuditLogActionType } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Input from '../../components/Input'; // Assuming you have this for filters
import { AlertTriangle, ListChecks, Filter, Search } from 'lucide-react';

const AuditLogRow: React.FC<{ log: AuditLog }> = ({ log }) => {
  return (
    <tr className="hover:bg-gray-50 text-sm">
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{new Date(log.timestamp).toLocaleString()}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textPrimary font-medium">{log.userEmailPerformingAction}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{log.actionType}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{log.targetEntityType || 'N/A'}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{log.targetEntityID || 'N/A'}</td>
      <td className="px-4 py-3 text-textSecondary max-w-md truncate" title={log.summaryOfChange}>{log.summaryOfChange}</td>
      <td className="px-4 py-3 whitespace-nowrap text-textSecondary">{log.ipAddress || 'N/A'}</td>
    </tr>
  );
};

const OwnerAuditLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    userEmail: '',
    actionType: '',
    entityType: '',
    // Add date filters if needed
  });

  const fetchAuditLogs = useCallback(async () => {
    if (!user || user.role !== UserRole.OWNER) {
      setError("Access denied.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await ownerService.getAuditLogs(activeFilters);
      setAuditLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs.");
    } finally {
      setIsLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // Debounce search or trigger on button click if preferred
  // For simplicity, useEffect will refetch on filter change.

  if (isLoading && auditLogs.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Audit Logs</h2>
        <p className="text-textSecondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center space-x-3">
        <ListChecks size={32} className="text-primary"/>
        <h1 className="text-3xl font-bold text-textPrimary">Audit Logs</h1>
      </div>
      <p className="text-textSecondary">Review system activity and important changes.</p>

      <div className="bg-surface p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center"><Filter size={18} className="mr-2"/>Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input 
                label="User Email"
                name="userEmail"
                value={filters.userEmail}
                onChange={handleFilterChange}
                placeholder="Filter by user email..."
                prefixIcon={<Search size={16} className="text-gray-400"/>}
                containerClassName="!mb-0"
            />
            <div>
                <label htmlFor="actionTypeFilter" className="block text-sm font-medium text-textPrimary mb-1">Action Type</label>
                <select 
                    id="actionTypeFilter"
                    name="actionType"
                    value={filters.actionType}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                    <option value="">All Action Types</option>
                    {Object.values(AuditLogActionType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <Input 
                label="Target Entity Type"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                placeholder="e.g., Affiliate, Setting"
                containerClassName="!mb-0"
            />
        </div>
        {/* Search button could be added here if not using useEffect on filter change */}
      </div>
      
      {isLoading && auditLogs.length > 0 && <div className="my-4 text-center"><LoadingSpinner /></div>}

      {auditLogs.length > 0 ? (
        <div className="bg-surface shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">User Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Action Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Entity Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Entity ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Summary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <AuditLogRow key={log.logID} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p className="text-center text-textSecondary py-10">No audit logs found matching your criteria.</p>
      )}
    </div>
  );
};

export default OwnerAuditLogsPage;
