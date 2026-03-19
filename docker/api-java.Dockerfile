FROM maven:3.9.11-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY apps/api-java/pom.xml apps/api-java/pom.xml
COPY apps/api-java/src apps/api-java/src

WORKDIR /workspace/apps/api-java
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system spring \
    && useradd --system --gid spring spring

COPY --from=build /workspace/apps/api-java/target/hostelhub-api-0.0.1-SNAPSHOT.jar app.jar
COPY docker/api-java-entrypoint.sh /app/entrypoint.sh

RUN chmod 755 /app/entrypoint.sh

USER spring:spring

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
