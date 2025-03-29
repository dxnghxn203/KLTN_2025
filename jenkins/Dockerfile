FROM jenkins/jenkins:lts-alpine

USER root

RUN apk add --no-cache \
    docker-cli \
    && rm -rf /tmp/* /var/cache/apk/*

USER jenkins

EXPOSE 8080
VOLUME /var/jenkins_home

ENV JENKINS_OPTS="--pluginroot=/var/jenkins_home/plugins"