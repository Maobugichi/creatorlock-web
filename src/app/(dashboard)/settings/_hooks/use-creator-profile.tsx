import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import api from "@/lib/api";
import { CreatorProfile, SettingsFormValues } from "../_types";

export function useCreatorProfile(reset: UseFormReset<SettingsFormValues>) {
  const query = useQuery({
    queryKey: ["creator-profile"],
    queryFn: () =>
      api.get<{ data: CreatorProfile }>("/creator/me").then((r) => r.data.data),
  });

  useEffect(() => {
    const p = query.data;
    if (!p) return;
    reset({
      display_name: p.display_name ?? "",
      bio: p.bio ?? "",
      store_slug: p.store_slug ?? "",
      profile_image: p.profile_image ?? null,
      banner_image: p.banner_image ?? null,
      twitter: p.social_links?.twitter ?? "",
      instagram: p.social_links?.instagram ?? "",
      youtube: p.social_links?.youtube ?? "",
      website: p.social_links?.website ?? "",
    });
  }, [query.data, reset]);

  return {
    isLoading: query.isLoading,
    originalSlug: query.data?.store_slug ?? "",
  };
}