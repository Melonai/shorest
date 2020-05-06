extern crate actix_web;
extern crate env_logger;
#[macro_use] extern crate serde_derive;

use actix_web::{middleware, web, HttpServer, App, HttpResponse, HttpRequest};
use listenfd::ListenFd;
use actix_web::web::Json;

#[derive(Debug, Deserialize)]
struct UserData {
    url: String
}

#[derive(Debug, Serialize)]
struct UserResponse {
    hash: String,
    key: String
}

async fn root() -> HttpResponse {
    HttpResponse::Ok().body("Please make a POST request to / with the URL you want to shorten!")
}

async fn shorten(req: HttpRequest, params: Json<UserData>) -> HttpResponse {
    //println!("{:?}", req.head());
    println!("{:?}", params.url);
    HttpResponse::Ok().body("Right back at you!")
}

async fn redirect() -> HttpResponse {
    HttpResponse::TemporaryRedirect().header("Location", "http://google.com/").finish()
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let mut lfd = ListenFd::from_env();
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    let mut server = HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(
            web::resource("/")
                .route(web::get().to(root))
                .route(web::post().to(shorten))
            )
            .service(
                web::resource("/{hash}/{key}")
                    .route(web::get().to(redirect))
            )
    });
    server = if let Some(l) = lfd.take_tcp_listener(0).unwrap() {
        server.listen(l)?
    } else {
        server.bind("localhost:3000")?
    };

    server.run().await
}
