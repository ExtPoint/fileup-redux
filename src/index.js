import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FileUp from 'fileup-core';
import File from 'fileup-core/lib/models/File';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';

import {add, update, remove} from './actions';
import {getFiles} from './reducers/fileup';
import FilePropType from './types/FilePropType';

let idCounter = 0;

export default (config = {}) => {
    return WrappedComponent => {
        config = {
            ...config,
            id: config.id || `uploader${idCounter++}`,
            uploader: config.uploader || {},
            backendUrl: config.backendUrl || '',
        };

        class FileUpHOC extends React.Component {

            static propTypes = {
                backendUrl: PropTypes.string,
                multiple: PropTypes.bool,
                files: PropTypes.arrayOf(FilePropType),
                initialFiles: PropTypes.arrayOf(PropTypes.object),
                uploader: PropTypes.object,
                dispatch: PropTypes.func,
            };

            static defaultProps = {
                initialFiles: [],
            };

            constructor() {
                super(...arguments);

                this._onAdd = this._onAdd.bind(this);
                this._onUpdate = this._onUpdate.bind(this);
                this._onRemove = this._onRemove.bind(this);
                this._onUserRemove = this._onUserRemove.bind(this);

                this._uploader = new FileUp({
                    dropArea: {},
                    backendUrl: this.props.backendUrl || config.backendUrl,
                    form: {
                        multiple: !!this.props.multiple,
                    },
                    ...config.uploader,
                    ...(this.props.uploader || {}),
                });

                // Add uploaded files
                if (this.props.initialFiles.length > 0) {
                    const fileModels = this.props.initialFiles.map(item => (new File({
                        status: File.STATUS_END,
                        result: File.RESULT_SUCCESS,
                        resultHttpStatus: 200,
                        ...item,
                    })));

                    this._uploader.queue.add(fileModels);
                    fileModels.forEach(file => this.props.dispatch(add(config.id, file)));
                }
            }

            componentDidMount() {
                this._uploader.queue.on(QueueCollection.EVENT_ADD, this._onAdd);
                this._uploader.queue.on(QueueCollection.EVENT_ITEM_STATUS, this._onUpdate);
                this._uploader.queue.on(QueueCollection.EVENT_ITEM_PROGRESS, this._onUpdate);
                this._uploader.queue.on(QueueCollection.EVENT_REMOVE, this._onRemove);
            }

            componentWillUnmount() {
                this._uploader.queue.off(QueueCollection.EVENT_ADD, this._onAdd);
                this._uploader.queue.off(QueueCollection.EVENT_ITEM_STATUS, this._onUpdate);
                this._uploader.queue.off(QueueCollection.EVENT_ITEM_PROGRESS, this._onUpdate);
                this._uploader.queue.off(QueueCollection.EVENT_REMOVE, this._onRemove);
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        uploader={this._uploader}
                        remove={this._onUserRemove}
                    />
                );
            }

            _onAdd(files) {
                files.forEach(file => this.props.dispatch(add(config.id, file)));
            }

            _onUpdate(file) {
                this.props.dispatch(update(config.id, file));
            }

            _onRemove(files) {
                files.forEach(file => this.props.dispatch(remove(config.id, file)));
            }

            _onUserRemove(uids) {
                uids = [].concat(uids);

                const files = this._uploader.queue.getFiles().filter(file => {
                    if (uids.indexOf(file.getUid()) !== -1) {
                        return true;
                    }

                    const data = file.getResultHttpMessage();
                    return data && uids.indexOf(data.uid) !== -1;
                });
                if (files.length > 0) {
                    this._uploader.queue.remove(files);
                }
            }

        }

        FileUpHOC.WrappedComponent = WrappedComponent;

        return connect(
            state => ({
                files: getFiles(state, config.id),
            })
        )(FileUpHOC);
    };
};