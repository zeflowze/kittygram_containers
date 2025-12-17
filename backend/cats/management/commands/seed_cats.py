from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from cats.models import Cat

SEED = [
    {"name": "Барсик", "color": "#FF8C69", "birth_year": 2022},
    {"name": "Масяня", "color": "#7BC8A4", "birth_year": 2021},
    {"name": "Снежок", "color": "#FFB38A", "birth_year": 2020},
]

class Command(BaseCommand):
    help = "Create initial cats if none exist (with owner)"

    def handle(self, *args, **options):
        if Cat.objects.exists():
            self.stdout.write("Cats already exist. Skipping.")
            return

        User = get_user_model()
        owner, created = User.objects.get_or_create(username="testuser")
        if created:
            owner.set_password("testpassword123")
            owner.save()

        Token.objects.get_or_create(user=owner)

        for item in SEED:
            Cat.objects.create(owner=owner, **item)

        self.stdout.write(f"Seeded {len(SEED)} cats for owner={owner.username}.")

