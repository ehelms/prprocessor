#!/bin/bash

# Sadly you can't do "*/15 * * * *" in Openshift, so this is a hack
# Runs every minute but only does work on */15

cmd="curl -X GET http://localhost/api/reviews/update/"
case `date +%M` in
00)
  `$cmd`
  ;;
15)
  `$cmd`
  ;;
30)
  `$cmd`
  ;;
45)
  `$cmd`
  ;;
*)
  true
  ;;
esac
