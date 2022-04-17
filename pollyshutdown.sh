#! /bin/bash

errorlog=pollynode-error.log


x=`cat $errorlog | grep "PID" | tail --lines=1 | cut -d : -f 2`;

cd $POLLYWORLD

echo "SEVERE ERROR: POLLY SERVER IS DOWN!!!"

    kill -9 $x > pollyservHealthCheck.log
