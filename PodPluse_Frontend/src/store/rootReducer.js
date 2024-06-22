import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import audioReducer from './reducers/audioReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    audio: audioReducer,
});

export default rootReducer;
