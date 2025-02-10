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

export function convertToThaiDate(date: string): string {
  const dateD = new Date(date)
  const thaiMonths: string[] = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const day: number = dateD.getDate();
  const month: string = thaiMonths[dateD.getMonth()];
  const year: number = dateD.getFullYear() + 543;

  return `${day} ${month} ${year}`;
}

export function convertToEngDate(date: string): string {
  const dateD = new Date(date);
  return dateD.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}