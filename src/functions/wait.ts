export function wait(duration: number = 5000) {
    return new Promise(resolve => setTimeout(resolve, duration))
}