'use client'

import {NextUIProvider} from '@nextui-org/react'

export function NUIProvider({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}
