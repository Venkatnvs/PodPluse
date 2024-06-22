import { SET_AUDIO_COOKIE } from '@/constants/CookiesConstants';
import { SET_AUDIO, AUDIO_FAIL } from '@/constants/actions/AudioConstants';
import Cookies from 'js-cookie';

export const setAudio = (audio) => ({
    type: SET_AUDIO,
    payload: audio,
});

export const audioFail = (error) => ({
    type: AUDIO_FAIL,
    payload: error,
});

export const setAudioAction = (audio) => async (dispatch) => {
    try {
        Cookies.set(SET_AUDIO_COOKIE, JSON.stringify(audio));
        dispatch(setAudio(audio));
    } catch (error) {
        dispatch(audioFail(error));
    }
};