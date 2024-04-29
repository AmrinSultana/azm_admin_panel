#!/usr/bin/env bash

firebase use default
npm start > azm_admin_container.log 2>&1 &
ping google.com


