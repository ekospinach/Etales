echo Step 1 : Download dec database file from server 115.29.35.224, Seminar: %1  

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'%1'}" -o %2prodecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'%1'}" -o %2retailerdecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'%1'}" -o %2contractvariantdetails.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'%1'}" -o %2contracts.data -u Etalesadmin -p sh871030

pause

echo Step 2 : Clean old dec in local database, Seminar: %1  

mongo Etales --eval "printjson(db.prodecisions.remove({seminar:'%1'}))" 
mongo Etales --eval "printjson(db.retailerdecisions.remove({seminar:'%1'}))" 
mongo Etales --eval "printjson(db.contractvariantdetails.remove({seminar:'%1'}))" 
mongo Etales --eval "printjson(db.contracts.remove({seminar:'%1'}))" 

pause

echo Step 3 : Import dec into local database, Seminar: %1  

mongoimport -d Etales -c prodecisions %1prodecisions.data
mongoimport -d Etales -c retailerdecisions %1retailerdecisions.data
mongoimport -d Etales -c contractvariantdetails %1contractvariantdetails.data
mongoimport -d Etales -c contracts %1contracts.data

