import Redis from 'ioredis'

const client = new Redis(process.env.REDIS_URL_LOCAL)

client.on('SIGINT', () => {
    client.quit()
})

export default client