# Monorepo starter-kit

Monorepo starter-Kit is a monorepo created with all the essential configurations to help you build and scale applications easily and efficiently

With Monorepo Starter-Kit, you will work with: 

- Package Manager (pnpm)
- Frontend App (React + vite)
- Server (Express)
- UI (Tailwind + Shadcn)
- Authentication (Better Auth)
- Payments (Stripe)
- Validation (Zod)
- ORM (Drizzle)
- Database (PostgreSQL)

## Development

### Start to develop your app

Execute the command below to install the dependencies

```

pnpm i

```

Execute the command below to start the servers

```

pnpm run dev

```

### Launch Redis Database

Launching your redis database in local


Execute the command below:

```

# https://hub.docker.com/_/postgres

docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass mypassword" redis/redis-stack:latest


```

Redis string connection

```

redis://default:mypassword@localhost:6379
redis://localhost:6379

```

### Stripe Webhook
### Launch Postgresql Database

Launching your postgres database in local


Execute the command below:

```

# https://hub.docker.com/_/postgres

docker run -dp 5432:5432  --name postgresdb  -e POSTGRES_USER=raburuz  -e POSTGRES_PASSWORD=mysecretpassword  -e POSTGRES_DB=dev  -v postgresql:/var/lib/postgresql/data  postgres:15-alpine

```

Postgresql string connection

```

postgresql://raburuz:mysecretpassword@localhost/dev

```

### Stripe Webhook

Download the Stripe CLI

https://docs.stripe.com/stripe-cli


Unzip the file in your desktop and open the window terminal (Command Prompt)

```

stripe login

# Forward events to your local development server
stripe listen --forward-to http://localhost:3000/api/auth/stripe/webhook

```