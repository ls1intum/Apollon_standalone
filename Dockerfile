# multistage docker build

# should be a absolute path
ARG build_dir=/build_application

# first stage which builds the application
FROM node:14

ARG build_dir
ENV DEPLOYMENT_URL="http://localhost:3333"

# make build dir
WORKDIR $build_dir

COPY . .
RUN yarn install
RUN yarn build

# second stage which creates the container image to run the application
FROM node:14

RUN apt-get update && apt-get -y install cron

EXPOSE 3333

RUN useradd -r -s /bin/false apollon_standalone \
    && mkdir /var/apollon_standalone \
    && mkdir /var/apollon_standalone/diagrams \
    && touch /var/log/cron.log

COPY delete-stale-diagrams.cronjob.txt /etc/cron.d/delete-stale-diagrams

RUN chmod 0644 /etc/cron.d/delete-stale-diagrams
RUN crontab /etc/cron.d/delete-stale-diagrams


RUN chown apollon_standalone /var/apollon_standalone -R
RUN chmod 777 /var/apollon_standalone/diagrams

RUN service cron start

USER apollon_standalone
WORKDIR /var/apollon_standalone

ARG build_dir

# copies build result from first stage
COPY --chown=apollon_standalone:apollon_standalone --from=0 $build_dir .

WORKDIR /var/apollon_standalone/build/server

CMD [ "node", "./server.js" ]
