#!/bin/bash
echo "Testing modules endpoint..."
curl -s http://localhost:54321/functions/v1/modules | jq .

