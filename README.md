# Apollon_standalone

Standalone version of Apollon Editor

## Setup

### Build the web application

`yarn build`

the build result will be stored in the dist dir in the content root

### With application server and sharing function on linux machine

Add a user for the application:

`sudo useradd -r -s /bin/false apollon_standalone`

Make a directory for the diagrams to be stored

`mkdir path/to/diagrams`

Add the path to the created directory to:
- the cronjob in delete-stale-diagrams.cronjob.txt
- in packages/server/src/main/constants.ts

Install the cronjob for deleting stale files

`crontab -u apollon_standalone delete-stale-diagrams.cronjob.txt`

Remove cronjob

`crontab -r -u apollon_standalone`

## Developer Setup

```
// installs dependencies
yarn install
// start webpack dev server
yarn start
// accessible via localhost:8888
```


