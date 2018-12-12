import React, { Component } from 'react';

class Timer extends Component {
    constructor(props) {
        super()
        this.countdown = false;
        this.state = {
            unix: props.unix
        };
    }

    componentDidMount() {
        if (this.props.active) {
            this.startCountdown()
        }
    }

    componentWillReceiveProps(prevProps) {
        this.stopCountdown()
        this.setState({
            unix: prevProps.unix
        }, () => {
            if (prevProps.active) {
                this.startCountdown()
            }
        })
    }

    startCountdown = () => {
        const millisecondsLeft = 1000 - (new Date().getDate() % 1000);
        this.countdown = setTimeout(() => {
            this.setState({
                unix: this.state.unix - 1000
            }, this.startCountdown)
        }, millisecondsLeft)
    }

    stopCountdown = () => {
        clearTimeout(this.countdown)
    }

    unixToTime = unix => {
        if (unix <= 0) return '0:00';

        let minutes = Math.floor(unix / (1000 * 60)).toString();
        let seconds = Math.floor(unix / 1000 % 60).toString();

        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }

    render() { 
        const { unix } = this.state;

        return (
            <span>{this.unixToTime(unix)}</span>
        );
    }
}
 
export default Timer;