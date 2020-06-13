extern crate openssl;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;

mod schema;
use schema::links;

mod types;
use types::*;

use actix_web::{middleware, web, HttpServer, App, HttpResponse, Result, HttpRequest};
use actix_web::web::{Json, Path, Data};
use diesel::{PgConnection, RunQueryDsl, QueryDsl, ExpressionMethods, QueryResult};
use dotenv::dotenv;
use diesel::r2d2::{ConnectionManager, Pool};
use actix_files::{Files, NamedFile};

fn establish_connection() -> Pool<ConnectionManager<PgConnection>> {
    let database_url = std::env::var("DATABASE_URL").expect("Cannot find DATABASE_URL. Check .env file.");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder().max_size(4).build(manager).expect("Failed to create pool.")
}

fn make_url(url_to_check: &str) -> Result<String, ()> {
    let url_object = match url::Url::parse(url_to_check) {
        Ok(result_url) => result_url,
        Err(_) => return Err(())
    };
    if !url_object.cannot_be_a_base() &&
        url_object.has_host() &&
        url_object.host_str().map_or(false, |h| h.contains('.')) &&
        url_object.domain().is_some()
    {
        Ok(format!("https://{}{}{}",
                   url_object.domain().unwrap(),
                   url_object.path(),
                   url_object.query().map_or("".to_owned(), |q| format!("?{}", q)))
        )
    } else {
        Err(())
    }
}

fn add_entry_to_database(entry: Entry, connection: &PgConnection) -> QueryResult<Entry> {
    diesel::insert_into(links::table).values(&entry).get_result::<Entry>(connection)
}

fn get_url_from_database(url_hash: &String, connection: &PgConnection) -> Result<String, diesel::result::Error> {
    links::table.filter(links::hash.eq(url_hash)).select(links::url).first(connection)
}

fn get_hash_from_string(to_hash: &String) -> String {
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(to_hash.as_bytes());
    base64::encode_config(hasher.finalize().to_ne_bytes(), base64::URL_SAFE_NO_PAD).chars().take(3).collect()
}

fn add_to_database_safely(mut hash: String, user_url: String, connection: &PgConnection) -> String {
    match get_url_from_database(&hash, connection) {
        Ok(other_url) => {
            if user_url != other_url {
                hash = add_to_database_safely(get_hash_from_string(&hash), user_url, connection);
            }
        }
        Err(_) => {
            add_entry_to_database(Entry { hash: hash.clone() , url: user_url }, connection).unwrap();
        }
    };
    hash
}

async fn root(req: HttpRequest) -> HttpResponse {
    NamedFile::open("./client/build/index.html").unwrap().into_response(&req).unwrap()
}

async fn shorten(params: Json<UserData>, state: Data<PoolState>) -> HttpResponse {
    let user_url = match make_url(&params.url) {
        Ok(parse_result) => parse_result,
        Err(_) => {
            return HttpResponse::BadRequest().json(ErrorResponse{error: "The URL you entered does not follow the proper URL format.".to_string()});
        },
    };
    let hash = add_to_database_safely(get_hash_from_string(&user_url), user_url, &state.get().expect("Could not get a connection from pool"));

    HttpResponse::Ok().json(UserResponse{ hash })
}

async fn redirect(info: Path<String>, state: Data<PoolState>) -> HttpResponse {
    match get_url_from_database(&info, &state.get().expect("Could not get a connection from pool")) {
        Ok(url) => HttpResponse::TemporaryRedirect().header("Location", url).finish(),
        Err(_) => HttpResponse::TemporaryRedirect().header("Location", "/").finish()
    }
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    let pool = establish_connection();
    let port = std::env::var("PORT")
        .unwrap()
        .parse()
        .expect("PORT must be a number.");

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .data(pool.clone())
            .service(
            web::resource("/")
                .route(web::get().to(root))
                .route(web::post().to(shorten))
            )
            .service(
                web::resource("/{hash}")
                    .route(web::get().to(redirect))
            )
            .service(
                Files::new("/client/", "./client/build/")
            )
    })
        .bind(("0.0.0.0", port))?
        .run()
        .await
}
