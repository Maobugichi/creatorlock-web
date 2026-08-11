import Image from "next/image";
import Link from "next/link";

interface AuthNavProps {
  prompt?: string;
  linkLabel?: string;
  linkHref?: string;
}

const AuthNav = ({ prompt, linkLabel, linkHref }: AuthNavProps) => {
    return(
        <nav className="w-full py-4 px-3 border-b border-border bg-background flex justify-between">
           <div className="relative h-12 w-[120px]">
                <Image
                  src="/desktop-light.png"
                  alt="CreatorLock logo"
                  fill
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/desktoplogo.png"
                  alt="CreatorLock logo"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            <p className="hidden xs:flex text-[11px] sm:text-sm text-muted-foreground font-inter items-center gap-1 min-w-0">
            <span className="truncate">{prompt}</span>
            <Link href={linkHref ?? "#"} className="text-primary hover:underline shrink-0">
              {linkLabel}
            </Link>
          </p>
        </nav>
    )
}

export default AuthNav