// @vitest-environment happy-dom
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { en } from "@/locales";

const packs = Object.fromEntries(Object.entries(import.meta.glob<Record<string, string>>("../locales/*.json", { eager: true, import: "default" }))
  .filter(([path]) => !path.endsWith("source-hashes.json")));
import { readVietConnected, setVietConnected, useVietConnected, VIET_APPS, vietRouteKey } from "./viet-apps";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  for (const app of VIET_APPS) setVietConnected(app.label, false);
});

describe("Viet apps", () => {
  it("has copy for the chip, the no-browser notice and every app's route in every language", () => {
    const keys = ["apps.viet.chip", "apps.viet.noBrowser", ...VIET_APPS.map(vietRouteKey)] as const;
    expect(Object.keys(packs)).toHaveLength(16);
    for (const [path, pack] of Object.entries(packs)) {
      for (const key of keys) expect(pack[key], `${path}: ${key}`).toBeTruthy();
    }
    expect(en["apps.viet.chip" as keyof typeof en]).toBe("Viet apps");
  });

  it("re-renders every view on connect and disconnect, and keeps the list across reloads", async () => {
    const seen: (readonly string[])[] = [];
    const View = () => { seen.push(useVietConnected()); return null; };
    const root = createRoot(document.createElement("div"));
    await act(async () => root.render(createElement(View)));
    expect(seen.at(-1)).toEqual([]);
    await act(async () => setVietConnected("Telegram", true));
    expect(seen.at(-1)).toEqual(["Telegram"]);
    expect(readVietConnected()).toEqual(["Telegram"]);
    await act(async () => setVietConnected("Telegram", false));
    expect(seen.at(-1)).toEqual([]);
    expect(readVietConnected()).toEqual([]);
    await act(async () => root.unmount());
  });
});
