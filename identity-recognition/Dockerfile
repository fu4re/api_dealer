FROM python:3.7.15-slim-buster

RUN apt-get update && apt-get install -y \
    git \
    build-essential cmake \
    libopenblas-dev liblapack-dev \
    libx11-dev libgtk-3-dev \
    cmake \
    python3 python3-dev python3-pip \
    python3-matplotlib python3-numpy python3-pil python3-scipy \
    tesseract-ocr \
    tesseract-ocr-all \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app


COPY requirements.txt ./
RUN pip3 install -r requirements.txt
RUN pip3 install pika

# RUN apk add -u --no-cache ffmpeg
# optioanlly export ffmpeg binaries to env (e.g. for fluent-ffmpeg module)
# ENV FFMPEG_PATH='/usr/bin/ffmpeg' \
    # FFPROBE_PATH='/usr/bin/ffprobe'

COPY . .

CMD ["python3", "passport_eye.py", "--help"]