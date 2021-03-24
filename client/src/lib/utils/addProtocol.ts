export default function (url: string) {
    if (!/^https?:\/\//.test(url)) {
        url = "https://" + url;
    }
    return url;
}
