import React from 'react';

function Button(props) {
    return (
        <div className="button-container">
            <input type="submit" value={props.valid ? "→" : ""} className="button" id="btn" onClick={props.submit}/>
        </div>
    )
}

export default Button;