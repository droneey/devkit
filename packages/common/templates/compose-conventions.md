# Docker Compose Conventions

## Top-Level Key Order

```yaml
name:
x-*: # Extensions (anchors for reuse)
services:
networks:
volumes:
```

## Service Key Order

```yaml
services:
  service-name:
    image: # or build:
    container_name:
    extends:
    profiles:
    restart:
    command:
    depends_on:
    networks:
    ports:
    volumes:
    logging:
    healthcheck:
    security_opt:
    labels:
    tmpfs:
    environment:
```

## Conventions

- Use YAML anchors (`x-*`) for shared config (environment, logging, healthcheck, security)
- Use `extends` + base services (prefixed with `_`) for service variants
- Base services use `profiles: [do-not-use]` to prevent direct startup
- Environment-specific services are suffixed: `-development`, `-test`, `-production`
- Quote port mappings: `'5432:5432'`
- Use `service_healthy` condition in `depends_on`
- Set `restart: 'no'` for test/CI services
