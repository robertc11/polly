#! /bin/bash

PLOG=pollynode.log
PERRLOG=pollynode-error.log

nohup yarn dev >> $PLOG 2>> $PERRLOG &
