#!/bin/sh
#$sh decDownload SEMINARID ~/backup/

mongoexport -h 115.29.35.224 -d Etales -c prodecisions -q "{'seminar':'${1}'}" -o ${2}prodecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c retailerdecisions -q "{'seminar':'${1}'}" -o ${2}retailerdecisions.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contractvariantdetails -q "{'seminar':'${1}'}" -o ${2}contractvariantdetails.data -u Etalesadmin -p sh871030
mongoexport -h 115.29.35.224 -d Etales -c contracts -q "{'seminar':'${1}'}" -o ${2}contracts.data -u Etalesadmin -p sh871030
