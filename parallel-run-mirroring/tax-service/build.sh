#!/bin/bash

docker build -t learncloudnative/tax-service:0.1.0 .
docker push learncloudnative/tax-service:0.1.0