import { SET_AUDIO_COOKIE } from '@/constants/CookiesConstants';
import { SET_AUDIO, AUDIO_FAIL } from '@/constants/actions/AudioConstants';
import Cookies from 'js-cookie';

const getStoredAudio = () => {
    const audio = Cookies.get(SET_AUDIO_COOKIE);
    return audio ? JSON.parse(audio) : null;
}

const initialState = {
    audio: getStoredAudio(),
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
        case AUDIO_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default audioReducer;