#!/bin/sh

cd ~/eTalesDecBackup
cd EJT3

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'EJT3'}" -o prodecisions.data
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'EJT3'}" -o retailerDecisions.data
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'EJT3'}" -o contractvariantdetails.data
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'EJT3'}" -o contracts.data
