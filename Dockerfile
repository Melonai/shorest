FROM ekidd/rust-musl-builder:latest AS server-cache
WORKDIR /server
COPY server/Cargo.* ./
RUN sudo mkdir src
RUN echo "fn main() {}" | sudo dd of=src/main.rs
RUN sudo chown rust:rust .
RUN cargo build --release
RUN rm -f target/x86_64-unknown-linux-musl/release/deps/shorest*

FROM node:alpine as client
WORKDIR /client
COPY client/package*.json ./
RUN yarn install
COPY client ./
RUN yarn build

FROM server-cache as server
WORKDIR /server
COPY server/src src
RUN cargo build --release

FROM alpine:latest
WORKDIR /shorest
COPY --from=client /client/build client/
COPY --from=server /server/target/x86_64-unknown-linux-musl/release/shorest shorest
CMD ./shorest
