type Procedure = (...args: any[]) => any;

export default function <F extends Procedure>(f: F, duration: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (...args: Parameters<F>) {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => f(...args), duration);
    };
}
