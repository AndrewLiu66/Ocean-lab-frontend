

export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard/default',
        icon: 'dashboard',
    },
]

export const getfilteredNavigations = (navList = [], role) => {
    return navList.reduce((array, nav) => {
        if (nav.auth)
        {
            if (nav.auth.includes(role))
            {
                array.push(nav)
            }
        } else
        {
            if (nav.children)
            {
                nav.children = getfilteredNavigations(nav.children, role)
                array.push(nav)
            } else
            {
                array.push(nav)
            }
        }
        return array
    }, [])
}
