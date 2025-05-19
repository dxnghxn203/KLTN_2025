# Dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

RUN apt-get update && \
    apt-get install -y \
        wkhtmltopdf \
        xfonts-75dpi \
        xfonts-base && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt

ENV ROOT /packages/tracking-api/

COPY ./ $ROOT

WORKDIR $ROOT

ENV MAX_BODY_SIZE=500

EXPOSE 80
