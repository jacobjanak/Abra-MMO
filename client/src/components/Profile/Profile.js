import React, { Component } from 'react';
import Loading from '../Loading';
import API from '../../API';
import utils from '../../utils';
import withInternet from '../withInternet';
import './Profile.css';

class Profile extends Component {
    state = {
        isInitialized: false,
        username: null,
        rating: null,
        wins: null,
        losses: null,
    };

    componentDidMount() {
        const username = window.location.pathname.split('/')[2];

        API.getUser(username)
            .then(res => {
                const user = res.data;
                this.setState({ ...user })
            })
            .catch(() => { /* user not found */ })
            .finally(() => {
                this.setState({ isInitialized: true })
            })
    }

    render() {
        const { isInitialized, username, wins, losses, rating, createdAt } = this.state;

        if (!isInitialized)
            return <Loading></Loading>;

        if (!username) {
            return (
                <div>
                    <h1>User not found</h1>
                </div>
            );
        }

        return (
            <div className="profile-container">
                <div className="profile-card">
                    <section>
                        <h2 className="username">{username}</h2>
                    </section>
                    <section className="rating-container">
                        <img className="trophy" src="../trophy.svg" alt="trophy" />
                        <h4>{rating}</h4>
                        <img className="trophy" src="../trophy.svg" alt="trophy" />
                    </section>
                    <section>
                        Joined {utils.getMonthAndYear(createdAt)}
                    </section>
                    <section>
                        {wins} W - {losses} L
                    </section>
                </div>
            </div>
        )
    }
}

export default withInternet(Profile);
