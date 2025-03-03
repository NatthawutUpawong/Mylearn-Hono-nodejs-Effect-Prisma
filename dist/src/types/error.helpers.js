export function createErrorFactory(Self) {
    return (msg) => (error) => new Self({ error, msg });
}
