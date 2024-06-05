'use client'

import {QueryClientProvider, QueryClient, Query} from '@tanstack/react-query'
import { useState } from 'react'

const Provider = ({children}) => {

    const [queryClient] = useState(() => new QueryClient())
return(
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)
}

export default Provider