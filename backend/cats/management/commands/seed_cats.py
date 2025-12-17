from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from cats.models import Cat


SEED = [
    {"name": "Барсик", "color": "#FF8C69", "birth_year": 2022},
    {"name": "Масяня", "color": "#7BC8A4", "birth_year": 2021},
    {"name": "Снежок", "color": "#FFB38A", "birth_year": 2020},
]


class Command(BaseCommand):
    help = "Create initial cats for the first user if none exist"

    def handle(self, *args, **options):
        if Cat.objects.exists():
            self.stdout.write("Cats already exist. Skipping.")
            return

        User = get_user_model()
        user = User.objects.first()

        if not user:
            self.stdout.write("No users found. Skipping seeding.")
            return

        for item in SEED:
            Cat.objects.create(owner=user, **item)

        self.stdout.write(f"Seeded {len(SEED)} cats.")
