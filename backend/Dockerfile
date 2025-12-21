FROM python:3.9.6-slim-buster

# Рабочая директория
WORKDIR /home/project

# Установка зависимостей
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Entrypoint для миграций и автосидирования
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Код проекта
COPY . .

# Entrypoint выполняет migrate + seed, затем передаёт управление CMD
ENTRYPOINT ["/entrypoint.sh"]

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "kittygram_backend.wsgi"]

