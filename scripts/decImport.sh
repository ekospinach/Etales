#Import data from decisions data files into local database 
#$sh decImportauth ~/backup/

mongoimport -d Etales -c prodecisions ${1}prodecisions.data
mongoimport -d Etales -c retailerdecisions ${1}retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails ${1}contractvariantdetails.data
mongoimport -d Etales -c contracts ${1}contracts.data