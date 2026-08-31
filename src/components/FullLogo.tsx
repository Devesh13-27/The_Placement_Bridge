import Image from "next/image";

export default function FullLogo({
  className = "",
  size = "w-32 sm:w-40",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <Image
      src="/brand/logo-full.png"
      alt="The Placement Bridge"
      width={1254}
      height={1254}
      priority
      className={`h-auto ${size} ${className}`}
    />
  );
}
