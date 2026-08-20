"use client";

import { createContext, useContext } from "react";

interface MobileMenuContextValue {
  openMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue>({
  openMobileMenu: () => {},
});

export const MobileMenuProvider = MobileMenuContext.Provider;

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
