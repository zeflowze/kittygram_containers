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
