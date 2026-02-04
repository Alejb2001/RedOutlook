# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install Node.js for Angular build
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy csproj and restore
COPY OfficeReddit.csproj .
RUN dotnet restore

# Copy everything else
COPY . .

# Build Angular app
WORKDIR /src/ClientApp
RUN npm install
RUN npm run build -- --configuration production

# Build and publish .NET app
WORKDIR /src
RUN dotnet publish OfficeReddit.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Copy Angular build output to wwwroot
COPY --from=build /src/ClientApp/dist/client-app/browser ./wwwroot

# Expose port (Railway will override with PORT env var)
EXPOSE 8080

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the app
ENTRYPOINT ["dotnet", "OfficeReddit.dll"]
