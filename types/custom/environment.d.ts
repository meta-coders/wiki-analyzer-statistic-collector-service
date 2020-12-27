declare namespace NodeJS {
  interface ProcessEnv {
    PGHOST: string;
    PGPORT: string;
    PGUSER: string;
    PGPASSWORD: string;
    RECENT_CHANGES_API_URL: string;
  }
}
