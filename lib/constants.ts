import type { PostType, Channel } from "@/types";

export const WEEKDAYS_ET = [
  "Esmaspäev",
  "Teisipäev",
  "Kolmapäev",
  "Neljapäev",
  "Reede",
  "Laupäev",
  "Pühapäev",
];

export const WEEKDAYS_SHORT_ET = ["E", "T", "K", "N", "R", "L", "P"];

export const MONTHS_ET = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
];

export const POST_TYPES_ET: Record<PostType, string> = {
  donation: "Annetuspostitus",
  video: "Video postitus",
  event: "Üritus",
  adoption: "Koduotsija",
  news: "Koduuudised",
  lottery: "Loos",
  collaboration: "Koostöö",
  update: "Update lood",
  other: "Muu",
};

export const POST_TYPE_EMOJIS: Record<PostType, string> = {
  donation: "💖",
  video: "🎬",
  event: "📅",
  adoption: "🐾",
  news: "📰",
  lottery: "🎟️",
  collaboration: "🤝",
  update: "📝",
  other: "✨",
};

export const CHANNEL_ICONS: Record<Channel, string> = {
  tiktok: "🎵",
  facebook: "📘",
  instagram: "📷",
};

export const CHANNEL_NAMES: Record<Channel, string> = {
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
};

export const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const DEFAULT_TIME = "18:00";

export const TEAM_NAME = "kittenhelp";

export const SESSION_DURATION_HOURS = 8;
