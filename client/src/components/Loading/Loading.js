import React, {Component} from 'react';
import './Loading.css';

class Loading extends Component {
    render() {
        return (
            <div id="loading-container">
                <img id="loading-spinner" src="../loading.gif" alt="Loading" />
            </div>
        );
    }
}

export default Loading;
