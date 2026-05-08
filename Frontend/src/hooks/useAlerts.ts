import { useEffect, useState, useCallback } from 'react';
import { alertasApi } from '../api/alertas.api';

export function useAlerts() {
  const [count, setCount] = useState(0);

  const refetch = useCallback(() => {
    alertasApi
      .getNoLeidas()
      .then((res) => setCount(res.data?.length ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { count, refetch };
}
