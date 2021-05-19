import React from 'react';
import CreateMovie from './create';

export default function Header(props) {
    const [openModal, setOpenModal] = React.useState(false);
    const toggleModal = (reload = false) => {
        setOpenModal(!openModal);
        if(reload) {
            props.reload();
        }
    }
    return (
        <div className="d-flex align-items-center justify-content-between">
            <h4 className="m-0 w-75">List of {props.listName}:</h4>
            <input type="checkbox" checked={props.removeVote} onChange={() => props.setRemoveVote()}/> <span> Able to remove vote. <i className="fa fa-question-circle" style={{cursor: 'pointer'}} title="If unchecked, user won't able to remove vote once vote is casted, but one can change their mind to downvote if upvote and vice-versa. If checked then the user will able to remove its voting by clicking downvote if upvoted and vice-versa." aria-hidden="true"></i> </span>
            <button className="float-right btn btn-primary btn-rounded" onClick={() => toggleModal(false)}>Add List</button>
            { openModal && <CreateMovie close={(val) => toggleModal(val)}/>}
        </div>
    )
}