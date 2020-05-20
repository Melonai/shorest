use diesel::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use crate::schema::links;

#[derive(Debug, Deserialize)]
pub struct UserData {
    pub url: String
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub hash: String
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String
}

#[derive(Queryable, Insertable)]
#[table_name="links"]
pub struct Entry {
    pub hash: String,
    pub url: String
}

pub type PoolState = Pool<ConnectionManager<PgConnection>>;