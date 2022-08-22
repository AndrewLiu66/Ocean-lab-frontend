import axios from 'axios'

export const GET_INIT_GRAPH = 'GET_INIT_GRAPH'
export const GET_CTP_INIT_GRAPH = 'GET_CTP_INIT_GRAPH'
export const GET_UPDATE_GRAPH = 'GET_UPDATE_GRAPH'

export const getInitialGraph = (startDate, endDate, location) => (dispatch) => {
    axios
        .post('/api/getInitGraph', { startDate, endDate, location })
        .then((res) => {
            dispatch({
                type: GET_INIT_GRAPH,
                payload: res.data,
            })
        })
}

export const getCTPInitialGraph = (location) => (dispatch) => {
    axios
        .post('/api/getCTP', { location })
        .then((res) => {
            dispatch({
                type: GET_CTP_INIT_GRAPH,
                payload: res.data,
            })
        })
}

export const getUpdatedGraph = (startDate, endDate, graphType, location, frequency) => (dispatch) => {
    axios
        .post('/api/getUpdatedGraph', { startDate, endDate, graphType, location, frequency })
        .then((res) => {
            dispatch({
                type: GET_UPDATE_GRAPH,
                payload: res.data,
            })
        })
}
