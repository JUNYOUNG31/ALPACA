FROM openjdk:11-jdk
ARG JAR_FILE=build/libs/alpaca-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar","--spring.config.name=application-prod"]
