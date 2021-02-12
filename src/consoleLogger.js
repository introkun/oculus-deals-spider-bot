class ConsoleLogger {
    static log(message) {
        console.log(`${(new Date).toISOString()}: ${message}`)
    }
}

export default ConsoleLogger