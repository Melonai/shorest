interface ShortenResponse {
    hash: string;
}

export interface ShortenRequest {
    url: string;
    nonce: string;
    response: Promise<ShortenResponse>;
}

async function makeRequest(url: string): Promise<ShortenResponse> {
    let body;

    try {
        const response = await fetch("http://localhost:4000/", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify({ url }),
        });

        body = await response.json();
    } catch (err) {
        throw {
            error: "Error!",
        };
    }

    if (body.hash) {
        return {
            hash: body.hash,
        };
    } else {
        throw {
            message: body.error || "Error!",
        };
    }
}

export default function shorten(url: string): ShortenRequest {
    const nonce = Math.random().toString(36).substr(2, 5);

    return {
        url,
        nonce,
        response: makeRequest(url),
    };
}
