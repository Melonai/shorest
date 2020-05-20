# sho.rest
A simple URL shortener built to be fast and easy.

>Supports up to 262144 unique three-character links, guarantees absolutely zero collisions!

### Building

To deploy please first ensure you either have these variables in your enviroment or in your .env file.

```
DATABASE_URL=<yourdatabase>
PORT=<yourport>
```

After you made sure these variables exist, run this to build the frontend.

> sho.rest does not support npm at this point of time, but I doubt it's too hard to set up anyway.

```sh
$ yarn postinstall
```

After building the frontend, build the underlying server using:

```sh
$ cargo build --release
```

### Running

Run the binary executable created by cargo in target using:
```sh
$ ./target/release/shorest
```

View the results at `http://localhost:<yourport>` in your browser of choice!

----

Have fun!
