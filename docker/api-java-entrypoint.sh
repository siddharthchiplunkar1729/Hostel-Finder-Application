#!/bin/sh
set -eu

load_secret() {
  var_name="$1"
  file_var="${var_name}_FILE"
  eval "var_value=\${$var_name:-}"
  eval "file_value=\${$file_var:-}"

  if [ -n "${var_value}" ] && [ -n "${file_value}" ]; then
    echo "Both ${var_name} and ${file_var} are set; use only one." >&2
    exit 1
  fi

  if [ -n "${file_value}" ]; then
    if [ ! -r "${file_value}" ]; then
      echo "Secret file for ${var_name} is not readable: ${file_value}" >&2
      exit 1
    fi

    export "${var_name}=$(tr -d '\r\n' < "${file_value}")"
  fi
}

load_secret DB_PASSWORD
load_secret JWT_SECRET

if [ -z "${JWT_SECRET:-}" ]; then
  echo "JWT_SECRET or JWT_SECRET_FILE must be set." >&2
  exit 1
fi

if [ "${#JWT_SECRET}" -lt 32 ]; then
  echo "JWT_SECRET must be at least 32 characters long." >&2
  exit 1
fi

case "$(printf '%s' "${JWT_SECRET}" | tr '[:upper:]' '[:lower:]')" in
  *change-me*|*change-this*|*replace-with*|*example*)
    echo "JWT_SECRET appears to still be a placeholder value." >&2
    exit 1
    ;;
esac

exec sh -c "java ${JAVA_OPTS:-} -jar /app/app.jar"
