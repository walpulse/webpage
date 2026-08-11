export type TxAmount = {
  text: string;
  positive: boolean;
};

const POOL: TxAmount[] = [
  { text: "+1,240 USDC", positive: true },
  { text: "+8,500 USDC", positive: true },
  { text: "+420 USDC", positive: true },
  { text: "+12,400 USDC", positive: true },
  { text: "+0.85 ETH", positive: true },
  { text: "+2.10 ETH", positive: true },
  { text: "+0.12 ETH", positive: true },
  { text: "+1.5 ETH", positive: true },
  { text: "+0.04 BTC", positive: true },
  { text: "+0.015 BTC", positive: true },
  { text: "-640 USDC", positive: false },
  { text: "-3,200 USDC", positive: false },
  { text: "-0.42 ETH", positive: false },
  { text: "-1.5 ETH", positive: false },
  { text: "-0.08 ETH", positive: false },
  { text: "-0.009 BTC", positive: false },
];

export function randomTxAmount(): TxAmount {
  return POOL[Math.floor(Math.random() * POOL.length)];
}
