import {
    GET_INIT_GRAPH, GET_UPDATE_GRAPH
} from '../actions/GraphActions'

const initialState = {
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
        default: {
            return {
                ...state,
            }
        }
    }
}

export default GraphReducer
