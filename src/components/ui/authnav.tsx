import Link from "next/link";

interface AuthNavProps {
  prompt: string;
  linkLabel: string;
  linkHref: string;
}

const AuthNav = ({ prompt, linkLabel, linkHref }: AuthNavProps) => {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b border-white/5 bg-inherit w-full">
      <div className="font-syne font-extrabold text-base sm:text-xl text-white tracking-tight shrink-0">
        Creator<span className="text-brand">Lock</span>
      </div>

   
      <p className="hidden xs:flex text-[11px] sm:text-sm text-white/30 font-inter items-center gap-1 min-w-0">
        <span className="truncate">{prompt}</span>
        <Link href={linkHref} className="text-brand hover:underline shrink-0">
          {linkLabel}
        </Link>
      </p>
    </nav>
  );
}

export default AuthNav