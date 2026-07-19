interface AppConfig {
  API_BASE_URL: string;
}

let config: AppConfig = {
  API_BASE_URL: '/api/v1'
};

let isInitialized = false;

export const RuntimeConfig = {
  async init(customFetch: typeof fetch = fetch): Promise<void> {
    if (isInitialized) return;

    // 1. Jika di mode development (Vite), utamakan membaca langsung dari file .env
    const devApiUrl =
      import.meta.env?.VITE_PUBLIC_API_BASE_URL || import.meta.env?.PUBLIC_API_BASE_URL;
    if (import.meta.env?.DEV && devApiUrl) {
      config.API_BASE_URL = devApiUrl;
      isInitialized = true;
      console.log('[RuntimeConfig] (Dev Mode) Loaded configuration from .env:', config);
      return;
    }

    // 2. Jika di mode production (Docker/Static Hosting), ambil secara dinamis dari config.json
    try {
      const response = await customFetch('/config.json');
      if (response.ok) {
        const data = await response.json();
        config = { ...config, ...data };
        isInitialized = true;
        console.log('[RuntimeConfig] Loaded configuration from config.json:', config);
      } else {
        console.warn('[RuntimeConfig] Failed to fetch config.json, status:', response.status);
      }
    } catch (error) {
      console.warn('[RuntimeConfig] Failed to load config.json, using fallback values:', error);
    }
  },

  get apiBaseUrl(): string {
    return config.API_BASE_URL;
  }
};
