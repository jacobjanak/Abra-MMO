import React, {Component} from 'react';

class Timer extends Component {
    constructor(props) {
        super(props)
        this.countdown = false;
        this.state = {
            timeLeftInternal: props.timeLeft,
        };
    }

    componentDidMount() {
        if (this.props.active) {
            this.startCountdown()
        }
    }

    componentWillUnmount() {
        this.stopCountdown()
    }

    UNSAFE_componentWillReceiveProps(prevProps) {
        this.stopCountdown()

        this.setState({
            timeLeftInternal: prevProps.timeLeft,
        }, () => {
            if (prevProps.active) {
                this.startCountdown()
            }
        })
    }

    startCountdown = () => {
        this.stopCountdown()

        // TODO: can't guarantee the interval is exactly 1 second
        this.countdown = window.setInterval(() => {
            const { timeLeftInternal } = this.state;

            this.setState({
                timeLeftInternal: timeLeftInternal - 1000,
            })
        }, 1000)
    }

    stopCountdown = () => {
        clearTimeout(this.countdown)
    }

    formatTime = timeLeft => {
        if (timeLeft <= 0) {
            return '0:00';
        }

        let minutes = Math.floor(timeLeft / (1000 * 60)).toString();
        let seconds = Math.floor(timeLeft / 1000 % 60).toString();

        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }

        return minutes + ':' + seconds;
    }

    render() {
        const { timeLeftInternal } = this.state;

        return (
            <span>{this.formatTime(timeLeftInternal)}</span>
        );
    }
}

export default Timer;
