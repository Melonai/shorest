use base64::{encode_config, URL_SAFE_NO_PAD};
use crc32fast::Hasher;
use url::{ParseError, Url};

pub fn make_url(given_url: &str) -> Result<String, ParseError> {
    let parsed_url = Url::parse(given_url)?;
    Ok(parsed_url.into_string())
}

pub fn get_hash_from_string(to_hash: &str) -> String {
    let mut hasher = Hasher::new();
    hasher.update(to_hash.as_bytes());
    encode_config(hasher.finalize().to_ne_bytes(), URL_SAFE_NO_PAD)
        .chars()
        .take(3)
        .collect()
}
