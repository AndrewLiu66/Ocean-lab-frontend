import {
    GET_INIT_GRAPH, GET_UPDATE_GRAPH, GET_CSV
} from '../actions/GraphActions'

const initialState = {
    // graphList: [],
    initGraph: {},
    csv: {}
}

const GraphReducer = function (state = initialState, action) {
    switch (action.type)
    {
        case GET_INIT_GRAPH: {
            return {
                ...state,
                // graphList: [...action.payload],
                initGraph: { ...action.payload }
            }
        }
        case GET_UPDATE_GRAPH: {
            return {
                ...state,
                initGraph: { ...action.payload }
            }
        }
        case GET_CSV: {
            return {
                ...state,
                csv: { ...action.payload }
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
