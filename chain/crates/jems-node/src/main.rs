use clap::{Parser, Subcommand};
use std::{net::SocketAddr, path::PathBuf, sync::Arc};
use anyhow::Result;
use jems_core::ProtocolParams;

/// Minimal node binary for JEMs.
#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum ParamsSub {
    /// Show current effective parameters.
    Show {},
    /// Write parameters to a TOML file.
    Write { #[arg(long)] path: PathBuf },
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
    /// Inspect or write protocol parameters.
    Params {
        #[command(subcommand)]
        cmd: ParamsSub,
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
            let params = Arc::new(ProtocolParams::effective());
            println!("starting node; RPC at {rpc}");
            println!("{}", params.to_markdown_table());
            jems_rpc::serve(rpc, params).await;
        }
        Commands::Params { cmd } => match cmd {
            ParamsSub::Show {} => {
                let p = ProtocolParams::effective();
                println!("{}", toml::to_string_pretty(&p).unwrap());
                println!();
                println!("{}", p.to_markdown_table());
            }
            ParamsSub::Write { path } => {
                let p = ProtocolParams::effective();
                std::fs::write(path, toml::to_string_pretty(&p).unwrap())?;
            }
        },
    }
    Ok(())
}
