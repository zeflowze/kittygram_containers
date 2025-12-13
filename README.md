# Kittygram — контейнеризация и CI/CD

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

1. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env

2. Запустите контейнеры:
docker compose up --build

3. Проект будет доступен по адресу:
http://localhost:9000
