#!/usr/bin/env bash

set -eo pipefail

cp bin/hvwc /usr/sbin/
chmod +x /usr/sbin/hvwc
echo "alias kubectl=hvwc" >> /etc/profile


