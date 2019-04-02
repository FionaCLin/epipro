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

if [[ $1  = 'list' ]];
then
  ls ./PHASE_1/API_SourceCode | grep -e '[tT]est'| sed 's/[tT]est_//' |  sed 's/.py//'
else

  if [[ $@ ]];
    test=$@
  then
    test=`ls ./PHASE_1/API_SourceCode | grep -e '[tT]est'| sed 's/.py//'`
    echo $test
  fi
  for i in $test;
    do
      echo "************ test $i ************"
      py.test ./PHASE_1/API_SourceCode/$i.py -p no:warnings
    done
fi
