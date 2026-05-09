#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  eval "$(
    node - <<'NODE'
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  process.exit(0);
}

const url = new URL(connectionString);
const decode = (value) => decodeURIComponent(value || '');
const databaseName = (url.pathname || '').replace(/^\/+/, '');

const exports = {
  DB_HOST: url.hostname,
  DB_PORT: url.port || '5432',
  DB_USER: decode(url.username),
  DB_PASSWORD: decode(url.password),
  DB_NAME: databaseName,
};

for (const [key, value] of Object.entries(exports)) {
  process.stdout.write(`export ${key}=${JSON.stringify(value)}\n`);
}
NODE
  )"
fi

exec "$@"
