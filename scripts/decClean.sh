#!/bin/sh

#Clean producer decisions with seminarID selected 
#$sh cleandec.sh SEMINARID

mongo Etales --eval "printjson(db.prodecisions.remove({seminar:'${1}'}))" 
mongo Etales --eval "printjson(db.retailerdecisions.remove({seminar:'${1}'}))" 
mongo Etales --eval "printjson(db.contractvariantdetails.remove({seminar:'${1}'}))" 
mongo Etales --eval "printjson(db.contracts.remove({seminar:'${1}'}))" 
