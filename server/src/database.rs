use crate::parsing::get_hash_from_string;
use crate::schema::links;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::{
    ExpressionMethods, OptionalExtension, PgConnection, QueryDsl, QueryResult, RunQueryDsl,
};

embed_migrations!("migrations");

#[derive(Queryable, Insertable)]
#[table_name = "links"]
pub struct ShortenedLink {
    pub hash: String,
    pub url: String,
}

// Creates a connection pool to the database
pub fn establish_connection() -> Pool<ConnectionManager<PgConnection>> {
    let password =
        std::env::var("POSTGRES_PASSWORD").expect("Cannot find POSTGRES_PASSWORD in environment.");
    let database_url = format!("postgresql://postgres:{}@postgres/shorest", password);
    let manager = ConnectionManager::<PgConnection>::new(database_url);

    Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

/// Gets a link from the database.
pub fn get_link_from_database(
    url_hash: &String,
    connection: &PgConnection,
) -> actix_web::Result<Option<String>, diesel::result::Error> {
    links::table
        .filter(links::hash.eq(url_hash))
        .select(links::url)
        .first(connection)
        .optional()
}

/// Inserts a link into the database.
fn add_link_to_database(
    entry: ShortenedLink,
    connection: &PgConnection,
) -> QueryResult<ShortenedLink> {
    diesel::insert_into(links::table)
        .values(&entry)
        .get_result::<ShortenedLink>(connection)
}

/// Inserts a new link into the database, avoiding collisions.
pub fn add_link_to_database_safely(
    mut hash: String,
    user_url: &str,
    connection: &PgConnection,
) -> Result<String, diesel::result::Error> {
    // Check whether a link with the same hash exists within the database
    match get_link_from_database(&hash, connection)? {
        Some(other_url) => {
            // We found a collision!
            if user_url != other_url {
                warn!("'{}' and '{}' have colliding hashes.", user_url, other_url);

                // Try inserting again using the hash of the collided hash
                hash =
                    add_link_to_database_safely(get_hash_from_string(&hash), user_url, connection)?;
            }
        }
        None => {
            // No link with the same hash exists, put it in the database
            add_link_to_database(
                ShortenedLink {
                    hash: hash.clone(),
                    url: user_url.to_string(),
                },
                connection,
            )?;
        }
    };
    Ok(hash)
}

pub fn run_migrations(pool: &PoolState) {
    let migration_connection = &pool
        .get()
        .expect("Could not connect to database to run migrations");

    embedded_migrations::run_with_output(migration_connection, &mut std::io::stdout())
        .expect("Failed to run migrations.");
}

pub type PoolState = Pool<ConnectionManager<PgConnection>>;
