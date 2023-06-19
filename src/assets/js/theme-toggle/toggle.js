export default function Toggle(options, startIndex) {
    const [first, second] = options;
    let current = options[startIndex];

    return {
        now: () => current,
        next: () => {
            const next = current === first ? second : first;
            current = next;
            return next;
        }
    }
};