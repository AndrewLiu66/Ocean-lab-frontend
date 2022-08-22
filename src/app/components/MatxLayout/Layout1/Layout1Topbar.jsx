import { styled, Box } from '@mui/system'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { topBarHeight } from 'app/utils/constant'
import Brand from '../../Brand/Brand'
import React, { useState } from 'react'
import { Drawer } from '@mui/material'
import { H4, Paragraph } from 'app/components/Typography'
import { Link } from 'react-router-dom'

const TopbarRoot = styled('div')(() => ({
    top: 0,
    zIndex: 96,
    transition: 'all 0.3s ease',
    boxShadow: themeShadows[8],
    height: topBarHeight,
}))

const TopbarContainer = styled(Box)(({ theme }) => ({
    padding: '8px',
    paddingLeft: 18,
    paddingRight: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: 14,
        paddingRight: 16,
    },
}))

const ContentBox = styled('div')(({ theme }) => ({
    padding: '40px',
    width: '350px',
    [theme.breakpoints.down('sm')]: {
        width: '280px',
    },
}))

const ChunkBox = styled('div')(() => ({
    marginBottom: '40px',
}))

const InfoBox = styled(Box)(() => ({
    display: 'flex',
}))

const Options = styled(H4)(({ theme }) => ({
    margin: '15px',
    cursor: 'pointer'
}))

const Layout1Topbar = () => {
    const anchor = 'right'
    const [state, setState] = useState({
        right: false,
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }
    return (
        <TopbarRoot>
            <TopbarContainer>
                <Link to="/">
                    <Box display="flex">
                        <Brand />
                    </Box>
                </Link>
                <InfoBox sx={{ p: 1 }}>
                    <Link to="/">
                        <Options>Map</Options>
                    </Link>
                    <Link to="/Video">
                        <Options>Gallary</Options>
                    </Link>
                    {/* <Options>Videos</Options> */}
                    <Options onClick={toggleDrawer(anchor, true)}>About</Options>
                </InfoBox>
                <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    p={4}
                >
                    <ContentBox>
                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>Director</H4>
                            <Paragraph
                                sx={{
                                    mt: 0,
                                    mb: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                Dr. Shima Abadi
                            </Paragraph>
                        </ChunkBox>

                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>Intruction</H4>
                            <Paragraph
                                sx={{
                                    mt: 0,
                                    mb: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                There are 5 pins representing 5 different
                                Hydrophones on the map. Feel free to click on
                                each of them to explore related data
                                visualzitions.
                            </Paragraph>
                        </ChunkBox>

                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>Notice</H4>
                            <Box>
                                For Spectrogram & Octave Band:
                                <div></div>
                                <br />
                                1. feel free to download jpg of the graph by
                                clicking the "save" icon on the right side of
                                the graph.
                                <div></div>
                                <br />
                                2. click the download button to download the
                                data that's used to make the visualization in
                                csv format
                            </Box>
                        </ChunkBox>
                    </ContentBox>
                </Drawer>
            </TopbarContainer>
        </TopbarRoot>
    )
}

export default React.memo(Layout1Topbar)
