import {
    GET_DEVICES,
    GET_DEVICE,
    ADD_DEVICE,
    UPDATE_DEVICE,
    DELETE_DEVICE,
    SET_CURRENT_DEVICE,
    CLEAR_CURRENT_DEVICE,
    DEVICES_ERROR
} from '../types';

const initialState = {
    devices: [],
    currentDevice: null,
    loading: true,
    error: null
};

const deviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DEVICES:
            return {
                ...state,
                devices: action.payload,
                loading: false
            };
        case GET_DEVICE:
            return {
                ...state,
                currentDevice: action.payload,
                loading: false
            };
        case ADD_DEVICE:
            return {
                ...state,
                devices: [...state.devices, action.payload],
                loading: false
            };
        case UPDATE_DEVICE:
            return {
                ...state,
                devices: state.devices.map(device =>
                    device.id === action.payload.id ? action.payload : device
                ),
                currentDevice: action.payload,
                loading: false
            };
        case DELETE_DEVICE:
            return {
                ...state,
                devices: state.devices.filter(device => device.id !== action.payload),
                loading: false
            };
        case SET_CURRENT_DEVICE:
            return {
                ...state,
                currentDevice: action.payload
            };
        case CLEAR_CURRENT_DEVICE:
            return {
                ...state,
                currentDevice: null
            };
        case DEVICES_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default deviceReducer;