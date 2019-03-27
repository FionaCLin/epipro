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
pwd
if [[ $@ ]];
then
  for i in $@;
  do
    echo "************ test $i ************"
    python3 ./PHASE_1/API_SourceCode/test_$i.py
  done
else
  echo "************ test main ************"
  python3 ./PHASE_1/API_SourceCode/test_main.py
  echo "************ test date ************"
  python3 ./PHASE_1/API_SourceCode/test_date.py
fi
