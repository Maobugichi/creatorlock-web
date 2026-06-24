interface BuyerAvatarProps {
  name: string | null;
  email: string;
}

export default function BuyerAvatar({ name, email }: BuyerAvatarProps) {
  const initial = (name ?? email).charAt(0).toUpperCase();
  return (
    <div className="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center flex-shrink-0">
      <span className="font-syne font-extrabold text-xl text-brand">{initial}</span>
    </div>
  );
}