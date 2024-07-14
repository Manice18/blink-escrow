import Link from "next/link";

const SolanaExplorer = ({
  children,
  address,
}: {
  children: React.ReactNode;
  address: string;
}) => {
  return (
    <Link
      href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
      target="_blank"
    >
      {children}
    </Link>
  );
};

export default SolanaExplorer;
