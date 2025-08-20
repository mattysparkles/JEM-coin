import { gql, useQuery } from '@apollo/client';

const BLOCKS_QUERY = gql`
  query LatestBlocks {
    blocks(limit: 10) { id height epoch slot tx_count ticket_count }
  }
`;

export default function Home() {
  const { data } = useQuery(BLOCKS_QUERY);
  return (
    <div>
      <h1>Latest Blocks</h1>
      <table>
        <thead><tr><th>Height</th><th>Txs</th><th>Tickets</th></tr></thead>
        <tbody>
          {data?.blocks?.map((b: any) => (
            <tr key={b.id}><td>{b.height}</td><td>{b.tx_count}</td><td>{b.ticket_count}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
