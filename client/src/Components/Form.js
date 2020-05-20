import React, {useState} from 'react';
import Button from './Button';
import isURL from "validator/lib/isURL";

function Form(props) {
    const [state, setState] = useState({value: '', valid: false});

    const handleSubmit = () => {
        if (state.valid) {
            props.addRequest(state.value);
        }
    };

    const handleChange = (e) => {
        const userInput = e.target.value;
        const valid = isURL('https://' + userInput);
        setState({value: userInput, valid: valid});
    };

    return (
        <form id="form" onSubmit={(e) => e.preventDefault()}>
            <div className={"input-group" + (state.valid ? "" : " disabled")}>
                <div className={"input-container" + (state.valid ? "" : " border-r-none")}>
                    <span className="input-field-text">https://</span>
                    <input className="input-field" required onChange={handleChange}/>
                </div>
                <Button valid={state.valid} submit={handleSubmit}/>
            </div>
        </form>
    )
}

export default Form;