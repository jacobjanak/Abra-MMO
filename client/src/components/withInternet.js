import React, {Component} from 'react';
import NoInternet from './NoInternet';

function withInternet(InternetComponent, props) {
    return class InternetWrapped extends Component {
        render() {
            if (window.navigator.onLine || true) {
                return <InternetComponent {...props} />;
            } else {
                return <NoInternet />;
            }
        }
    };
}

export default withInternet;
