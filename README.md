# The Goal
To create a url shortener with as little code as possible.
A shortened url will have a requirement of an expiration time.


# Containerization
At the very least, nginx and some kind of database must be used in a container.
Bonus points for containerizing the node server.


# Back End
Language: NodeJS

Ideal is to use as few packages as possible.
Must be clusterable.
Uses lightweight modules where possible.


# Front End Technology Requirement
The front end must use a fast and lightweight framework.
Svelte

There must be an additional page to get info about a url.
Must include:
* Time until expiration (living countdown)
* Times visited

# Configs
PORT=8080
DB_PORT=27017
DB_NAME=expirable
DB_HOST=mongo


# How To Run
You will need Docker and Docker-Compose

### Docker
1) Create .env config file with configs above.
2) Execute build-container.sh script.
3) Run npm run deploy.
4) Wait for containers to initialize.
5) Open http://localhost:8080 in browser.
