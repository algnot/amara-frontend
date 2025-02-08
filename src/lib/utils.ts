import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { removeItem } from "./storage";

export async function logout() {
  await removeItem("access_token");
  await removeItem("refresh_token");
  window.location.href = "/login"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
