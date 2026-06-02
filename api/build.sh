#!/usr/bin/env bash

set -o errexit  # stop script if any command fails

pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate