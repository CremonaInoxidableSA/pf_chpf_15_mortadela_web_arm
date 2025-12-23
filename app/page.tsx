import Image from "next/image";
import General from "@/public/designs/General.png";

export default function Home() {
  return (
  <div className="flex flex-col p-5 gap-5 w-full h-full">
    <h1 className="flex text-4xl w-full font-bold justify-center">General</h1>
    <div className="flex items-center justify-center bg-background2 w-full rounded-lg">
      <Image 
      alt="General"
      src={General}
      className="rounded-lg p-5"
      />
    </div>
  </div>
  );
}
