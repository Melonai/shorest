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

    const handleChange = e => {
        const userInput = e.target.value;
        const valid = isURL('https://' + userInput);
        setState({value: userInput, valid: valid});
    };

    const handlePaste = e => {
        e.preventDefault();
        const pattern = /^https?:\/\//;
        setState({value: e.clipboardData.getData('Text').replace(pattern, ''), valid: false});
    };

    return (
        <form id="form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
                <div className="input-container">
                    <span className="input-field-text">https://</span>
                    <input className="input-field" required value={state.value} onChange={handleChange} onPaste={handlePaste}/>
                </div>
                <Button valid={state.valid} submit={handleSubmit}/>
            </div>
        </form>
    )
}

export default Form;