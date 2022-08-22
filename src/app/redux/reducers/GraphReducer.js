import {
    GET_INIT_GRAPH, GET_UPDATE_GRAPH, GET_CTP_INIT_GRAPH
} from '../actions/GraphActions'

const initialState = {
    initSpecGraph: {},
    initCtpGraph: {},
    csv: {}
}

const GraphReducer = function (state = initialState, action) {
    switch (action.type)
    {
        case GET_INIT_GRAPH: {
            return {
                ...state,
                // graphList: [...action.payload],
                initSpecGraph: { ...action.payload }
            }
        }
        case GET_CTP_INIT_GRAPH: {
            return {
                ...state,
                initCtpGraph: { ...action.payload }
            }
        }
        case GET_UPDATE_GRAPH: {
            return {
                ...state,
                initSpecGraph: { ...action.payload }
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default GraphReducer
