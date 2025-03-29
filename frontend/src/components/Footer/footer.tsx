"use client";

import InfoFooter from "./infoFooter";
import SubscribeNewsletter from "./subscribeNewsletter";

export default function Footer() {
  return (
    <footer className="px-[120px] bg-[#f5f5f5]">
      <SubscribeNewsletter />
      <InfoFooter />
    </footer>
  );
}
