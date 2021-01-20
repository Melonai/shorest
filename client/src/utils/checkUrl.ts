import addProtocol from "./addProtocol";

export default function (url: string): string | null {
    try {
        const normalizedUrl = new URL(addProtocol(url));
        return normalizedUrl.toString();
    } catch (e) {
        return null;
    }
}