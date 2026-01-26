import Image from "next/image";
import UpgradeButton from "./components/ButtonTrack";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center  font-sans ">
      <UpgradeButton />
    </div>
  );
}
