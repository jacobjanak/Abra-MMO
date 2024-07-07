import React, {Component} from 'react';
import './Loading.css';

class Loading extends Component {
    render() {
        const style = {};

        if (this.props.fullPage)
            style.paddingTop = '80px';

        return (
            <div id="loading-container" style={style}>
                <img id="loading-spinner" src="../loading.gif" alt="Loading" />
            </div>
        );
    }
}

export default Loading;
