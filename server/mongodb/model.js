const Movie = require('./schema/movie')
const User = require('./schema/user')

createMovie = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a movie',
        })
    }

    const movie = new Movie(body)

    if (!movie) {
        return res.status(400).json({ success: false, error: err })
    }

    movie
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: movie._id,
                message: 'Movie created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Movie not created!',
            })
        })
}

updateMovie = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const movie = new Movie(body);

    if (!movie) {
        return res.status(400).json({ success: false, error: err })
    }

    const user = new User(body);
    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ user: body.user, movieId: body.movieId }, async (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }

        let userObj = user;
        let shouldUpdate = 0;
        let isUpVote = 0;
        let isAlreadyVote = 0;
        let userDelete = 0;
        if (body.vote == 'up') {
            isUpVote = 1;
        }
        let userVoteObj = { upVote: isUpVote, downVote: !isUpVote };

        if (!user) {
            userObj = new User(body);
            shouldUpdate = 1;
        } else {
            //if user present means already voted
            //Now check is user click same vote
            if (user.upVote == 1 || user.downVote == 1) {
                //check one reverse the vote
                if ((user.upVote == 1 && !isUpVote) || (user.downVote == 1 && isUpVote)) {
                    shouldUpdate = 1;
                    isAlreadyVote = 1;

                    //decrease the other count, if vote is reversed
                    //should vote remove in reverse first
                    if (body.removeVote) {
                        //Delete user
                        await User.deleteOne((err, user) => {
                            if (err) {
                                return res.status(404).json({
                                    err,
                                    message: 'Unable to delete user!',
                                })
                            }
                            userDelete = 1;
                        });
                        //downvote tha, ab upvote kiya, it means no upvote
                        body.downVote += -1;
                        body.upVote += -1;

                    } else {
                        if (isUpVote) {
                            body.downVote += -1;
                        } else {
                            body.upVote += -1;
                        }
                    }
                }
            } else if (user.upVote == 0 && user.downVote == 0) {
                //if we do not delete the user and put upVote = 0 and downVote = 0
                //then its comes here
                shouldUpdate = 1;
                isAlreadyVote = 0;
            }
        }

        if (shouldUpdate) {
            userObj = Object.assign(userObj, userVoteObj);

            Movie.findOne({ _id: req.params.id }, async (err, movie) => {
                if (err) {
                    return res.status(404).json({
                        err,
                        message: 'Movie not found!',
                    })
                }

                let userSave = 1, userErr;

                if (!userDelete) {

                    await userObj
                        .save()
                        .then(() => {
                            userSave = 1;
                        }).catch(error => {
                            userSave = 0;
                            userErr = error;
                        })
                }

                if(userSave) {

                    movie = Object.assign(movie, body);
                    movie
                        .save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                isAlreadyVote: isAlreadyVote,
                                id: movie._id,
                                message: 'Movie updated!',
                            })
                        })
                        .catch(error => {
                            return res.status(500).json({
                                error,
                                message: 'Movie not updated!',
                            })
                        })
                } else {
                    return res.status(500).json({
                        userErr,
                        message: 'User not updated!',
                    })
                }
            });

        } else {
            return res.status(200).json({
                success: false,
                id: movie._id,
                message: 'Movie not updated!',
            })
        }
    })
}

deleteMovie = async (req, res) => {
    await Movie.findOneAndDelete({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }

        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovieById = async (req, res) => {
    await Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!movie) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovies = async (req, res) => {
    await Movie.find({}, (err, movies) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!movies.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: movies })
    }).catch(err => console.log(err))
}

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovies,
    getMovieById,
}