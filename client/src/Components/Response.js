import React, {useEffect, useState} from 'react';
import axios from "axios";
import Loader from "./Loader";
import CopyButton from "./CopyButton";

function Response(props){
    const CancelToken = axios.CancelToken;
    const [requestState, setRequestState] = useState({loading: true, cancel: CancelToken.source()});

    useEffect(() => {
        axios.post('/', {url: "https://" + props.url}, {cancelToken: requestState.cancel.token})
            .then((r) => {
                setRequestState({loading: false, hash: r.data.hash, cancel: requestState.cancel});
            }).catch((e) => {
                if (!axios.isCancel(e)) {
                    setRequestState({loading: false, error: true, cancel: requestState.cancel});
                }
            });

        return () => {
            requestState.cancel.cancel();
        };
    }, [props.url, requestState.cancel])

    let text;
    if (!requestState.loading) {
        if (!requestState.error) {
            if (props.url.length < 20) {
                text =
                    <span>The short link for <strong>{props.url}</strong> is<br/><strong>sho.rest/{requestState.hash}</strong></span>;
            } else {
                text =
                    <span>The short link for your URL is<br/><strong>sho.rest/{requestState.hash}</strong></span>;
            }
        } else {
            text = <span>There was an error.</span>
        }
    } else {
        text = <Loader/>
    }

    return (
        <div className={"response-container" + (requestState.error ? " disabled" : "")}>
            <div className={"title response-text" + (requestState.error ? " disabled" : "")}>{text}</div>
            {requestState.error || requestState.loading ? "" : <CopyButton hash={requestState.hash}/>}
        </div>
    )
}

export default Response;