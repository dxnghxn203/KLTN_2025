FROM golang:1.21.1-alpine

# Install tools required for project
# Run `docker build --no-cache .` to update dependencies
RUN echo "Installing system dependencies.." && \
    apk update && \
    apk add bash make && \
    echo "Cleanups.." && \
    rm -rf /var/cache/apk/*

ENV ROOT /packages/spx-hook

WORKDIR $ROOT

COPY go.mod go.sum  Makefile ./

RUN make install

EXPOSE 3000