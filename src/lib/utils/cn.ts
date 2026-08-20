import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // console.log(inputs, "scaning clases for clx");
  // console.log(clsx(inputs), "scaning clases for clsx()");
  // console.log(twMerge(clsx(inputs)), "scanning what does merge do")
  return twMerge(clsx(inputs));
}
