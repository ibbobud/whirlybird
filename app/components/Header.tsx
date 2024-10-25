interface HeaderProps {
  importanceRank: number;
  serialNumber: string;
  customerName: string;
}

export default function Header({ importanceRank, serialNumber, customerName }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-red-800 text-white flex items-center justify-between px-5 shadow-lg">
      <div className="w-[15%] text-2xl font-bold">
        Rank: {importanceRank}
      </div>
      <div className="w-[60%] text-center text-3xl font-bold">
        {serialNumber}
      </div>
      <div className="w-[25%] text-right text-2xl font-bold">
        {customerName}
      </div>
    </header>
  );
}
