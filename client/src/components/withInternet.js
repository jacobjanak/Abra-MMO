import React, {Component} from 'react';
import NoInternet from './NoInternet';

function withInternet(InternetComponent, props) {
    return class InternetWrapped extends Component {
        // UNSAFE_componentWillMount() {
        //     // TODO: should I use this instead? Or render?
        //     // I guess this question applies to withAuth as well
        // }

        render() {
            if (true) { // TODO: actually detect internet
                return <InternetComponent {...props} />;
            } else {
                return <NoInternet />;
            }
        }
    };
}

export default withInternet;
