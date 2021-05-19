import './item.css';
import { apiEndPoints } from './../services/dataService';
import React from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

export default class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            requestSend: false,
            alreadyVoted: false,
        }
    }

    vote = (data, vote) => {
        if (!this.state.requestSend) {
            this.setState({
                requestSend: true
            }, () => {
                let _postData = {
                    user: Cookies.get('user'),
                    movieId: data._id
                };
                if (vote === 'up') {
                    _postData = {
                        ..._postData,
                        vote: 'up',
                        removeVote: this.props.removeVote,
                        upVote: data.upVote + 1,
                        downVote: data.downVote
                    }
                } else if (vote === 'down') {
                    _postData = {
                        ..._postData,
                        vote: 'down',
                        removeVote: this.props.removeVote,
                        upVote: data.upVote,
                        downVote: data.downVote + 1
                    }
                }

                fetch((apiEndPoints.movie + '/' + data._id), {
                    method: 'PUT',
                    mode: 'cors',
                    credentials: 'include',
                    body: JSON.stringify(_postData),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.success) {
                            if (vote === 'up') {
                                data.upVote += 1;
                                if (json.isAlreadyVote) {
                                    data.downVote += -1;
                                    if (this.props.removeVote) {
                                        data.upVote -= 1;
                                    }
                                }
                            } else {
                                data.downVote += 1;
                                if (json.isAlreadyVote) {
                                    data.upVote -= 1;
                                    if (this.props.removeVote) {
                                        data.downVote -= 1;
                                    }
                                }
                            }
                            this.setState({
                                data,
                                requestSend: false
                            })
                        } else {
                            toast.error("Ohh sorry!! Already voted.");
                            this.setState({
                                requestSend: false
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            requestSend: false
                        });
                    });
            })
        }
    }


    render() {
        let { data } = this.state;
        return (
            <div className="card mb-3 ex-card">
                <ToastContainer />
                <div className="d-flex align-items-center justify-content-between" style={{ height: '200px' }}>
                    <div className="rank p-3 fs-24">
                        Rank #{this.props.rank}
                    </div>
                    <div className="image p-3">
                        <img src="https://s3.ap-south-1.amazonaws.com/hoblist/movies/poster/1557298985919_Sholayjpg" style={{ width: '100', height: '180px' }} />
                    </div>
                    <div className="details p-3">
                        <p>Title: {data.title}</p>
                        <p>Description: {data.description}</p>
                        <p><i className="fa fa-thumbs-up text-success"></i> {data.upVote} <i className="fa fa-thumbs-down text-danger"></i> {data.downVote} </p>
                        <p>Total Vote: {data.upVote + data.downVote}</p>
                    </div>
                    <div className="voting">
                        <span className="upvote fs-48 cursor-pointer" onClick={() => this.vote(data, 'up')}>
                            <i className={`fa fa-thumbs-up text-success icon-3x`} aria-hidden="true"></i>
                        </span>
                        <span className="count fs-24"> {data.upVote - data.downVote} </span>
                        <span className="downvote fs-48 cursor-pointer" onClick={() => this.vote(data, 'down')}>
                            <i className={'fa fa-thumbs-down text-danger icon-3x'} aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

