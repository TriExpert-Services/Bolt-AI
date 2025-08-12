export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  // Split the cookie string by semicolons and spaces
  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest.length > 0) {
      // Decode the name and value, and join value parts in case it contains '='
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

export function getApiKeysFromCookie(cookieHeader: string | null): Record<string, string> {
  const cookies = parseCookies(cookieHeader);
  return cookies.apiKeys ? JSON.parse(cookies.apiKeys) : {};
}

export function getProviderSettingsFromCookie(cookieHeader: string | null): Record<string, any> {
  const cookies = parseCookies(cookieHeader);
  
  // Ensure Ollama is always enabled regardless of cached settings
  const defaultSettings = {
    Ollama: {
      enabled: true,
      baseUrl: 'http://127.0.0.1:11434'
    }
  };
  
  try {
    const cookieSettings = cookies.providers ? JSON.parse(cookies.providers) : {};
    
    // Merge with defaults to ensure Ollama is enabled
    return {
      ...defaultSettings,
      ...cookieSettings,
      Ollama: {
        ...defaultSettings.Ollama,
        ...(cookieSettings.Ollama || {}),
        enabled: true // Force enable Ollama
      }
    };
  } catch (error) {
    console.error('Error parsing provider settings from cookies:', error);
    return defaultSettings;
  }
}
