# 多阶段构建：Maven 3.6.3 + JDK 17 构建 → JRE 17 运行
FROM maven:3.6.3-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:resolve-plugins
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/goddb-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
