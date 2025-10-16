import GameTopup from "../components/GameTopup";

const packages = [
  { amount: 100, price: "$1.20" },
  { amount: 310, price: "$3.50", bonus: "+10 bonus" },
  { amount: 520, price: "$5.80", bonus: "+30 bonus" },
  { amount: 1060, price: "$11.50", bonus: "+100 bonus" },
  { amount: 2180, price: "$23.00", bonus: "+260 bonus" },
  { amount: 5600, price: "$58.00", bonus: "+700 bonus" },
];

export default function FreeFire() {
  return (
    <GameTopup
      gameName="Free Fire"
      gameImage="https://ext.same-assets.com/1882033060/2359428848.jpeg"
      currency="Diamonds"
      packages={packages}
      idLabel="Player ID"
      hasZoneId={false}
    />
  );
}
