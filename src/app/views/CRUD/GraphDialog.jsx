import React, { useEffect, useState } from 'react'
import { Button, IconButton, Icon, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { convertHexToRGB } from 'app/utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
    Card, Grid
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    getInitialGraph, getUpdatedGraph
} from 'app/redux/actions/GraphActions'
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios'
import fileDownload from 'js-file-download'
import DownloadIcon from '@mui/icons-material/Download';
import AutorenewIcon from '@mui/icons-material/Autorenew';


const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px !important',
    marginTop: '0px !important'
}))

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '130px',
    marginRight: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px'
    },
}))

const ChartHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '.8rem 1.25rem',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${`rgba(${convertHexToRGB(
        theme.palette.text.disabled
    )}, 0.2)`}`,
}))

const AnalyticsRoot = styled(Card)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        width: '90vw',
        height: '80vh'
    },
    [theme.breakpoints.down('md')]: {
        width: '90vw',
        height: '85vh'
    },
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '90vh'
    },
}))

const IMG = styled('img')(({ theme }) => ({
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
        width: '110%'
    },
}))

const StyledH3 = styled('div')(() => ({
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "1.5",
}))

const StyledDownload = styled('a')(() => ({
    display: 'flex'
}))

const GraphDialog = ({ currentLocation, open, handleClose }) => {
    const [startDate, setStartDate] = useState(new Date(2018, 1, 1))
    const [endDate, setEndDate] = useState(new Date(2018, 1, 3))
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const textPrimary = palette.text.primary
    // currType = type after clicking update button
    const [currType, setCurrType] = useState('Spectrogram');
    // graphType = type after changing in the menu
    const [graphType, setGraphType] = useState('Spectrogram');
    const { initGraph } = useSelector((state) => state.graph)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [frequency, setFrequency] = useState(50)

    useEffect(() => {
        setLoading(true)
        const location = currentLocation.replace(" ", "_").toLowerCase()

        async function fetchData() {
            await dispatch(getInitialGraph(startDate, endDate, location))
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (currType === 'Spectrogram' || currType === 'Octave Band Median/Mean')
        {
            if (Object.keys(initGraph).length !== 0)
            {
                setLoading(false)
                const outer = document.getElementById('outer')
                const el = document.createElement('div');
                el.setAttribute('id', 'graphBox');
                outer.appendChild(el);
                window.Bokeh.embed.embed_item(initGraph, "graphBox")
                return () => {
                    if (document.getElementById('graphBox'))
                    {
                        const h1 = document.getElementById('graphBox')
                        h1.remove()
                    }
                }
            }
        } else if (currType === 'SPDF')
        {
            setLoading(false)
            let imageResult = initGraph['image']
            let image64 = imageResult.split('\'')[1]
            setImage(image64)
        }
    }, [initGraph])


    const handleChange = (event) => {
        setGraphType(event.target.value);
    };

    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value);
    };

    const handleUpdateGraph = () => {
        setLoading(true)
        setCurrType(graphType)
        let start = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
        let end = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate()
        const request_location = currentLocation.replace(" ", "_").toLowerCase()
        dispatch(getUpdatedGraph(start, end, graphType, request_location, frequency))
    }

    const download = () => {
        const location = currentLocation.replace(" ", "_").toLowerCase()
        axios.post('/api/downloads', { startDate, endDate, location }, {
            responseType: 'blob',
        }).then(res => {
            fileDownload(res.data, `${currentLocation + "-" + currType + "-" + handleDate(startDate) + '-' + handleDate(endDate)}.zip`);
        });
    }



    const handleDate = (dt) => {
        return dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    }

    console.log(image)
    return (
        <Backdrop
            open={open}
            sx={{ zIndex: 101 }}
        >
            <AnalyticsRoot sx={{ width: '70vw', height: '80vh', overflow: 'scroll' }} >
                <ChartHeader>
                    <StyledH3>{currentLocation} Hydrophone Visualization</StyledH3>
                    <IconButton onClick={handleClose}>
                        <Icon sx={{ color: textPrimary }}>close</Icon>
                    </IconButton>
                </ChartHeader>

                <Grid container spacing={1} p={4} pb={0} sx={{
                    '& .MuiTextField-root': { mb: 1, width: '100%' },
                }}>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                }}
                                minDate={new Date(2015, 0, 14)}
                                maxDate={new Date(2020, 11, 31)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                }}
                                minDate={new Date(2015, 0, 14)}
                                maxDate={new Date(2020, 11, 31)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={graphType}
                                label="Type"
                                defaultValue={"Spectrogram"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'Spectrogram'}>Spectrogram</MenuItem>
                                <MenuItem value={'SPDF'}>SPDF</MenuItem>
                                <MenuItem value={'Octave Band Median/Mean'}>Octave Band Median/Mean</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        {graphType === 'Octave Band Median/Mean' ?
                            <TextField
                                required
                                value={frequency}
                                id="outlined-required"
                                label="Required frequency"
                                onChange={handleFrequencyChange}
                            /> :
                            <TextField
                                disabled
                                defaultValue="0"
                                id="outlined-required"
                                label="No frequency needed"
                            />
                        }
                    </Grid>
                </Grid>

                <Grid container spacing={1} p={4} pt={1}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <ButtonBox>
                            <StyledButton variant="contained" component="span"
                                onClick={handleUpdateGraph}
                            >
                                <AutorenewIcon sx={{ mr: 1 }} />
                                Update
                            </StyledButton>

                            <StyledButton variant="contained" component="span"
                                onClick={() => download()}
                                sx={{ backgroundColor: "#008255" }}
                            >
                                <DownloadIcon sx={{ mr: 1 }} />
                                CSV
                            </StyledButton>

                            {(currType === 'SPDF' && graphType === 'SPDF' && loading === false) ?
                                <StyledButton variant="contained" sx={{ backgroundColor: "#008255" }}>
                                    <StyledDownload href={`data:image/jpeg;base64,${image}`} download={`${currentLocation + "-" + currType + "-" + handleDate(startDate) + '-' + handleDate(endDate)}.jpg`}>
                                        <DownloadIcon sx={{ mr: 1 }} />
                                        JPG
                                    </StyledDownload>
                                </StyledButton> :
                                <StyledButton disabled variant="contained" sx={{ backgroundColor: "#21b6ae" }}>
                                    <DownloadIcon sx={{ mr: 1 }} />
                                    JPG
                                </StyledButton>
                            }

                        </ButtonBox>
                    </Grid>
                </Grid>

                <Grid container>
                    {loading &&
                        <Grid item lg={12} md={12} sm={12} xs={12} alignItems="center" justifyContent="center" textAlign="center" mb="20px">
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        </Grid>
                    }

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {currType === 'SPDF' && image !== '' && <FlexBox>
                            <IMG src={`data:image/jpg;base64,${image}`} />
                        </FlexBox>}
                    </Grid>
                </Grid>

                {(currType === 'Spectrogram' || currType === 'Octave Band Median/Mean') && <FlexBox sx={{ overflow: 'auto' }} id="outer"></FlexBox>}

            </AnalyticsRoot >
        </Backdrop >
    )
}

export default GraphDialog
