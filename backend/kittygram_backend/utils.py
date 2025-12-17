import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def on_or_off(value: str) -> bool:
    """
    Use human variable for True or False.
    True, true, On, on, Yes, yes --> return True.
    Everything else --> return False.
    """
    return value in ['True', 'true', 'On', 'on', 'Yes', 'yes']


def db(name_db: str = 'default') -> dict:
    """Use need database from permissible."""
    # Поддерживаем оба варианта переменных окружения:
    # - POSTGRES_* (как в docker-compose)
    # - DB_* (как часто дают в учебных заданиях/CI)
    pg_name = os.getenv('POSTGRES_DB') or os.getenv('DB_NAME')
    pg_user = os.getenv('POSTGRES_USER') or os.getenv('DB_USER')
    pg_password = os.getenv('POSTGRES_PASSWORD') or os.getenv('DB_PASSWORD')
    pg_host = os.getenv('DB_HOST')
    pg_port = os.getenv('DB_PORT')

    data_base = {
        'postgresql': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': pg_name,
            'USER': pg_user,
            'PASSWORD': pg_password,
            'HOST': pg_host,
            'PORT': pg_port,
        },
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    try:
        return data_base[name_db]
    except KeyError:
        return data_base['default']  # Для тестов
