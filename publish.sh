#!/usr/bin/env bash

npx standard-version --first-release --sign
git push --follow-tags origin master

PACKAGE_VER=$(cat manifest.json | grep '"version":' | cut -d '"' -f4)
if [[ -z "$PACKAGE_VER" ]]; then
  exit
fi
npx bestzip ../watchalone-$PACKAGE_VER.zip ./*