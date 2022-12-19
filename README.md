# Apollon Standalone

Apollon Standalone is the Standalone version of the [Apollon Editor](https://github.com/ls1intum/Apollon)

There are two variants how you can use this editor:
1. As web application which only runs in the users environment (modeling functionality).
2. With an application server which enables some extra features, like sharing of diagrams.

It consists of following features:
## Main Features
### No account needed to use
Users can use all the features of Standalone without the necessity of creating an account.
All you have to do is goto the [URL](https://apollon.ase.in.tum.de/) and start drawing.

### Easy to use editor
The user interface of Apollon is simple to use.
It works just like any other office and drawing tools that most of the users are familiar with.

- Select the diagram type you want to draw by clicking on `File > New` menu. This selection determines the availability of elements that the user can use while drawing their diagram, making it easier for the users who are newly introduced to modeling.
- Adding the element is as easy as dragging it from the elements menu and dropping it to the canvas. So is drawing connection between them, simply drag and connect two or multiple elements.
- Layout of connection is drawn automatically by the editor. If you want to manually layout it, use the existing waypoints features.
- Edit or style the text or change the colors of any elements by double clicking on it. An easy to use menu will allow you to do so.
- Use keyboard shortcuts to copy, paste, delete and move the elements throughout the canvas.
- Change the theme of the editor by clicking on dark/light mode switch.

### Import and Export your diagrams
Users can easily import the existing Apollon diagram to any editor that uses Apollon library and continue editing.

![Import Diagram](/docs/images/Import.gif "Import Diagram")

Exporting the diagrams is as easy as importing it. 
Click on `File > Export` and select the format of the diagram to be exported as.
Currently, Apollon standalone supports five different formats: `SVG`, `PNG (White Background)`, `PNG (Transparent Background)`, `JSON`, and `PDF`.

![Export Diagram](/docs/images/Export.png "Export Diagram")

### Create diagram from template
Users in Apollon Standalone can also create diagram from template, if they do not want to draw a diagram from scratch. 
To do that, all they have to do is click on `File > Start from Template` and select one of the template from list of available templates.

![Start from Template](/docs/images/StartFromTemplate.gif "Start from Template")


### Share your diagram with others
Users can share the diagram in Apollon Standalone in four different types.
- `Edit`: In this mode of sharing, user will be able to make changes to the shared diagram.
- `Give Feedback`: In this mode of sharing, user will not be able to make changes to the shared diagram, but can only provide feedback to it.
- `See Feedback`: In this mode of sharing, user can view feedback provided to the shared diagram.
- `Collaborate`: In this mode of sharing, users joining the collaboration session will be able to work on the diagram collaboratively with other users.

![Real-time collaboration](/docs/images/ShareDialog.png "Real-time collaboration")


### Collaborate in real-time
Apollon Standalone can be used as a collaborative modeling canvas, where multiple users can work collaboratively.
Any changes made by one user will be visible throughout the canvas of all other users that are in collaboration session in real time.
Active elements that are interacted by users in a session, are highlighted in the canvas.

![Real-time collaboration](/docs/images/RealTimeCollaboration.gif "Real-time collaboration")


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







