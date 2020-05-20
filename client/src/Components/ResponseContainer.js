import React from 'react';
import Response from "./Response";

function ResponseContainer(props){
    const responseContent = props.requests.map((r) => <Response key={r.key} url={r.url}/>);

    return (
        responseContent
    )
}

export default ResponseContainer;