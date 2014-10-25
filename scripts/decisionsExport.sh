#!/bin/sh

cd ~/eTalesDecBackup
cd EJT3

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'ETALES01'}" -o ./prodecisions.data
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'ETALES01'}" -o ./retailerdecisions.data
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'ETALES01'}" -o ./contractvariantdetails.data
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'ETALES01'}" -o ./contracts.data


db.prodecisions.remove({seminar:'ETALES01'})
db.retailerdecisions.remove({seminar:'ETALES01'})
db.contractvariantdetails.remove({seminar:'ETALES01'})
db.contracts.remove({seminar:'ETALES01'})

mongoimport -d Etales -c prodecisions ./prodecisions.data
mongoimport -d Etales -c retailerdecisions ./retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails ./contractvariantdetails.data
mongoimport -d Etales -c contracts ./contracts.data

#备份数据库/恢复数据库
mongodump -h dbhost -d dbname -o dbdirectory
mongorestore -h dbhost -d dbname --directoryperdb dbdirectory 