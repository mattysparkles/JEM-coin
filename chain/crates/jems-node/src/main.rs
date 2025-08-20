use clap::{Parser, Subcommand};
use std::net::SocketAddr;
use anyhow::Result;

/// Minimal node binary for JEMs.
#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize node configuration.
    Init {},
    /// Run the node with RPC server.
    Run {
        #[arg(long, default_value = "127.0.0.1:8080")]
        rpc: SocketAddr,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Init {} => {
            println!("initialized");
        }
        Commands::Run { rpc } => {
            println!("starting node; RPC at {rpc}");
            jems_rpc::serve(rpc).await;
        }
    }
    Ok(())
}
