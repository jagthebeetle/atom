#!/bin/sh

lib/closure-library/closure/bin/build/closurebuilder.py \
  --root=lib/closure-library/ \
  --root=src \
  --namespace="atom.main" \
  --output_mode=compiled \
  --compiler_jar=src/compiler.jar \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
  --compiler_flags="--externs=lib/d3-externs/d3_externs.js" \
  > src/compiled.js #pipe