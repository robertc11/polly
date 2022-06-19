import Redis from 'ioredis'

const client = new Redis(process.env.REDIS_URL_LOCAL)

export default client