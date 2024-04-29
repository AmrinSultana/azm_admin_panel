FROM python:3.7.2-alpine

ENV PYTHONUNBUFFERED 1

RUN apk add --update --no-cache --virtual .ext-deps \
                                          git \
                                          bash

RUN apk add --no-cache --virtual .build-deps \
                build-base \
                curl-dev \
                libjpeg-turbo-dev \
                zlib-dev \
                tiff-dev \
                freetype-dev \
                lcms2-dev \
                libwebp-dev \
                openjpeg-dev \
                libpng-dev \
                # libraqm-dev
                libmemcached-dev && \
            apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing --virtual .build-deps \
                libimagequant-dev

RUN apk update && apk add --no-cache libpq \
                                      libffi-dev \
                                      build-base \
                                      tiff-dev \
                                      jpeg-dev \
                                      openjpeg-dev \
                                      zlib-dev \
                                      freetype-dev \
                                      lcms2-dev \
                                      libwebp-dev \
                                      tcl-dev \
                                      tk-dev \
                                      harfbuzz-dev \
                                      fribidi-dev \
                                      libxcb-dev \
                                      libpng-dev \
                                      openssl

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install --no-cache-dir  --force-reinstall -Iv grpcio==1.29.0
# RUN apk --update add tzdata rsync imagemagick=7.0.8.68-r0 ghostscript=9.27-r5 ghostscript-fonts=8.11-r1
RUN apk --update add tzdata rsync imagemagick=7.0.8.68-r0 ghostscript=9.26-r5 ghostscript-fonts=8.11-r1


WORKDIR /admin

COPY requirements.txt ./
RUN pip install -r requirements.txt

CMD ["tail", "-f", "/dev/null"]