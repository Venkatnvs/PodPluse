import { SET_AUDIO_COOKIE } from '@/constants/CookiesConstants';
import { SET_AUDIO, AUDIO_FAIL, SET_AUDIO_TIME, CLEAR_AUDIO, SET_AUDIO_IS_PAUSED, SET_AUDIO_IS_MUTED } from '@/constants/actions/AudioConstants';
import Cookies from 'js-cookie';

export const setAudio = (audio) => ({
    type: SET_AUDIO,
    payload: audio,
});

export const audioFail = (error) => ({
    type: AUDIO_FAIL,
    payload: error,
});

export const setAudioTime = (time) => ({
    type: SET_AUDIO_TIME,
    payload: time,
});

export const clearAudio = () => ({
    type: CLEAR_AUDIO,
});

export const setAudioIsPaused = (isPaused) => ({
    type: SET_AUDIO_IS_PAUSED,
    payload: isPaused,
});

export const setAudioIsMuted = (isMuted) => ({
    type: SET_AUDIO_IS_MUTED,
    payload: isMuted,
});

export const setAudioAction = (audio) => async (dispatch) => {
    try {
        Cookies.set(SET_AUDIO_COOKIE, JSON.stringify(audio));
        dispatch(setAudio(audio));
    } catch (error) {
        dispatch(audioFail(error));
    }
};