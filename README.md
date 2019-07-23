# API app

## Setup DB

```bash
> docker-compose up -d
> docker-compose exec pg psql -U cats
```

```sql
CREATE TABLE Cats (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    CONSTRAINT unique_name UNIQUE(name)
);
```
