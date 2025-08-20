export interface BlockHeaderProps {
  height: number;
  epoch?: number;
  slot?: number;
}

export default function BlockHeaderCard(props: BlockHeaderProps) {
  return (
    <div className="block-card">
      <h2>Block {props.height}</h2>
      <p>Epoch: {props.epoch} Slot: {props.slot}</p>
    </div>
  );
}
