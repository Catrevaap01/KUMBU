"use client";

import { useEffect, useState } from "react";
import { KubikaAppIcon } from "./KubikaLogo";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Registar Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Verificar atualizações do SW periodicamente
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.debug("KUBIKA PWA: Nova versão pronta.");
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.debug("PWA Service Worker registration status:", err);
          });
      });
    }

    // 2. Detetar status online/offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // 3. Detetar se já está rodando em modo PWA standalone
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    // 4. Capturar evento de instalação nativo
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const dismissed = localStorage.getItem("kubika_pwa_install_dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      // Re-exibir após 5 dias se foi dispensado
      const fiveDays = 5 * 24 * 60 * 60 * 1000;
      if (!dismissedTime || Date.now() - dismissedTime > fiveDays) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    try {
      localStorage.setItem("kubika_pwa_install_dismissed", Date.now().toString());
    } catch {}
  };

  return (
    <>
      {/* Aviso de Offline */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D] text-white text-xs font-medium py-2 px-4 text-center border-b border-amber-500/50 flex items-center justify-center gap-2"
        >
          <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Modo Offline: Sem ligação à internet. A carregar dados locais armazenados.</span>
        </aside>
      )}

      {/* Banner de Instalação Mobile PWA */}
      {showInstallBanner && deferredPrompt && (
        <aside
          role="region"
          aria-label="Instalar Aplicação"
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl transition-all animate-fade-up"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <KubikaAppIcon className="size-11 rounded-xl shadow-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink-950 truncate">
                Instalar Aplicação KUBIKA
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-1">
                Acesso rápido, offline e cotação direta no seu telemóvel.
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#15803d] transition active:scale-95"
              >
                Instalar
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-slate-600 hover:text-ink-900 hover:bg-mist transition"
              >
                <span className="text-xs font-bold px-1">✕</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
