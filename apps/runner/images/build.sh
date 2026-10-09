#!/bin/sh
# Builds the language sandbox images used by the runner.
set -eu
cd "$(dirname "$0")"
PREFIX="${IMAGE_PREFIX:-beatcode-runner}"
for lang in cpp java python; do
  echo "Building ${PREFIX}-${lang}"
  docker build -t "${PREFIX}-${lang}" "${lang}"
done
