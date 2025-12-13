FROM python:3.9.6-slim-buster

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt 

WORKDIR /home/project
COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "kittygram_backend.wsgi"]