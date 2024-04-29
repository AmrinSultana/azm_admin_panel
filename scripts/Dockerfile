FROM node:10.15-alpine

LABEL name="azm-admin-panel"
LABEL maintainer="info@gosorters.com"

WORKDIR /apps/azm_admin_panel

COPY package.json package-lock.json ./

RUN apk update && apk add bash
RUN npm update
RUN npm install
RUN npm install -g firebase-tools

COPY . ./

ENV DOCKER_CLIENT_TIMEOUT=120
ENV COMPOSE_HTTP_TIMEOUT=120

EXPOSE 9005

CMD ["/apps/azm_admin_panel/scripts/entrypoint.sh"]

# CMD ["npm start"]



