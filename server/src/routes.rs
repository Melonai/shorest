use crate::database::{add_link_to_database_safely, get_link_from_database, PoolState};
use crate::messages::{ErrorResponse, ShortenRequest, ShortenResponse};
use crate::parsing::{get_hash_from_string, make_url};
use actix_files::NamedFile;
use actix_web::web::{Data, Json, Path};
use actix_web::{web, Responder};
use actix_web::{HttpRequest, HttpResponse};

pub async fn root(req: HttpRequest) -> impl Responder {
    NamedFile::open("./client/index.html")
        .unwrap()
        .into_response(&req)
        .unwrap()
}

pub async fn shorten(params: Json<ShortenRequest>, state: Data<PoolState>) -> HttpResponse {
    let user_url = match make_url(&params.url) {
        Ok(url) => url,
        Err(_) => {
            return HttpResponse::BadRequest().json(ErrorResponse::new(
                "The URL you entered does not follow the proper URL format.",
            ))
        }
    };

    let connection = state.get().expect("Could not get a connection from pool");

    // Generate the initial hash, this is almost always the same as the inserted hash, but not on collisions.
    let initial_hash = get_hash_from_string(&user_url);

    // Insert the URL
    let hash =
        match web::block(move || add_link_to_database_safely(initial_hash, &user_url, &connection))
            .await
        {
            Ok(hash) => hash,
            Err(e) => {
                error!("Error occurred on adding new link: {:?}", e);
                return HttpResponse::InternalServerError().finish();
            }
        };

    HttpResponse::Ok().json(ShortenResponse { hash })
}

pub async fn redirect(info: Path<String>, state: Data<PoolState>) -> impl Responder {
    let connection = state.get().expect("Could not get a connection from pool");
    let url_result = web::block(move || get_link_from_database(&info, &connection)).await;

    match url_result {
        Ok(found_url) => match found_url {
            Some(url) => HttpResponse::TemporaryRedirect()
                .header("Location", url)
                .finish(),
            None => HttpResponse::TemporaryRedirect()
                .header("Location", "/")
                .finish(),
        },
        Err(e) => {
            error!("Error when getting link: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}
