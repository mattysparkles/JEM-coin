import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const SNAPSHOTS = gql`
  query Snapshots {
    paramsSnapshots { epoch targetDifficulty params recordedAt }
    latestParams { epoch targetDifficulty params recordedAt }
  }
`;

export default function ParamsPage() {
  const { data, refetch } = useQuery(SNAPSHOTS);
  const [epochInfo, setEpochInfo] = useState<any>();

  async function fetchEpoch() {
    const res = await fetch('http://localhost:8080', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ method: 'get_epoch_info' })
    });
    const json = await res.json();
    setEpochInfo(json.result);
  }

  useEffect(() => { fetchEpoch(); }, []);

  useEffect(() => {
    const es = new EventSource('http://localhost:8080/events');
    es.onmessage = (e) => {
      const ev = JSON.parse(e.data);
      if (ev.event === 'EpochAdvanced') {
        setEpochInfo(ev);
      } else if (ev.event === 'ParamsUpdated') {
        refetch();
      }
    };
    return () => es.close();
  }, [refetch]);

  return (
    <div>
      <h1>Protocol Parameters</h1>
      <section>
        <h2>Overview</h2>
        <div>Epoch {epochInfo?.epoch} Slot {epochInfo?.slot} Target Diff {epochInfo?.target_difficulty}</div>
      </section>
      <section>
        <h2>Difficulty Timeline</h2>
        <ul>
          {data?.paramsSnapshots?.map((p: any) => (
            <li key={p.epoch}>Epoch {p.epoch}: {p.targetDifficulty}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Latest Params</h2>
        <pre>{JSON.stringify(data?.latestParams?.params, null, 2)}</pre>
      </section>
    </div>
  );
}
