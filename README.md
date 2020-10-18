# Apollon_standalone

Standalone version of Apollon Editor

## Setup

### Build the web application

`yarn build`

the build result will be stored in the build dir in the project root

### With application server and sharing function on linux machine

Add a user for the application:

`sudo useradd -r -s /bin/false apollon_standalone`

Make a directory for the diagrams to be stored

`mkdir path/to/diagrams`

Add the path to the created directory to:
- the cronjob in delete-stale-diagrams.cronjob.txt
- in packages/server/src/main/constants.ts

### Install as a service

Configure the apollon_standalone.service file so that the location matches your installation folder

Copy the service file 'apollon_standalone.service' into the /etc/systemd/system directory

`service apollon_standalone start`
`service apollon_standalone status`

#### Error codes
(code=exited, status=217/USER) -> apollon_standalone user does not exist
(code=exited, status=203/USER) -> script not executable


Install the cronjob for deleting stale files

`crontab -u apollon_standalone delete-stale-diagrams.cronjob.txt`

Remove cronjob

`crontab -r -u apollon_standalone`

### Docker Container

build docker container

`docker build -t apollon_standalone .`

run docker container 
`docker run -d --name apollon_standalone -p 8080:8080 apollon_standalone`


useful command to debug:

`docker run -it --entrypoint /bin/bash apollon_standalone`

it will run the docker container with a bash session, so you can further 
look into the content of the docker image. 

## Developer Setup

```
// installs dependencies
yarn install
// start webpack dev server
yarn start
// accessible via localhost:8888
```


