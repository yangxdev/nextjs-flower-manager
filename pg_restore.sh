#!/bin/bash

source .env
POSTGRES_URL="$POSTGRES_URL"
POSTGRES_USER="$POSTGRES_USER"
POSTGRES_HOST="$POSTGRES_HOST"
POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
POSTGRES_DATABASE="$POSTGRES_DATABASE"
BACKUP_DIR="db_backups/to_restore"

echo " "
echo "---- Database Restore Script ----"
echo "Restoring database from backup file in $BACKUP_DIR..."
echo "URL: $POSTGRES_URL"
echo "User: $POSTGRES_USER"
echo "Host: $POSTGRES_HOST"
echo "Database: $POSTGRES_DATABASE"
echo "--------- by @YANGXDEV ---------"
echo " "

# Export the PostgreSQL password so that psql can use it without prompting
export PGPASSWORD=$POSTGRES_PASSWORD

# Check if there is a backup file in the directory
BACKUP_FILE=$(ls $BACKUP_DIR/*.sql 2> /dev/null | head -n 1)

if [[ -z "$BACKUP_FILE" ]]; then
    echo "No backup file found in $BACKUP_DIR."
    echo "Press any key to continue..."
    read -n 1
fi

# Use psql to restore the database from the backup
psql.exe -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DATABASE < "$BACKUP_FILE"

# Unset the PostgreSQL password
unset PGPASSWORD

echo "Database restoration completed successfully."
echo "Press any key to continue..."
read -n 1