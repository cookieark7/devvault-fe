import { HomeCtas } from "./Hero";
import Logo from "@/components/common/ui/Logo";

export default function HomeFooter() {
  return (
    <footer className="border-t border-border-base bg-bg-sidebar">
      <div className="max-w-[1100px] mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
          Start your vault.
        </h2>
        <p className="mt-2 text-text-secondary">
          Your snippets, your database, your server. Save the first one in under a minute.
        </p>
        <HomeCtas className="justify-center mt-6" />
      </div>
      <div className="border-t border-border-base">
        <div className="max-w-[1100px] mx-auto px-6 h-12 flex items-center justify-between text-xs text-text-tertiary">
          <span className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-semibold text-text-secondary">DevVault</span>
          </span>
          <span>Web · CLI · Chrome extension · MCP server</span>
        </div>
      </div>
    </footer>
  );
}
