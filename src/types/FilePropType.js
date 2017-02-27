import {PropTypes} from 'react';

export default PropTypes.shape({
    path: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
    bytesUploaded: PropTypes.number,
    bytesUploadEnd: PropTypes.number,
    bytesTotal: PropTypes.number,
    result: PropTypes.string,
    resultHttpStatus: PropTypes.number,
    resultHttpMessage: PropTypes.any,
    progress: PropTypes.shape({
        percent: PropTypes.number,
        timeLeft: PropTypes.number,
        speed: PropTypes.number,
        history: PropTypes.arrayOf(PropTypes.shape({
            bytes: PropTypes.number,
            duration: PropTypes.number,
        })),
    }),
});