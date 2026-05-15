import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import api from "@/lib/api";
import { SettingsFormValues, ApiError } from "../_types";

export function useSaveProfile(reset: UseFormReset<SettingsFormValues>) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (values: SettingsFormValues) =>
      api
        .patch("/creator/me", {
          display_name: values.display_name,
          bio: values.bio || undefined,
          profile_image: values.profile_image ?? undefined,
          banner_image: values.banner_image ?? undefined,
          social_links: {
            ...(values.twitter ? { twitter: values.twitter } : {}),
            ...(values.instagram ? { instagram: values.instagram } : {}),
            ...(values.youtube ? { youtube: values.youtube } : {}),
            ...(values.website ? { website: values.website } : {}),
          },
        })
        .then((r) => r.data),
    onSuccess: (_, values) => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      reset(values, { keepValues: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const errorMessage = mutation.isError
    ? (mutation.error as ApiError)?.response?.data?.message ?? "Failed to save. Try again."
    : null;

  return {
    save: mutation.mutate,
    saving: mutation.isPending,
    saved,
    errorMessage,
    resetMutation: mutation.reset,
  };
}