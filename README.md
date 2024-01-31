To run application after cloning repository, use docker.

First, build the project using "docker-compose build".

Then, use the following docker compose command:
"docker-compose run --service-ports -e API_KEY={api_key} 310-project", where api_key is a TMDB
registered The Movie DB api key. 

Then, use the command "mvn spring-boot run" to run the application.