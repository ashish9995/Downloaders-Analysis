#!/bin/bash

totalTime=0
n=100
for (( c=1; c<=$n; c++))
do
    start_time=$(date -u +%s.%N)
    curl -o /dev/null -L -s https://www.google.com/
    end_time=$(date -u +%s.%N)
    duration="$(bc <<<"$end_time-$start_time")"
    totalTime="$(bc <<<"$totalTime+$duration")"
done
curlAverage=$(echo "scale=10;$totalTime / $n" | bc)
echo "Curl Average: $curlAverage"

totalTime=0
for (( c=1; c<=$n; c++))
do
    start_time=$(date -u +%s.%N)
    wget -O/dev/null -q https://www.google.com/
    end_time=$(date -u +%s.%N)
    duration="$(bc <<<"$end_time-$start_time")"
    totalTime="$(bc <<<"$totalTime+$duration")"
done

wgetAverage=$(echo "scale=10;$totalTime / $n" | bc)
echo "Wget Average: $wgetAverage"

totalTime=0
for (( c=1; c<=$n; c++))
do
    start_time=$(date -u +%s.%N)
    aria2c --show-console-readout=false --download-result=hide https://www.google.com/ &>/dev/null
    end_time=$(date -u +%s.%N)
    duration="$(bc <<<"$end_time-$start_time")"
    totalTime="$(bc <<<"$totalTime+$duration")"
done

ariaAverage=$(echo "scale=10;$totalTime / $n" | bc)
echo "Aria2 Average: $ariaAverage"
