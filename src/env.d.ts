/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
