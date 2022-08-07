const process = require('process');
const path = require('path');
const winston = require('winston');
const {format} = require('winston');
const { combine, printf, label, ms,  splat, prettyPrint} = format;
//const {splat } = require('triple-beam');
const myFormat = printf(({ level, message, label, timestamp, ms}) => {
   
    return `[${level.toUpperCase()}] | ${timestamp} | ${ms} | ${label} | ${typeof message==='object'?[...message]:message} `;
    //console.log(message)
  });
  
  
//const path2 = path.resolve(process.cwd())
//const path3 = path.join(process.cwd(), __filename)
const path3 = path.resolve(__filename)
const path4 = path3.split('/').splice(-2).join('/')
console.log(path3.split('/').splice(-2).join('/'))
  

const logger = winston.createLogger({

        level: 'info',
        format: combine(
        // colorize(),
        //winston.format.colorize({ all: true }),
        //winston.format.colorize(),
        label({ label: `${path4}` }),
        winston.format.json(), 
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        splat(),
        ms(),
        // prettyPrint(),     
        myFormat,

),
    
    //myFormat
  
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: '/mnt/c/Users/rober/Documents/pollyganggang/polly-winston/error.log', level: 'error' }),
    new winston.transports.File({ filename: '/mnt/c/Users/rober/Documents/pollyganggang/polly-winston/combined.log'}),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({     
    level: 'info',
    format: combine(
      // colorize(),
      //winston.format.colorize({ all: true }),
      //winston.format.colorize(),
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