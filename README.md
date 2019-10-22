# API app

[![Build Status](https://travis-ci.org/meowle/cats-api.svg?branch=master)](https://travis-ci.org/meowle/cats-api)

## Setup DB

Необходимы права администратора.

```bash
docker-compose up -d
docker-compose exec -T pg psql -U cats < configs/db.sql
```
