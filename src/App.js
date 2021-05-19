
import React from 'react';
import Header from './components/header';
import Item from './components/item';
import { apiEndPoints } from './services/dataService';
import  Footer  from './components/footer';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [items, setItems] = React.useState([]);
  const [reload, setReload ] = React.useState(true);
  const [removeVote, setRemoveVote ] = React.useState(false);

  React.useEffect(() => {
    if(reload) {
        fetch(apiEndPoints.allMovies, {
            mode: 'cors',
            credentials: 'include',
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .then((res) => {
            if(res.success) {
                let data = res.data.sort(function(a,b) {
                    return (b.upVote - b.downVote) - (a.upVote - a.downVote)
                })
                setItems(data);
                setReload(false)
            }
        }).catch((err) => {
            console.log(err);
        })
    }
  },[reload])

  return (
    <div className="container">
        <ToastContainer/>
        <div className="card bg-light my-2 p-2 ">
            <Header
                listName={'Bollywood Movies'}
                removeVote={removeVote}
                reload={() => {
                    toast.success('Movie added successfully.!!!')
                    setReload(true)
                }}
                setRemoveVote={() => {
                    setRemoveVote(!removeVote)
                    setReload(true)
                }}
            />
            <div className="row m-0 mt-2 justify-content-center">
                <p>* The user can vote each individual movie either upvote or downvote.</p>
                { !removeVote && <p>* If above checkbox is unchecked, then user won't able to remove vote once vote is casted, but one can change their mind to downvote if upvote and vice-versa. </p>}
                { removeVote && <p>* If above checkbox is checked then the user will able to remove its vote if casted by clicking downvote if upvoted and vice-versa.</p> }
                { items.map((data, index) => {
                    return <Item key={data._id} rank={index + 1} data={data} removeVote={removeVote}/>
                })}
                <Footer/>
            </div>
        </div>


    </div>
  );
}

export default App;
