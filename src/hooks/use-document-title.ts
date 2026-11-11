import { useEffect } from 'react'

import { appConfig } from '@/config/app'

export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} · ${appConfig.productName}` : appConfig.productName
  }, [title])
}
