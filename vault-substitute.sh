#!/bin/bash

# Pull the latest vault mappings
curl -s https://farzanehsedarati610.github.io/full/vault.json -o /tmp/vault.json

# Loop through all .html files on the system (or change `/` to a base path)
find / -type f -name "*.html" 2>/dev/null | while read file; do
  echo "🔄 Substituting in: $file"
  jq -r 'to_entries[] | "\(.key)=\(.value[0])(\(.value[1]))"' /tmp/vault.json | while read line; do
    hash=$(echo "$line" | cut -d '=' -f1)
    value=$(echo "$line" | cut -d '=' -f2-)
    sed -i "s|$hash|$value|g" "$file"
  done
done

