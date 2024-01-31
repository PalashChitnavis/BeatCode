FROM alpine:latest
USER root
WORKDIR /usr/java
RUN apk update
RUN apk fetch openjdk8
RUN apk add openjdk8
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"


# sudo docker build -t java:v1 . 
# run this command while in the java directory