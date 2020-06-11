import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faTimes} from '@fortawesome/free-solid-svg-icons';

function Button(props) {
    return (
        <div className="button-container">
            <button type="submit" className={"button" + (props.valid ? "" : " disabled")} id="btn" onClick={props.submit}>
                <FontAwesomeIcon icon={props.valid ? faArrowRight : faTimes}/>
            </button>
        </div>
    )
}

export default Button;