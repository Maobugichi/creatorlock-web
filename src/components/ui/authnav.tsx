import Image from "next/image";
import Link from "next/link";

interface AuthNavProps {
  prompt?: string;
  linkLabel?: string;
  linkHref?: string;
}

const AuthNav = ({ prompt, linkLabel, linkHref }: AuthNavProps) => {
    return(
        <nav className="w-full py-4 px-3  border-b  border-gray-600 bg-neutral-950 flex justify-between">
           <Image
            src="/logo.svg"
            alt="Your Company Name"
            width={200}
            height={36}
            priority
            style={{ width: "clamp(160px, 20vw, 200px)", height: "50px" }}
            />
            <p className="hidden xs:flex text-[11px] sm:text-sm text-white/30 font-inter items-center gap-1 min-w-0">
            <span className="truncate">{prompt}</span>
            <Link href={linkHref ?? "#"} className="text-brand hover:underline shrink-0">
              {linkLabel}
            </Link>
          </p>
        </nav>
    )
}

export default AuthNav