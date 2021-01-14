extern crate openssl;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate log;

mod database;
mod messages;
mod parsing;
mod routes;
mod schema;

use actix_files::Files;
use actix_web::{middleware, web, App, HttpServer};

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "shorest,actix_web=info");
    env_logger::init();

    info!("Starting shorest {}!", std::env!("CARGO_PKG_VERSION"));

    let pool = database::establish_connection();
    database::run_migrations(&pool);

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .data(pool.clone())
            .service(
                web::resource("/")
                    .route(web::get().to(routes::root))
                    .route(web::post().to(routes::shorten)),
            )
            .service(web::resource("/{hash:[^/]{3}$}").route(web::get().to(routes::redirect)))
            .service(Files::new("/", "./client/"))
    })
    .bind(("0.0.0.0", 80))?
    .run()
    .await
}
