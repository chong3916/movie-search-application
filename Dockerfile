FROM ubuntu:22.04
RUN apt-get update && apt-get install -y openjdk-17-jdk maven

VOLUME ["/root/.m2", "/usr/local/310-project"]
WORKDIR /usr/local/310-project
#CMD ["bash"]
