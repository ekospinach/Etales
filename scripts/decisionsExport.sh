#!/bin/sh

#download decision data from server  of seminar "ETALEAS02"
mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'ETALES03'}" -o ./prodecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'ETALES03'}" -o ./retailerdecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'ETALES03'}" -o ./contractvariantdetails.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'ETALES03'}" -o ./contracts.data -u Etalesadmin -p sh871030

#Clean decisions data in local database(Link to Interface) of seminar "ETALEAS02"
mongo 
use Etales
db.prodecisions.remove({seminar:'ETALES03'})
db.retailerdecisions.remove({seminar:'ETALES03'})
db.contractvariantdetails.remove({seminar:'ETALES03'})
db.contracts.remove({seminar:'ETALES03'})

#Import data from decisions data files into local database 
mongoimport -d Etales -c prodecisions ./prodecisions.data
mongoimport -d Etales -c retailerdecisions ./retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails ./contractvariantdetails.data
mongoimport -d Etales -c contracts ./contracts.data



#备份数据库/恢复数据库
mongodump -h dbhost -d dbname -o dbdirectory
mongorestore -h dbhost -d dbname --directoryperdb dbdirectory 


