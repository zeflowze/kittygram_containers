from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from cats.models import Cat

SEED_CATS = [
    {"name": "Барсик", "color": "#FF8C69", "birth_year": 2022},
    {"name": "Масяня", "color": "#7BC8A4", "birth_year": 2021},
    {"name": "Снежок", "color": "#FFB38A", "birth_year": 2020},
]


class Command(BaseCommand):
    help = "Seed initial cats (creates a technical user if needed)"

    def handle(self, *args, **options):
        if Cat.objects.exists():
            self.stdout.write("Cats already exist. Skipping seeding.")
            return

        User = get_user_model()

        owner = User.objects.order_by("id").first()
        if owner is None:
            owner = User.objects.create_user(
                username="seed_user",
                password="seed_password_123",
            )
            self.stdout.write("Created technical user: seed_user")

        for item in SEED_CATS:
            Cat.objects.create(owner=owner, **item)

        self.stdout.write(f"Seeded {len(SEED_CATS)} cats.")
