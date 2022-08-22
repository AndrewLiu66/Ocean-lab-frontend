import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const Analytics2 = Loadable(lazy(() => import('./Analytics2')))
const VideoPage = Loadable(lazy(() => import('./VideoPage')))

export const dashboardRoutes = [
    {
        path: '/',
        element: <Analytics2 />,
    },
    {
        path: '/Video',
        element: <VideoPage />,
    },
]
