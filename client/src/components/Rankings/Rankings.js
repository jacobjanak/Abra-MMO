import React, { Component } from 'react';
import API from '../../API';
import './Rankings.css';

class Rankings extends Component {
    state = {
        page: 1,
        users: [],
    };

    componentDidMount() {
        API.getRankings(this.state.page)
            .then(res => {
                this.setState({ users: res.data })
            })
    }

    render() {
        const { users } = this.state;

        return (
            <div>
                <h2 id="rankings-header">
                    <img className="trophy" src="../trophy.svg" alt="trophy" />
                    Global Rankings
                    <img className="trophy" src="../trophy.svg" alt="trophy" />
                </h2>
                <div id="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th className="username">
                                Player
                            </th>
                            <th>Rating</th>
                            <th>Wins</th>
                            <th>Losses</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, i) => (
                            <tr key={user._id}>
                                <td>{i + 1}.</td>
                                <td className="username">
                                    <a href={"/profile/" + user.username}>
                                        {user.username}
                                    </a>
                                </td>
                                <td>{user.rating}</td>
                                <td>{user.wins}</td>
                                <td>{user.losses}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Rankings;
