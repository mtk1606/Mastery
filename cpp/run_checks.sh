#!/usr/bin/env bash
set -euo pipefail
cmake -S cpp -B cpp/build -DCMAKE_BUILD_TYPE=Debug
cmake --build cpp/build --parallel
ctest --test-dir cpp/build --output-on-failure
printf '\nReference C++20 lab suite passed. Build cpp/student-build with -DMASTERY_STUDENT=ON to test your TODO solutions.\n'