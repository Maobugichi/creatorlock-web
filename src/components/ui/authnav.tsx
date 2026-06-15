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
           <div className="relative h-8 w-32 ">
              <Image
                src="/desktoplogo.png"
                alt="CreatorLock logo"
                fill
                className="object-contain"
              />
            </div>
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