
Environment=$1

GeneratedMigrationFilePath=$2

yarn env-cmd -f ./src/envs/${Environment}.env \
    ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
    migration:create \
    ./src/database/migrations/${GeneratedMigrationFilePath}
