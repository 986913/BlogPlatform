#!/bin/sh
cd /Users/mingyueliu/Documents/GitHub/BlogPlatform/logs
cp access.log $(date +%Y-%m-%d-%H).access.log
echo "" > access.log