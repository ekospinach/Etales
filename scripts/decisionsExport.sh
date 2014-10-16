#!/bin/sh

cd ~/eTalesDecBackup
cd EJT3

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'EJT3'}" -o prodecisions.data
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'EJT3'}" -o retailerdecisions.data
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'EJT3'}" -o contractvariantdetails.data
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'EJT3'}" -o contracts.data


db.prodecisions.remove({seminar:'EJT3'})
db.retailerdecisions.remove({seminar:'EJT3'})
db.contractvariantdetails.remove({seminar:'EJT3'})
db.contracts.remove({seminar:'EJT3'})

mongoimport -d Etales -c prodecisions prodecisions.data
mongoimport -d Etales -c retailerdecisions retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails contractvariantdetails.data
mongoimport -d Etales -c contracts contracts.data

#备份数据库/恢复数据库
mongodump -h dbhost -d dbname -o dbdirectory
mongorestore -h dbhost -d dbname --directoryperdb dbdirectory 