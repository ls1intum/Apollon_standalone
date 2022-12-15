# Apollon Standalone

Standalone version of the [Apollon Editor](https://github.com/ls1intum/Apollon)

There are two variants how you can use this editor:
1. As web application which only runs in the users environment (modeling functionality).
2. With an application server which enables some extra features, like sharing of diagrams.

## Build the application

### Web application only

```
# clone the repository
git clone https://github.com/ls1intum/Apollon_standalone

# install the dependencies
yarn install

# set environment variable
export APPLICATION_SERVER_VERSION=0

# build the web application
yarn build:webapp

# the output can be found in build/webapp directory of the project root
```

#### Hosting

The application can be hosted by any http server which can serve static files, e.g. nginx or aws s3.
Simply point your URL to the index.html of the web application (build/webapp/index.html) and the single
page application will be loaded.

### Web application + application server

There are two variants to set this up:
1. Manual on a linux vm
2. In a docker container


#### Manual setup (Installation of application server on linux machine)
```
# clone the repository
git clone https://github.com/ls1intum/Apollon_standalone

# install the dependencies
yarn install

# set environment variable
export APPLICATION_SERVER_VERSION=1
export DEPLOYMENT_URL=https://apollon.ase.in.tum.de

# build the web application and the application server
yarn build

# the output can be found in build/webapp and build/server directory of the project root
```

Add a user for the application:

```
sudo useradd -r -s /bin/false apollon_standalone

# give ownage of files to application user
chown -R apollon_standalone path/to/application
```

Make a directory for the shared diagrams to be stored

```
# create directory where shared diagrams of users are stored
mkdir path/to/diagrams

# give ownage to application user
chown apollon_standalone path/to/diagrams
```

Add the path to the created directory to:
- the cronjob in delete-stale-diagrams.cronjob.txt
- in packages/server/src/main/constants.ts

#### Install as a service

Configure the apollon_standalone.service file so that the paths 
match the paths to your installation folder

```
# After adjusting the service file, copy the service file apollon_standalone.service 
# into the /etc/systemd/system directory service apollon_standalone start
cp apollon_standalone.service /etc/systemd/system/

# make sure the server.js file is executable by application user
cd path/to/application/build/server
chmod +x server.js

# Start the service 
sudo service apollon_standalone start

# Status of the service
service apollon_standalone status
```

Error codes on server start:
- (code=exited, status=217/USER) -> apollon_standalone user does not exist
- (code=exited, status=203/USER) -> script not executable

#### Install the cronjob for deleting stale diagrams

Install the cronjob for deleting stale files

```
# create a log file for the cron job
touch /var/log/cron.log
chmod 622 /var/log/cron.log

# adjust period after which stale diagrams should be deleted
# cronjob file: delete-stale-diagrams.cronjob.txt
# default: delete stale diagrams after 12 weeks

# installs cronjob with application user
crontab -u apollon_standalone delete-stale-diagrams.cronjob.txt
```

Remove cronjob

`crontab -r -u apollon_standalone`

### Docker Container

Caveat: cronjob to clean the diagrams after 12 weeks is currently not running in the container

```
# clone the repository
git clone https://github.com/ls1intum/Apollon_standalone

# build docker container
docker build -t apollon_standalone .

run docker container 
docker run -d --name apollon_standalone -p 8080:8080 apollon_standalone

# build the web application and the application server
yarn build

# the output can be found in build/webapp and build/server directory of the project root
```

useful command to debug:

```
# start bash in running docker container to look at internal files
docker run -it --entrypoint /bin/bash apollon_standalone
```

## Developer Setup

```
# installs dependencies
yarn install

# build application
yarn build

# start webpack dev server
yarn start

# accessible via localhost:8888 (webpack dev server with proxy to application server)
# accesible via localhost:8080 (application server with static files)
```
### Link local project of Apollon
While developing the Standalone project, it is often required to make changes in the Apollon project.
This can be achieved by executing the following workflow.

#### In the Apollon project (Generate a symlink)
```
# Clone the Apollon repository
git clone https://github.com/ls1intum/Apollon

# Install dependencies
yarn install

# Generate a link to the Apollon project
yarn link (This command will generate a symlink of Apollon as "@ls1intum/apollon")

# Recompile the project (Re-run this command whenever changes to Apollon are made)
yarn prepare
```
Once the symlink of Apollon is generated, we will now link the generated symlink to the Standalone project.
#### In standalone project (Link the symlink)

```
# Clone the Apollon repository
git clone https://github.com/ls1intum/Apollon_standalone

# Install dependencies
yarn install

# Link the local symlink of Apollon
yarn link "@ls1intum/apollon"

# Build the Standalone project (Re-run this command whenever `yarn prepare` command is executed in Apollon)
yarn build

# Start the project
yarn start
```
You will now have a Standalone project using the local version of Apollon. (Instead of the one from the npm repository).

> NOTE: While making changes in the Apollon project, for the changes to get reflected in Standalone, execute the following workflow:
> 1. Recompile the Apollon project by executing `yarn prepare`
> 2. Rebuild the Standalone project by executing `yarn build`

### To reverse this process 
```
# In the Apollon project
yarn unlink

# In the Standalone project
yarn unlink "@ls1intum/apollon"
```
For more information please refer to the [documentation](https://classic.yarnpkg.com/lang/en/docs/cli/link/) of yarn.







