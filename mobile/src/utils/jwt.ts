import { JwtPayload } from "../types";

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const segment = token.split(".")[1];

    if (!segment) return null;

    const base64 = segment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segment.length / 4) * 4, "=");

    // In the browser and in React Native, `btoa`/`atob` are available
    // (Expo provides polyfilled globals for the bare React Native runtime).
    const binary = atob(base64);
    const json = decodeURIComponent(
      Array.from(binary, (char: string) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
      ).join("")
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};
