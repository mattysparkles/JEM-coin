import { gql, useQuery } from '@apollo/client';

const HONEYPOTS_QUERY = gql`
  query Honeypots {
    honeypots { id seed_hash status expires_epoch }
  }
`;

export default function Honeypots() {
  const { data } = useQuery(HONEYPOTS_QUERY);
  return (
    <div>
      <h1>Honey Pots</h1>
      <ul>
        {data?.honeypots?.map((h: any) => (
          <li key={h.id}>{h.seed_hash} - {h.status}</li>
        ))}
      </ul>
    </div>
  );
}
