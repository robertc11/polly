#! /bin/bash

#POLLYWORLD=/usr/local/booyahLab/polly-yang

#PATH=/usr/local/sbin:/iusr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/booyahLab/polly-yang:/snap/bin

PLOG=pollynode.log
PERRLOG=pollynode-error.log

errorlog=pollynode-error.log;

zero=0;

#b=`ps -ef | grep yarn | grep -v grep | wc -l`;
cd $POLLYWORLD
x=`cat $errorlog | grep "PID" | tail --lines=1 | cut -d : -f 2`;
echo "POLLY SERVER PROCESS ID: $x"

#if [[ $b -ne $zero ]];
b=`ps -ef | grep yarn | grep -v grep | wc -l`;
if [ $b -eq 1 ]
	then
	echo "POLLYWORLD IS ALIVE AND WELL :) 🐘 🦅 🐐 🌎 ";
	sleep 2 -s
else
	cd $POLLYWORLD
	#echo "made it to pollyworld"
	sleep 2 -s
      nohup /usr/local/booyahLab/polly-yang/pollystartup.sh
	echo "
	***********************************************************************
	The polly server has stopped communicating. Executing startup script 🚀 🚀 
	***********************************************************************
	" 
	sleep 2 -s
  # tail -f pollyServHealthCheck.log
	#echo "pollyworld is dead";
	sleep 2 -s
	#echo "pollyworld is immortal. The platform is booting."
fi

