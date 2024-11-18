import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';

export const useAccounts = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  const connectMutation = useMutation({
    mutationFn: ({ platform, credentials }) => 
      accountService.connectAccount(platform, credentials),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (accountId) => accountService.disconnectAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ accountId, data }) => 
      accountService.updateAccount(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return {
    accounts,
    error,
    isLoading: 
      connectMutation.isLoading || 
      disconnectMutation.isLoading || 
      updateMutation.isLoading,
    connectAccount: (platform, credentials) => 
      connectMutation.mutate({ platform, credentials }),
    disconnectAccount: (accountId) => 
      disconnectMutation.mutate(accountId),
    updateAccount: (accountId, data) => 
      updateMutation.mutate({ accountId, data }),
  };
};