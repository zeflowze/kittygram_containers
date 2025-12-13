# Backend часть сайта про котов.
---

__Для запуска проэкта используется Dockerfile.__
Команда для сборки образа:
> `docker build -t <name-image>.` Находясь в папке с Dockerfile

Команда для простого запуска образа:
> `docker run <name-image>`

В сборке образа участвуют python пакеты:
> * Django==3.2.3
> * djangorestframework==3.12.4
> * djoser==2.1.0
> * webcolors==1.11.1
> * psycopg2-binary==2.9.3
> * Pillow==9.0.0
> * pytest==6.2.4
> * pytest-django==4.4.0
> * pytest-pythonpath==0.7.3
> * PyYAML==6.0
> * gunicorn==20.1.0
--- 
> В проэкте используется **sqlite3**, если не указана другая база данных,
> из возможных, предусмотрено взаимодействие с **postgresql**.

