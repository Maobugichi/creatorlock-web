export interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string;
  store_slug: string;
  bio: string | null;
  profile_image: string | null;
  banner_image: string | null;
  social_links: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  } | null;
  payout_enabled: boolean;
  status: string;
}

export interface SettingsFormValues {
  display_name: string;
  bio: string;
  store_slug: string;
  profile_image: string | null;
  banner_image: string | null;
  twitter: string;
  instagram: string;
  youtube: string;
  website: string;
}

export interface ApiError {
  response?: { data?: { message?: string } };
}