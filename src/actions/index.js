export const FILEUP_ADD = 'FILEUP_ADD';
export const FILEUP_UPDATE = 'FILEUP_UPDATE';
export const FILEUP_REMOVE = 'FILEUP_REMOVE';

export const add = (uploaderId, file) => ({
    type: FILEUP_ADD,
    uploaderId,
    uid: file.getUid(),
    data: file.toJSON(),
});

export const update = (uploaderId, file) => ({
    type: FILEUP_UPDATE,
    uploaderId,
    uid: file.getUid(),
    data: file.toJSON(),
});

export const remove = (uploaderId, file) => ({
    type: FILEUP_REMOVE,
    uploaderId,
    uid: file.getUid(),
});