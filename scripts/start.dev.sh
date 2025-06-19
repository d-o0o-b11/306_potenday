echo "Start Server"
docker-compose \
    -f docker-compose.dev.yml \
    --env-file ./src/envs/development.env \
    up --build -d
yarn --cwd ./src start:dev
