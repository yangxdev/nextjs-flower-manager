#!/bin/bash

source .env
POSTGRES_URL="$POSTGRES_URL"
POSTGRES_USER="$POSTGRES_USER"
POSTGRES_HOST="$POSTGRES_HOST"
POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
POSTGRES_DATABASE="$POSTGRES_DATABASE"

echo " "
echo "---- Database Backup Script ----"
echo "URL: $POSTGRES_URL"
echo "User: $POSTGRES_USER"
echo "Host: $POSTGRES_HOST"
echo "Database: $POSTGRES_DATABASE"
echo "--------- by @YANGXDEV ---------"
echo " "

# Export the PostgreSQL password so that pg_dump can use it without prompting
export PGPASSWORD=$POSTGRES_PASSWORD

# Create a directory for backups if it doesn't exist
mkdir -p db_backups

# Get the current date and time in YYYYMMDD_HHMM format
current_date_time=$(date +%Y%m%d_%H%M)

# Initialize a counter for the backup files
counter=0

# Generate a filename based on the date, time and counter
filename="db_backups/db_backup_${current_date_time}_${counter}.sql"

# If a file with the generated name already exists, increment the counter until we find a filename that doesn't exist
while [[ -e $filename ]]; do
  counter=$((counter+1))
  filename="db_backups/db_backup_${current_date_time}_${counter}.sql"
done

# Use pg_dump to create a backup of the database
pg_dump.exe -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DATABASE > $filename

# Unset the PostgreSQL password
unset PGPASSWORD

echo "Database backup completed successfully."
echo "Backup saved as ${filename}"
echo "Press any key to continue..."
read -n 1