import React, {Component} from 'react';
import autoscroll from 'autoscroll-react';

class MoveList extends Component {
    formatMove = move => {
        const xy = move.split(',');
        let formatted = '(';

        for (let i = 0; i < xy.length; i++) {
            if (xy[i].length === 1) {
                formatted += ' ' + xy[i] + ' ';
            } else if (xy[i].length === 2) {
                formatted += ' ' + xy[i];
            } else if (xy[i].length >= 3) {
                formatted += xy[i];
            }
            if (i === 0) formatted += ',';
            else formatted += ')';
        }

        return formatted;
    }

    render() {
        const {moves} = this.props;

        const moveListContent = [];
        for (let i = 0; i < moves.length; i += 2) {
            moveListContent.push(() => (
                <div className="move-row">
                    <span className="move-number">{Math.floor(i / 2) + 1}.</span>
                    <span className="move">{this.formatMove(moves[i])}</span>
                    <span className="move">
                        {
                            moves[i + 1]
                                ? this.formatMove(moves[i + 1])
                                : (<span style={{color: 'transparent'}}>
                              {this.formatMove('0,0')}
                            </span>)
                        }
                    </span>
                </div>
            ))
        }

        return (
            <div id="move-list-container" {...this.props}>
                <div id="move-list">
                    {moveListContent.map((Move, i) => (
                        <Move key={i}/>
                    ))}
                </div>
            </div>
        );
    }
}

export default autoscroll(MoveList, {isScrolledDownThreshold: 5});
