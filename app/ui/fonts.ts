import LocalFont from "next/font/local";
import { Nunito } from "next/font/google";

export const anonymous = LocalFont({
  src: "AnonymousPro.ttf",
  display: "swap",
  preload: true,
});

export const changaone = LocalFont({
  src: "ChangaOne.ttf",
  display: "swap",
  preload: true,
});

export const nunito = Nunito({
  display: "swap",
  preload: true,
});
