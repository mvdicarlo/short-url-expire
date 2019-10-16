#!/bin/bash

docker build -t mvdicarlo/shortener . && docker tag mvdicarlo/shortener:latest mvdicarlo/shortener:staging
