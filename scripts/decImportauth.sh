#Import data from decisions data files into local database 
#$sh decImportauth SEMINARID ~/backup/

mongoimport -d Etales -c prodecisions ${1}prodecisions.data -u Etalesadmin -p sh871030
mongoimport -d Etales -c retailerdecisions ${1}retailerdecisions.data -u Etalesadmin -p sh871030
mongoimport -d Etales -c contractvariantdetails ${1}contractvariantdetails.data -u Etalesadmin -p sh871030
mongoimport -d Etales -c contracts ${1}contracts.data -u Etalesadmin -p sh871030