import {
    SET_LOADING,
    CLEAR_LOADING,
    SET_ALERT,
    CLEAR_ALERT
} from '../types';

const initialState = {
    loading: false,
    alert: null
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case CLEAR_LOADING:
            return {
                ...state,
                loading: false
            };
        case SET_ALERT:
            return {
                ...state,
                alert: action.payload
            };
        case CLEAR_ALERT:
            return {
                ...state,
                alert: null
            };
        default:
            return state;
    }
};

export default uiReducer;