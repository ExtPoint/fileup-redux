import {FILEUP_ADD, FILEUP_UPDATE, FILEUP_REMOVE} from '../actions';

const initialState = {
    files: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FILEUP_ADD:
        case FILEUP_UPDATE:
            return {
                ...state,
                files: {
                    ...state.files,
                    [action.uploaderId]: {
                        ...(state.files[action.uploaderId] || {}),
                        [action.uid]: action.data,
                    }
                }
            };

        case FILEUP_REMOVE:
            if (state.files[action.uploaderId] && state.files[action.uploaderId][action.uid]) {
                const files = state.files[action.uploaderId];
                delete files[action.uid];

                return {
                    ...state,
                    files: {
                        ...state.files,
                        [action.uploaderId]: files
                    }
                };
            }
            return state;

        default:
            return state;
    }
};

export const getFiles = (state, uploaderId) => {
    const files = state.fileup && state.fileup.files[uploaderId] || {};
    return Object.keys(files).map(key => files[key]);
};