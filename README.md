# sho.rest
A simple URL shortener built to be fast and easy.

>Supports up to 262144 unique three-character links, guarantees absolutely zero collisions!

### Configuring

To deploy please first create a `.env` file in the sho.rest root folder with your configuration.
You can use the `.env.example` file as a baseline.

```
POSTGRES_PASSWORD=<YOUR_POSTGRES_PASSWORD>
PORT=<YOUR_PORT>
```

To update create and manage Diesel migrations your .env also has to have a `DATABASE_URL` variable.
This is included in `.env.example` for simplicity

```
DATABASE_URL=postgres://postgres:<YOUR_POSTGRES_PASSWORD>@localhost:5432/shorest
```

Please note that the password you pick has to be the same in both variables.

### Deploying

sho.rest is fully built and deployed using `docker-compose`.
The URL database is created and stored inside a Docker volume.

To start the necessary containers, simply run:
```sh
$ docker-compose up -d
```

You can view the results at `http://localhost:<YOUR_PORT>` in the browser of your choice!

----

Have fun!
