import TrustWalletIcon from "@app/components/svgs/TrustWalletIcon";

export default function TrustWalletCard(props: { onClick: () => void }) {
  return (
    <div
      onClick={props.onClick}
      className="space-y-4 p-8 hover:bg-gray-800 rounded-md cursor-pointer transition duration-150 flex flex-col items-center justify-center"
    >
      <TrustWalletIcon className="w-20" />
      <div className="space-y-0 text-center">
        <div className="font-bold text-lg">TrustWallet</div>
        <div className="text-base text-gray-300">
          Connect to your TrustWallet
        </div>
      </div>
    </div>
  );
}
