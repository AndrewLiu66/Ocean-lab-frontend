import React from 'react'
import { Span } from '../Typography'
import { styled, Box } from '@mui/system'
import MatxLogo from '../MatxLogo/MatxLogo'
import { H4 } from 'app/components/Typography'

const BrandRoot = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

const StyledSpan = styled(Span)(() => ({
    fontSize: 18,
    marginLeft: '.5rem',
}))

const IMG = styled('img')(({ theme }) => ({
    width: '240px',
    marginLeft: '15px',
    [theme.breakpoints.down('sm')]: {
        display: 'none'
    },
}))

const Brand = ({ children }) => {
    return (
        <BrandRoot sx={{ py: 1 }}>
            <Box display="flex" alignItems="center">
                <MatxLogo />
                <StyledSpan className="sidenavHoverShow">
                    <H4>Ocean Data Lab</H4>
                </StyledSpan>
                <IMG src={'/assets/images/logos/uw.png'} />
            </Box>
            <Box
                className="sidenavHoverShow"
            >
                {children || null}
            </Box>
        </BrandRoot>
    )
}

export default Brand
