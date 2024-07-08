import { SET_AUDIO_COOKIE } from '@/constants/CookiesConstants';
import { SET_AUDIO, AUDIO_FAIL, SET_AUDIO_TIME, CLEAR_AUDIO, SET_AUDIO_IS_PAUSED, SET_AUDIO_IS_MUTED } from '@/constants/actions/AudioConstants';
import Cookies from 'js-cookie';

const getStoredAudio = () => {
    const audio = Cookies.get(SET_AUDIO_COOKIE);
    return audio ? JSON.parse(audio) : null;
}

const initialState = {
    audio: getStoredAudio(),
    currentTime: 0,
    isPaused: false,
    isMuted: false,
    error: null,
};

const audioReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUDIO:
            return {
                ...state,
                audio: action.payload,
                error: null,
            };
        case SET_AUDIO_TIME:
            return {
                ...state,
                currentTime: action.payload,
            };
        case SET_AUDIO_IS_PAUSED:
            return {
                ...state,
                isPaused: action.payload,
            };
        case SET_AUDIO_IS_MUTED:
            return {
                ...state,
                isMuted: action.payload,
            };
        case AUDIO_FAIL:
            return {
                ...state,
                error: action.payload,
                audio: null,
            };
        case CLEAR_AUDIO:
            return {
                ...state,
                audio: null,
                currentTime: 0,
                isPaused: true,
                isMuted: false,
            };
        default:
            return state;
    }
}

export default audioReducer;