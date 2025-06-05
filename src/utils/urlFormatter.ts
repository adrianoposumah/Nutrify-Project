// Test utility to demonstrate the URL formatting functionality
export function formatUserNameForUrl(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

// Example usage:
// formatUserNameForUrl("John Doe") => "johndoe"
// formatUserNameForUrl("Mary Jane Watson") => "maryjanesexton"
// formatUserNameForUrl("Single") => "single"
