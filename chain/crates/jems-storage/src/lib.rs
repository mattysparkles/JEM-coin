//! Simple RocksDB based storage for JEMs chain.
use std::path::Path;

use jems_core::{Address, Block, BlockHeader, Epoch, Hash, Ticket};
use rocksdb::{ColumnFamilyDescriptor, Options, DB, Error as RocksError};

/// Names of the column families used by the chain.
const CF_HEADERS: &str = "headers";
const CF_BLOCKS: &str = "blocks";
const CF_STATE: &str = "state";
const CF_ACCOUNTS: &str = "accounts";
const CF_TICKETS: &str = "tickets";
const CF_WEIGHTS: &str = "weights";
const CF_HONEYPOTS: &str = "honeypots";
const CF_INDICES: &str = "indices";
const CF_RECEIPTS: &str = "receipts";

/// Wrapper over RocksDB exposing helper methods for common operations.
pub struct Storage {
    db: DB,
}

impl Storage {
    /// Open database at given path, creating column families if missing.
    pub fn open(path: impl AsRef<Path>) -> Result<Self, RocksError> {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);
        let cfs = vec![
            ColumnFamilyDescriptor::new(CF_HEADERS, Options::default()),
            ColumnFamilyDescriptor::new(CF_BLOCKS, Options::default()),
            ColumnFamilyDescriptor::new(CF_STATE, Options::default()),
            ColumnFamilyDescriptor::new(CF_ACCOUNTS, Options::default()),
            ColumnFamilyDescriptor::new(CF_TICKETS, Options::default()),
            ColumnFamilyDescriptor::new(CF_WEIGHTS, Options::default()),
            ColumnFamilyDescriptor::new(CF_HONEYPOTS, Options::default()),
            ColumnFamilyDescriptor::new(CF_INDICES, Options::default()),
            ColumnFamilyDescriptor::new(CF_RECEIPTS, Options::default()),
        ];
        let db = DB::open_cf_descriptors(&opts, path, cfs)?;
        Ok(Self { db })
    }

    fn cf(&self, name: &str) -> &rocksdb::ColumnFamily {
        self.db.cf_handle(name).expect("column family present")
    }

    /// Store a block by its header hash.
    pub fn put_block(&self, block: &Block) -> Result<(), RocksError> {
        let hash = block.header.hash();
        let bytes = bincode::serialize(block).expect("serialize block");
        self.db.put_cf(self.cf(CF_BLOCKS), hash, bytes)
    }

    /// Fetch a block if present.
    pub fn get_block(&self, hash: &Hash) -> Result<Option<Block>, RocksError> {
        match self.db.get_cf(self.cf(CF_BLOCKS), hash)? {
            Some(bytes) => Ok(Some(bincode::deserialize(&bytes).expect("decode block"))),
            None => Ok(None),
        }
    }

    /// Store a header by its hash.
    pub fn put_header(&self, header: &BlockHeader) -> Result<(), RocksError> {
        let hash = header.hash();
        let bytes = bincode::serialize(header).expect("serialize header");
        self.db.put_cf(self.cf(CF_HEADERS), hash, bytes)
    }

    /// Fetch a header by hash.
    pub fn get_header(&self, hash: &Hash) -> Result<Option<BlockHeader>, RocksError> {
        match self.db.get_cf(self.cf(CF_HEADERS), hash)? {
            Some(bytes) => Ok(Some(bincode::deserialize(&bytes).expect("decode header"))),
            None => Ok(None),
        }
    }

    /// Read engagement weight for an address, defaulting to 0.
    pub fn read_weight(&self, addr: &Address) -> Result<u64, RocksError> {
        match self.db.get_cf(self.cf(CF_WEIGHTS), addr.0)? {
            Some(bytes) => {
                let mut arr = [0u8; 8];
                arr.copy_from_slice(&bytes);
                Ok(u64::from_le_bytes(arr))
            }
            None => Ok(0),
        }
    }

    /// Write engagement weight for an address.
    pub fn write_weight(&self, addr: &Address, w: u64) -> Result<(), RocksError> {
        self.db
            .put_cf(self.cf(CF_WEIGHTS), addr.0, w.to_le_bytes())
    }

    /// Return tickets for a specific epoch if stored as an entire vector.
    pub fn tickets_by_epoch(&self, epoch: Epoch) -> Result<Vec<Ticket>, RocksError> {
        let key = epoch.0.to_le_bytes();
        match self.db.get_cf(self.cf(CF_TICKETS), key)? {
            Some(bytes) => Ok(bincode::deserialize(&bytes).expect("decode tickets")),
            None => Ok(Vec::new()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn weight_roundtrip() {
        let dir = TempDir::new().unwrap();
        let store = Storage::open(dir.path()).unwrap();
        let addr = Address([1u8; 32]);
        store.write_weight(&addr, 42).unwrap();
        assert_eq!(store.read_weight(&addr).unwrap(), 42);
    }
}
