# multistage docker build

# should be a absolute path
ARG build_dir=/build_application

# first stage which builds the application
FROM node:18

ARG build_dir
ENV DEPLOYMENT_URL="http://localhost:8080"

# make build dir
WORKDIR $build_dir

COPY . .
RUN npm install
RUN npm run build

# second stage which creates the container image to run the application
FROM node:16

RUN apt-get update && apt-get -y install cron

EXPOSE 8080

RUN useradd -r -s /bin/false apollon_standalone \
    && mkdir /opt/apollon_standalone \
    && touch /var/log/cron.log \
    && chmod 622 /var/log/cron.log

RUN service cron start
RUN chown -R apollon_standalone /opt/apollon_standalone

USER apollon_standalone
WORKDIR /opt/apollon_standalone

RUN mkdir diagrams

ARG build_dir

# copies build result from first stage
COPY --chown=apollon_standalone:apollon_standalone --from=0 $build_dir .

RUN crontab delete-stale-diagrams.cronjob.txt

WORKDIR /opt/apollon_standalone/build/server

CMD [ "node", "./src/main/server.js" ]
