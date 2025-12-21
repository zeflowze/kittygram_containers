#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# seed only if empty
python manage.py shell -c "from cats.models import Cat; import sys; sys.exit(0 if Cat.objects.exists() else 1)" \
  && echo "Cats already exist, skip seeding." \
  || python manage.py seed_cats

exec "$@"
