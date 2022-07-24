import React, { useEffect, useState } from 'react'
import {
    Button,
    IconButton,
    Icon,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { convertHexToRGB } from 'app/utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Grid } from '@mui/material'
import {
    getInitialGraph,
    getUpdatedGraph,
} from 'app/redux/actions/GraphActions'
import Backdrop from '@mui/material/Backdrop'
import axios from 'axios'
import DownloadIcon from '@mui/icons-material/Download'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { ExportToCsv } from 'export-to-csv'
import { DatePicker } from 'antd'
import * as moment from 'moment'

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px !important',
    marginTop: '0px !important',
    [theme.breakpoints.down('xl')]: {
        justifyContent: 'flex-start',
    },
}))

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '130px',
    marginRight: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const ChartHeader = styled(Box)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    zIndex: 200,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    width: 'inherit',
    padding: '.8rem 1.25rem',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${`rgba(${convertHexToRGB(
        theme.palette.text.disabled
    )}, 0.2)`}`,
}))

const AnalyticsRoot = styled(Card)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        width: '70%',
        height: '60%',
    },
    [theme.breakpoints.down('md')]: {
        width: '80%',
        height: '70%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '85vh',
    },
}))

const IMG = styled('img')(({ theme }) => ({
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
        width: '110%',
    },
}))

const StyledH3 = styled('div')(() => ({
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.5',
}))

const StyledDownload = styled('a')(() => ({
    display: 'flex',
    color: 'inherit',
}))

const DateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    marginBottom: '-10px',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
        marginBottom: '5px',
    },
}))

const { RangePicker } = DatePicker

const GraphDialog = ({ currentLocation, open, handleClose }) => {
    const [startDate, setStartDate] = useState('2018-03-01 00:00')
    const [endDate, setEndDate] = useState('2018-03-02 00:00')
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const textPrimary = palette.text.primary
    const [currType, setCurrType] = useState('Spectrogram')
    const [graphType, setGraphType] = useState('Spectrogram')
    const { initGraph } = useSelector((state) => state.graph)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [frequency, setFrequency] = useState(50)
    const [error, setError] = useState('')

    const fetchData = async () => {
        await dispatch(
            getInitialGraph(
                startDate,
                endDate,
                currentLocation.replace(' ', '_').toLowerCase()
            )
        )
    }

    useEffect(() => {
        console.log('child')
    })
    useEffect(() => {
        console.log('chil1')
        setLoading(true)
        fetchData()
    }, [])

    useEffect(() => {
        if (currType === 'Spectrogram' || currType === 'Octave Band') {
            if (Object.keys(initGraph).length !== 0) {
                setLoading(false)
                const outer = document.getElementById('outer')
                const el = document.createElement('div')
                el.setAttribute('id', 'graphBox')
                outer.appendChild(el)
                window.Bokeh.embed.embed_item(initGraph, 'graphBox')
                return () => {
                    if (document.getElementById('graphBox')) {
                        const h1 = document.getElementById('graphBox')
                        h1.remove()
                    }
                }
            }
        } else if (currType === 'SPDF') {
            setLoading(false)
            let imageResult = initGraph['image']
            let image64 = imageResult.split("'")[1]
            setImage(image64)
        }
    }, [initGraph])

    const handleOutputName = () => {
        return currentLocation + '-' + startDate + '-' + endDate
    }

    const options = {
        fieldSeparator: ',',
        filename: `${currType}-${handleOutputName()}`,
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
    }

    const handleChange = (event) => {
        setGraphType(event.target.value)
    }

    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value)
    }
    const handleCalendarChange = (dates, dateStrings) => {
        if (dateStrings[1] !== '') {
            const diff = dates[1].diff(dates[0], 'minutes')
            if (diff < 15) {
                setError('error')
            } else {
                setError('')
            }
        }

        if (dateStrings[1] === '' || dateStrings[0] !== startDate) {
            const futureMonth = moment(dateStrings[0]).add(1, 'M')
            const next = moment(futureMonth._d)
            setStartDate(dateStrings[0])
            setEndDate(next.format('YYYY-MM-DD HH:mm'))
        } else {
            setEndDate(dateStrings[1])
        }
    }

    const handleUpdateGraph = () => {
        setLoading(true)
        setCurrType(graphType)
        const request_location = currentLocation.replace(' ', '_').toLowerCase()
        dispatch(
            getUpdatedGraph(
                startDate,
                endDate,
                graphType,
                request_location,
                frequency
            )
        )
    }

    const download = () => {
        const location = currentLocation.replace(' ', '_').toLowerCase()
        axios
            .post('/api/downloads', {
                startDate,
                endDate,
                location,
                currType,
                frequency,
            })
            .then((res) => {
                console.log(res.data.data)
                const csvExporter = new ExportToCsv(options)
                csvExporter.generateCsv(res.data.data)
            })
    }

    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 14]) ||
                current > moment.utc([2020, 11, 31]))
        )
    }

    const checkFrequecy = () => {
        if (frequency < 1 || frequency > 80) return true
        return false
    }

    return (
        <Backdrop open={open} sx={{ zIndex: 101 }}>
            <AnalyticsRoot
                sx={{
                    width: '60%',
                    height: '70%',
                    overflow: 'scroll',
                }}
            >
                <ChartHeader>
                    <StyledH3>
                        {currentLocation} Hydrophone Visualization
                    </StyledH3>
                    <IconButton onClick={handleClose}>
                        <Icon sx={{ color: textPrimary }}>close</Icon>
                    </IconButton>
                </ChartHeader>
                <Grid
                    container
                    spacing={1}
                    p={4}
                    pb={0}
                    mt={7}
                    mb={2}
                    sx={{
                        '& .MuiTextField-root': { width: '100%' },
                    }}
                >
                    <Grid
                        item
                        lg={5}
                        md={6}
                        sm={12}
                        xs={12}
                        display="flex"
                        alignItems="center"
                        pt={0}
                    >
                        <DateBox>
                            <RangePicker
                                status={`${error}`}
                                size="large"
                                showTime={{
                                    hideDisabledOptions: true,
                                }}
                                style={{ width: '100%' }}
                                defaultValue={[
                                    moment(startDate),
                                    moment(endDate),
                                ]}
                                value={[moment(startDate), moment(endDate)]}
                                format={'YYYY-MM-DD HH:mm'}
                                onCalendarChange={handleCalendarChange}
                                disabledDate={disabledDate}
                            />
                            {error !== '' && (
                                <Box
                                    sx={{
                                        color: 'red',
                                        position: 'absolute',
                                        bottom: '-5px',
                                    }}
                                >
                                    Time interval should be at least 15 min!
                                </Box>
                            )}
                        </DateBox>
                    </Grid>

                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">
                                Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={graphType}
                                label="Type"
                                defaultValue={'Spectrogram'}
                                onChange={handleChange}
                            >
                                <MenuItem value={'Spectrogram'}>
                                    Spectrogram
                                </MenuItem>
                                <MenuItem value={'SPDF'}>SPDF</MenuItem>
                                <MenuItem value={'Octave Band'}>
                                    Octave Band
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <TextField
                            error={checkFrequecy()}
                            helperText={
                                checkFrequecy() &&
                                'Frequency not in valid range'
                            }
                            disabled={
                                graphType === 'Octave Band' ? false : true
                            }
                            required
                            value={frequency}
                            id="outlined-required"
                            label="Required frequency 1-80"
                            onChange={handleFrequencyChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1} p={4} pt={1}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <ButtonBox>
                            <StyledButton
                                disabled={checkFrequecy() || error !== ''}
                                variant="contained"
                                component="span"
                                onClick={handleUpdateGraph}
                            >
                                <AutorenewIcon sx={{ mr: 1 }} />
                                Update
                            </StyledButton>

                            <StyledButton
                                variant="contained"
                                component="span"
                                onClick={() => download()}
                                sx={{ backgroundColor: '#008255' }}
                            >
                                <DownloadIcon sx={{ mr: 1 }} />
                                CSV
                            </StyledButton>

                            <StyledButton
                                disabled={
                                    currType === 'SPDF' && loading === false
                                        ? false
                                        : true
                                }
                                variant="contained"
                                sx={{
                                    backgroundColor: '#008255',
                                }}
                            >
                                <StyledDownload
                                    href={`data:image/jpeg;base64,${image}`}
                                    download={`${handleOutputName()}.jpg`}
                                >
                                    <DownloadIcon sx={{ mr: 1 }} />
                                    JPG
                                </StyledDownload>
                            </StyledButton>
                        </ButtonBox>
                    </Grid>
                </Grid>

                <Grid container>
                    {loading && (
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            mb="20px"
                        >
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        </Grid>
                    )}

                    {currType === 'SPDF' && image !== '' && (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <FlexBox>
                                <IMG src={`data:image/jpg;base64,${image}`} />
                            </FlexBox>
                        </Grid>
                    )}
                </Grid>

                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FlexBox style={{ overflow: 'auto' }}>
                            {(currType === 'Spectrogram' ||
                                currType === 'Octave Band') && (
                                <Box id="outer"></Box>
                            )}
                        </FlexBox>
                    </Grid>
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}
export default React.memo(GraphDialog)
