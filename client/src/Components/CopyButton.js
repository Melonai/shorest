import React, {useState} from 'react';
import copy from 'clipboard-copy';

function CopyButton(props) {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        await copy("https://sho.rest/" + props.hash);
        setCopied(true);
    };

    let content;
    if (copied) {
        content = <span>Link Copied!</span>;
    } else {
        content = <strong>Copy Link</strong>;
    }

    return (
        <span className="copy-text" onClick={handleClick}>{content}</span>
    )
}

export default CopyButton;