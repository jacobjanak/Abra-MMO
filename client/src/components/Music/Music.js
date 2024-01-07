import React, {Component} from 'react';
import './Music.css';

class Music extends Component {

    audio = new Audio('./newmove.mp3');

    render() {

        // this.audio.play();
        // need to catch err or else site will crash on safari
        //.catch(err => {});

        return (
            <div>

            </div>
        );
    }
}

export default Music;
