const process = require('process');
const path = require('path');
const winston = require('winston');
const { format } = require('winston');
const { combine, printf, label, ms, splat, prettyPrint } = format;

const myFormat = printf(({ level, message, label, timestamp, ms }) => {
    return `[${level.toUpperCase()}] | ${timestamp} | ${ms} | ${label} | ${typeof message === 'object' ? [...message] : message} `;
});

const path3 = path.resolve(__filename)
const path4 = path3.split('/').splice(-2).join('/')

const logger = winston.createLogger({

    level: 'info',
    format: combine(
        label({ label: `${path4}` }),
        winston.format.json(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        splat(),
        ms(),
        myFormat,

    ),
    // Change the transport location to include the path of project installation
    transports: [
        new winston.transports.File({ filename: '/home/ubuntu/pollyworld/error.log', level: 'error' }),
        new winston.transports.File({ filename: '/home/ubuntu/pollyworld/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'info',
        format: combine(
            label({ label: `${path4}` }),
            winston.format.json(),
            winston.format.timestamp(),
            splat(),
            ms(),
            prettyPrint(),
            myFormat,
        )
    }));
}

export default logger;