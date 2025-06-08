import {
    GET_INCIDENTS,
    GET_INCIDENT,
    UPDATE_INCIDENT,
    INCIDENTS_ERROR,
    CLEAR_INCIDENTS
} from '../types';

const initialState = {
    incidents: [],
    currentIncident: null,
    loading: false,
    error: null
};

const incidentReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INCIDENTS:
            return {
                ...state,
                incidents: action.payload,
                loading: false
            };
        case GET_INCIDENT:
            return {
                ...state,
                currentIncident: action.payload,
                loading: false
            };
        case UPDATE_INCIDENT:
            return {
                ...state,
                incidents: state.incidents.map(incident =>
                    incident.id === action.payload.id ? action.payload : incident
                ),
                currentIncident: action.payload,
                loading: false
            };
        case INCIDENTS_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case CLEAR_INCIDENTS:
            return {
                ...state,
                incidents: [],
                currentIncident: null,
                loading: false
            };
        default:
            return state;
    }
};

export default incidentReducer;