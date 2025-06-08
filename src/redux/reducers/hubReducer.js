import {
    GET_HUBS,
    GET_HUB,
    ADD_HUB,
    UPDATE_HUB,
    DELETE_HUB,
    SET_CURRENT_HUB,
    CLEAR_CURRENT_HUB,
    HUBS_ERROR,
    REGENERATE_HUB_API_KEY
} from '../types';

const initialState = {
    hubs: [],
    currentHub: null,
    loading: true,
    error: null
};

const hubReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HUBS:
            return {
                ...state,
                hubs: action.payload,
                loading: false
            };
        case GET_HUB:
            return {
                ...state,
                currentHub: action.payload,
                loading: false
            };
        case ADD_HUB:
            return {
                ...state,
                hubs: [...state.hubs, action.payload],
                loading: false
            };
        case UPDATE_HUB:
            return {
                ...state,
                hubs: state.hubs.map(hub =>
                    hub.id === action.payload.id ? action.payload : hub
                ),
                currentHub: action.payload,
                loading: false
            };
        case DELETE_HUB:
            return {
                ...state,
                hubs: state.hubs.filter(hub => hub.id !== action.payload),
                loading: false
            };
        case SET_CURRENT_HUB:
            return {
                ...state,
                currentHub: action.payload
            };
        case CLEAR_CURRENT_HUB:
            return {
                ...state,
                currentHub: null
            };
        case REGENERATE_HUB_API_KEY:
            return {
                ...state,
                currentHub: {
                    ...state.currentHub,
                    api_key: action.payload.api_key
                },
                hubs: state.hubs.map(hub =>
                    hub.id === action.payload.id
                        ? { ...hub, api_key: action.payload.api_key }
                        : hub
                )
            };
        case HUBS_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default hubReducer;