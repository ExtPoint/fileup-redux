# fileup-redux
Redux adapter to fileup-core

# Installation

1. Append fileup reducer to application reducers:

```js
import fileup from 'fileup-redux/lib/reducers/fileup';

export default combineReducers({
    fileup,
    //...
});
```

2. Decorate you React Component with fileup:

```js
import fileup from 'fileup-redux';

class MyFiles extends React.Component {

    render() {
        return (
            <div>
                {this.props.files.map(file => (
                    <div key={file.uid}>
                        {file.name}
                    </div>
                ))}
                <button onClick={() => this.props.uploader.browse()}>Browse</button>
            </div>
        );
    }

}

export default fileup({
    backendUrl: '/file/upload/',
})(MyFiles);
```

# HOC configuration

- `id` Unique identifier in redux store
- `backendUrl` Backend url to file upload
- `uploader` FileUp configuration
