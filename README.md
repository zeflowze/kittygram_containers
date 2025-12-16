# Kittygram — контейнеризация и CI/CD

[![Kittygram CI/CD](https://github.com/zeflowze/kittygram_containers/actions/workflows/main.yml/badge.svg)](
https://github.com/zeflowze/kittygram_containers/actions/workflows/main.yml
)

Проект Kittygram развёрнут в Docker-контейнерах и автоматически
тестируется и деплоится на удалённый сервер с помощью GitHub Actions.

В проекте реализованы:
- контейнеризация backend, frontend, gateway и базы данных;
- автоматическое тестирование бэкенда и фронтенда;
- сборка и публикация Docker-образов в Docker Hub;
- автоматический деплой на сервер при push в ветку `main`.

---

## Стек технологий

- Backend: Django, Django REST Framework
- Frontend: React
- Gateway: Nginx
- Database: PostgreSQL 13
- CI/CD: GitHub Actions
- Контейнеризация: Docker, Docker Compose

---

## Архитектура контейнеров

| Контейнер | Образ | Назначение |
|---------|------|------------|
| db | postgres:13 | База данных |
| backend | kittygram_backend | API и бизнес-логика |
| frontend | kittygram_frontend | Сборка фронтенда |
| gateway | kittygram_gateway | Nginx, прокси и раздача статики |

### Docker volumes
- `pg_data` — данные PostgreSQL  
- `static` — статические файлы backend и frontend  
- `media` — пользовательские загружаемые файлы  

---

## Локальный запуск проекта

Перед запуском необходимо создать файл .env в корне проекта

Создание файла .env
cp .env.example .env

Пример содержимого .env

SECRET_KEY=django-insecure-change-me
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,kittygram.<SERVER_IP>.sslip.io

POSTGRES_DB=kittygram
POSTGRES_USER=kittygram
POSTGRES_PASSWORD=kittygram_pass
DB_HOST=db
DB_PORT=5432

Запуск проекта в контейнерах

docker compose -f docker-compose.production.yml up -d

После запуска будут подняты все сервисы:
- база данных;
- backend;
- frontend (сборка);
- gateway (Nginx).

Применение миграций и сбор статики

docker compose -f docker-compose.production.yml exec backend python manage.py migrate
docker compose -f docker-compose.production.yml exec backend python manage.py collectstatic --noinput

1. Подготовка сервера 

Подключиться к серверу:

ssh -i path/to/ssh_key ubuntu@<SERVER_IP>


Обновить пакеты и установить Docker:

sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker


Добавить пользователя в группу Docker:

sudo usermod -aG docker ubuntu
exit

2. Установка и настройка Nginx

Установить Nginx:

sudo apt install nginx -y
sudo systemctl start nginx


Разрешить трафик:

sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable


Создать конфигурацию Kittygram:

sudo nano /etc/nginx/sites-available/kittygram


Пример конфигурации:

server {
    server_name kittygram.<SERVER_IP>.sslip.io;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}


Активировать конфиг:

sudo ln -s /etc/nginx/sites-available/kittygram /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

3. Получение SSL-сертификата
   
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx


После этого проект доступен по HTTPS.

### Автор проекта
[lvndscvrs](https://github.com/lvndscvrs)  
2025 | Учебный проект по контейнеризации
