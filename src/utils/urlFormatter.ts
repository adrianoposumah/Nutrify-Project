// Test utility to demonstrate the URL formatting functionality
export function formatUserNameForUrl(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

// Format item name for URL (encode and lowercase)
export function formatItemNameForUrl(name: string): string {
  return encodeURIComponent(name.toLowerCase());
}

// Decode item name from URL
export function decodeItemNameFromUrl(encodedName: string): string {
  return decodeURIComponent(encodedName);
}

// Example usage:
// formatUserNameForUrl("John Doe") => "johndoe"
// formatUserNameForUrl("Mary Jane Watson") => "maryjanesexton"
// formatUserNameForUrl("Single") => "single"
// formatItemNameForUrl("Nasi Goreng") => "nasi%20goreng"
// decodeItemNameFromUrl("nasi%20goreng") => "nasi goreng"
