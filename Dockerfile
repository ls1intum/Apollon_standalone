# Multistage Docker build

# Define build directory as an absolute path
ARG build_dir=/build_application

# First stage: Builds the application
FROM node:24.11.0-bookworm-slim AS builder

ARG build_dir
ENV DEPLOYMENT_URL="http://localhost:8080"

# Set up the build directory
WORKDIR $build_dir

# Copy all project files into the build directory
COPY . .

# Install dependencies and build the application
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        build-essential \
        pkg-config \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg62-turbo-dev \
        libgif-dev \
        librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npm run build

# Second stage: Sets up the container to run the application
FROM node:24.11.0-bookworm-slim

ARG build_dir=/build_application

# Install cron for scheduling
RUN apt-get update \
    && apt-get install -y --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/*

# Expose the application's default port
EXPOSE 8080

# Create a user and set up necessary directories and permissions
RUN useradd -r -s /bin/false apollon_standalone \
    && mkdir /opt/apollon_standalone \
    && touch /var/log/cron.log \
    && chmod 622 /var/log/cron.log

# Adjust permissions after installing cron
RUN chown -R apollon_standalone /opt/apollon_standalone

# Switch to non-root user for security
USER apollon_standalone
WORKDIR /opt/apollon_standalone

# Create a directory for storing diagrams
RUN mkdir diagrams

# Copy build results from the first stage
COPY --chown=apollon_standalone:apollon_standalone --from=builder ${build_dir} .

# Add cron job for deleting stale diagrams
RUN crontab delete-stale-diagrams.cronjob.txt

# Set the working directory for the server
WORKDIR /opt/apollon_standalone/build/server

# Start the application
CMD [ "node", "bundle.cjs" ]
