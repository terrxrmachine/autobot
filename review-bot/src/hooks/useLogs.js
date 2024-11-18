import { useQuery, useQueryClient } from '@tanstack/react-query';
import { logService } from '../services/LogService';

export const useLogs = (filters) => {
  const queryClient = useQueryClient();

  const {
    data: logs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['logs', filters],
    queryFn: () => logService.getLogs(filters),
    refetchInterval: 30000, // Обновляем каждые 30 секунд
  });

  const {
    data: stats = {
      totalErrors: 0,
      totalActions: 0,
      successRate: 100
    }
  } = useQuery({
    queryKey: ['logs-stats', filters.timeframe],
    queryFn: async () => {
      const [errorStats, actionStats] = await Promise.all([
        logService.getErrorStats(filters.timeframe),
        logService.getActionStats(filters.timeframe)
      ]);
      return {
        totalErrors: errorStats.total,
        totalActions: actionStats.total,
        successRate: actionStats.successRate
      };
    },
    refetchInterval: 30000,
  });

  const refresh = () => {
    queryClient.invalidateQueries(['logs']);
    queryClient.invalidateQueries(['logs-stats']);
  };

  return {
    logs,
    isLoading,
    error,
    refresh,
    stats
  };
};