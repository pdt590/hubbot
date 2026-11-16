import { useSyncExternalStore } from "react";
import type { LocaleKey } from "@/locales";

/** The 16 Vietnamese apps from PROPOSAL.md. None of them has a connector yet: Connect only opens the sign-in page. */
export interface VietApp {
  /** Names the app's copy: `apps.viet.route.<id>`. */
  id: string;
  /** Product name, never translated; it also keys the app's connection in storage. */
  label: string;
  /** Sign-in page opened by Connect. */
  url: string;
  /** Logo file, when the app's own site publishes one. */
  logo?: string;
  /** Site whose favicon is the logo, as the catalog does for apps without a logo. Null: no official site to take one from. */
  domain: string | null;
}

export const VIET_APPS: readonly VietApp[] = [
  { id: "zalo", label: "Zalo Web", url: "https://chat.zalo.me", domain: "chat.zalo.me" },
  { id: "telegram", label: "Telegram", url: "https://web.telegram.org/k/", domain: "web.telegram.org" },
  { id: "tiktok", label: "TikTok (Kênh & TikTok Studio)", url: "https://www.tiktok.com", domain: "tiktok.com" },
  { id: "tiktokShop", label: "TikTok Shop Seller VN", url: "https://seller-vn.tiktok.com", domain: "seller-vn.tiktok.com" },
  { id: "tiktokAffiliate", label: "TikTok Affiliate Center", url: "https://affiliate.tiktok.com", domain: "affiliate.tiktok.com" },
  { id: "shopee", label: "Shopee Kênh Người Bán", url: "https://banhang.shopee.vn", domain: "shopee.vn" },
  { id: "lazada", label: "Lazada Seller Center", url: "https://sellercenter.lazada.vn", domain: "sellercenter.lazada.vn" },
  { id: "meta", label: "Meta Business Suite", url: "https://business.facebook.com", domain: "business.facebook.com" },
  { id: "lark", label: "Lark Suite & Lark Base", url: "https://www.larksuite.com", domain: "larksuite.com" },
  { id: "kalodata", label: "Kalodata Việt Nam", url: "https://kalodata.com", domain: "kalodata.com" },
  { id: "pancake", label: "Pancake Đa Kênh", url: "https://pancake.vn", domain: "pancake.vn" },
  { id: "kiotviet", label: "KiotViet Quản lý", url: "https://www.kiotviet.vn", domain: "kiotviet.vn" },
  { id: "thuvienphapluat", label: "Thư viện Pháp luật", url: "https://thuvienphapluat.vn", domain: "thuvienphapluat.vn" },
  { id: "vietqr", label: "VietQR", url: "https://vietqr.io", domain: "vietqr.io" },
  { id: "sepay", label: "SePay", url: "https://sepay.vn", domain: "sepay.vn" },
  { id: "hoadon", label: "Hóa đơn Điện tử Thuế", url: "https://hoadondientu.gdt.gov.vn", domain: "hoadondientu.gdt.gov.vn", logo: "https://hoadondientu.gdt.gov.vn/static/images/logo_login.svg" },
];

/** The integration route from PROPOSAL.md section 3, in the reader's language. */
export function vietRouteKey(app: VietApp): LocaleKey {
  return `apps.viet.route.${app.id}` as LocaleKey;
}

const CONNECTED_KEY = "ogb.vietApps.connected";
const listeners = new Set<() => void>();
let current: readonly string[] | null = null;

/** Labels of the apps whose page the built-in browser opened. Kept only in this browser; an unreadable store means
 * none. */
export function readVietConnected(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CONNECTED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((label): label is string => typeof label === "string") : [];
  } catch {
    return [];
  }
}

/** Marks one app connected or not, re-reading the store first: the browser opens the page after the Apps pop-up has
 * closed, so the caller may hold no current list. Every view showing the list updates. */
export function setVietConnected(label: string, connected: boolean): void {
  const next = readVietConnected().filter((item) => item !== label);
  if (connected) next.push(label);
  try {
    localStorage.setItem(CONNECTED_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: the views still show the change until the app reloads.
  }
  current = next;
  for (const listener of listeners) listener();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const snapshot = () => (current ??= readVietConnected());

/** The connected apps' labels, re-rendering on every connect and disconnect. */
export function useVietConnected(): readonly string[] {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
