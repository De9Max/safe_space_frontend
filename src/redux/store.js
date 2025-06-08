import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Редьюсери
import authReducer from './reducers/authReducer';
import spaceReducer from './reducers/spaceReducer';
import hubReducer from './reducers/hubReducer';
import deviceReducer from './reducers/deviceReducer';
import incidentReducer from './reducers/incidentReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    spaces: spaceReducer,
    hubs: hubReducer,
    devices: deviceReducer,
    incidents: incidentReducer,
    ui: uiReducer,
});

// Додавання middleware thunk для асинхронних дій
const middleware = [thunk];

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;