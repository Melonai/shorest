FROM ekidd/rust-musl-builder:latest AS rust
ADD --chown=rust:rust . ./
RUN cargo build --release

FROM node:alpine
RUN apk --no-cache add ca-certificates
COPY --from=rust \
    /home/rust/ \
    /main
WORKDIR /main/src
RUN cd ./client && yarn install && yarn build;
RUN mv ./target/x86_64-unknown-linux-musl/release/shorest ./shorest
CMD ./shorest

