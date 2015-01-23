mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'%1'}" -o %2prodecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'%1'}" -o %2retailerdecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'%1'}" -o %2contractvariantdetails.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'%1'}" -o %2contracts.data -u Etalesadmin -p sh871030
