import {
    GET_SPACES,
    GET_SPACE,
    ADD_SPACE,
    UPDATE_SPACE,
    DELETE_SPACE,
    SET_CURRENT_SPACE,
    CLEAR_CURRENT_SPACE,
    SPACES_ERROR
} from '../types';

const initialState = {
    spaces: [],
    currentSpace: null,
    loading: true,
    error: null
};

const spaceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPACES:
            return {
                ...state,
                spaces: action.payload,
                loading: false
            };
        case GET_SPACE:
            return {
                ...state,
                currentSpace: action.payload,
                loading: false
            };
        case ADD_SPACE:
            return {
                ...state,
                spaces: [...state.spaces, action.payload],
                loading: false
            };
        case UPDATE_SPACE:
            return {
                ...state,
                spaces: state.spaces.map(space =>
                    space.id === action.payload.id ? action.payload : space
                ),
                currentSpace: action.payload,
                loading: false
            };
        case DELETE_SPACE:
            return {
                ...state,
                spaces: state.spaces.filter(space => space.id !== action.payload),
                loading: false
            };
        case SET_CURRENT_SPACE:
            return {
                ...state,
                currentSpace: action.payload
            };
        case CLEAR_CURRENT_SPACE:
            return {
                ...state,
                currentSpace: null
            };
        case SPACES_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

export default spaceReducer;