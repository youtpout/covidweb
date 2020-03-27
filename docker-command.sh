docker build --pull -t covidweb .

docker rm covid_web -f

docker container run --publish 4000:4000 --detach --restart unless-stopped --name covid_web covidweb

