// Default photos for the "Marafon haqida" pages. Once a page is saved from the
// admin panel with a photo list (PageContent.images), that list replaces these
// defaults entirely; until then the defaults are shown.
export const DEFAULT_PAGE_IMAGES: Record<string, string[]> = {
  conference: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q",
  ],
  "lower-house": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q",
  ],
  "parliament-youth": [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA578NtY4tlzyuEU5L7zzur1mO0Kdh3vI4ltDQEZQJWeVTM_nL0IUEfVxYRNp00RIeXkCQPpF18LtOE8IeuHBDdF7Wx18529E0iusBNof4KVxM1FTnWA4hPdSER4CusQFTPbUjjaZODlAtUvBPGdqEnQ_iIFI0CurMNotA3iT06VGu1b8E9w4M1VTsXt6uCipEzEq3QoXOMwKjWPMyg3lZEtW5GBEWSqIQtcC5IZzhWWfDio0mgH83vEUKwbYFAkGVV7Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAM_T8x9yTMXfJLZzQyw6Z-zgQJfu0E7jeIR1x_CODwkk9DtLy-Gzgh2_b_tDPrnJyn7zmBrawmpBMHV5qJChHx_ZLMsMIonvEVOAR4eh2knDZ28Sc2Lvl39zpZTGKcJi5Z_2SZ7LTbDAjL_Iu4APN3z7zYyfaFLVceFr39rj-dDEC9WtD1XlIY7jXe2WF5zlLMJJKk61w6-Q0T3Zo2o4qVzB6dQx72JzWG3htpYVy8XbIwEued6MeN-BV0nkMO12iHCw",
  ],
  "info-note": [],
  history: [],
};

/** Photos to show for a page: the admin list if it was ever saved, else the defaults. */
export function resolvePageImages(
  slug: string,
  managed: string[] | null | undefined,
): string[] {
  return managed ?? DEFAULT_PAGE_IMAGES[slug] ?? [];
}
