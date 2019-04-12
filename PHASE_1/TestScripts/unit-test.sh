#! /bin/bash

################################
# usage: 
#   ./unit-test.sh <testfile>
# e.g.
#   ./unit-test.sh main
################################
# As the modules import is impossible to import the main 
# into the test folder for the test script run
# the work around solution is to make a bash script to trigger 
# the test in the API_SourceCode

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [[ $1  = 'list' ]];
then
  ls $DIR/../API_SourceCode | grep -e '[tT]est'| sed 's/[tT]est_//' |  sed 's/.py//'
else
  
  if [[ $# == 0 ]];
  then
    test=`ls $DIR/../API_SourceCode | grep -e '[tT]est'|  sed 's/[tT]est_//' | sed 's/.py//'`
  else
    test=$@
  fi
  echo $test
  for i in $test;
  do
    if [[ -f $DIR/../API_SourceCode/test_$i.py ]];
    then
      echo "************ test $i ************"
      py.test $DIR/../API_SourceCode/test_$i.py -p no:warnings
    else
      echo $DIR/../API_SourceCode/test_$i.py is not found
    fi
  done
fi
