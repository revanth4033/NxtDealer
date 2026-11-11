import { useQuery } from '@tanstack/react-query'

import { queryKeys, services } from '@/services'

export function useCurrentAdmin() {
  return useQuery({
    queryKey: queryKeys.session.currentAdmin,
    queryFn: () => services.session.getCurrentAdmin(),
    staleTime: Infinity,
  })
}
