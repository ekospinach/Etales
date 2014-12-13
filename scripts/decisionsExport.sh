#!/bin/sh

cd ~/eTalesDecBackup
cd EJT3

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'ETALES02'}" -o ./prodecisions.data
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'ETALES02'}" -o ./retailerdecisions.data
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'ETALES02'}" -o ./contractvariantdetails.data
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'ETALES02'}" -o ./contracts.data


db.prodecisions.remove({seminar:'ETALES02'})
db.retailerdecisions.remove({seminar:'ETALES02'})
db.contractvariantdetails.remove({seminar:'ETALES02'})
db.contracts.remove({seminar:'ETALES02'})

mongoimport -d Etales -c prodecisions ./prodecisions.data
mongoimport -d Etales -c retailerdecisions ./retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails ./contractvariantdetails.data
mongoimport -d Etales -c contracts ./contracts.data

#备份数据库/恢复数据库
mongodump -h dbhost -d dbname -o dbdirectory
mongorestore -h dbhost -d dbname --directoryperdb dbdirectory 