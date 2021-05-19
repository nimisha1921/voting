import React from "react";
import { apiEndPoints } from './../services/dataService';

export default function CreateList(props) {

    const [data, setData] = React.useState({ title: '', description: '' });

    const addIntoList = () => {
        const _postData = {
            ...data,
            upVote: 0,
            downVote: 0
        }
        fetch((apiEndPoints.movie),{
            method: "POST",
            body: JSON.stringify(_postData),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(res => {
            if(res.success) {
                props.close(true);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const fieldChange = (id, event) => {
        data[id] = event.target.value;
        setData(data);
    }

    return <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1" role="dialog" id="#exampleModal">
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Add List</h5>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="form-group">
                            <label className="mb-1" htmlFor="title">Title:</label>
                            <input type="text" className="form-control" id="title"  onChange={(e) => fieldChange('title', e)} aria-describedby="titleHelp" placeholder="Enter suitable title" />
                            <small id="titleHelp" className="form-text text-muted">write any movie title thats comes in your mind.</small>
                        </div>
                        <div className="form-group">
                            <label className="mb-1" htmlFor="description">Description:</label>
                            <input type="text" className="form-control" id="description"  onChange={(e) => fieldChange('description', e)} placeholder="Define short description." />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => props.close(false)}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={addIntoList}>Add</button>
                </div>
            </div>
        </div>
    </div>
}