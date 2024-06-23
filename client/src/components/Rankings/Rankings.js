import React, { Component } from 'react';
import API from '../../API';
import withInternet from '../withInternet';
import './Rankings.css';

class Rankings extends Component {
    state = {
        page: 1,
        users: [],
        searchValue: '',
    };

    componentDidMount() {
        API.getRankings(this.state.page)
            .then(res => {
                this.setState({ users: res.data })
            })
            .catch(err => console.error(err))
    }

    searchChange = event => {
        this.setState({ searchValue: event.target.value })
    };

    handleSearch = () => {
        window.location.href = '/profile/' + this.state.searchValue;
    };

    render() {
        const { users } = this.state;

        return (
            <div>
                <h4 id="search-header">User Search</h4>
                <div id="search-container" className="input-group">
                    <input type="text" className="form-control" onChange={this.searchChange} />
                    <button className="btn btn-primary" type="button" onClick={this.handleSearch}>
                        Search
                    </button>
                </div>

                { !!users.length && (
                    <div>
                        <h4 id="rankings-header">
                            <img className="trophy" src="../trophy.svg" alt="trophy" />
                            Leaderboard
                            <img className="trophy" src="../trophy.svg" alt="trophy" />
                        </h4>
                        <div id="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="username">
                                        Player
                                    </th>
                                    <th>Rating</th>
                                    <th>Won</th>
                                    <th>Lost</th>
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
                )}
            </div>
        );
    }
}

export default withInternet(Rankings);
