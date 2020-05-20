import React, {useState} from 'react';
import './App.css';
import Title from './Components/Title';
import Form from './Components/Form';
import ResponseContainer from './Components/ResponseContainer';
import shortid from 'shortid';

function App() {
    const [requests, setRequests] = useState([]);

    const addRequest = (newRequest) => {
        const newRequests = [{url: newRequest, key: shortid.generate()}, ...requests];
        setRequests(newRequests.slice(0, 2));
    }

    return (
        <div>
            <Title/>
            <Form addRequest={addRequest}/>
            <ResponseContainer requests={requests}/>
        </div>
    );
}

export default App;
