"use client";

import { useEffect, useState } from "react";

type Props = {
    dealerId?: string | null;
    vehicleId?: string; // Optional - for multi-store (Drive Point main site)
    vin?: string; // Optional - for single-store VDP, used when stores don't have access to centralized vehicle UUIDs
    apiKey?: string;
    primaryColor?: string;
    secondaryColor?: string;
    // If preload is true the widget script is injected when the component mounts
    preload?: boolean;
    // Base URL for the widget server (e.g., http://localhost:3000)
    widgetBaseUrl?: string;
};

export default function AskAIButton({
    dealerId,
    vehicleId,
    vin,
    apiKey = "GnsBqGI0OjOCwPL4Ps9F",
    primaryColor = "#083062",
    secondaryColor = "#B21945",
    preload = true,
    widgetBaseUrl = process.env.NEXT_PUBLIC_WIDGET_URL || "http://localhost:3000",
}: Props) {
    const [loading, setLoading] = useState(false);

    // Try to open the widget using several heuristics. Returns true if we triggered an open action.
    const tryOpenOnce = (): boolean => {
        try {
            const w = window as any;
            // Preferred explicit widget API
            if (w.DrivePointChatWidget && typeof w.DrivePointChatWidget.open === "function") {
                // Pass VIN for single-store mode, vehicleId for multi-store mode
                w.DrivePointChatWidget.open(vin || vehicleId || "");
                return true;
            }
            if (w.drivePointChat && typeof w.drivePointChat.open === "function") {
                w.drivePointChat.open();
                return true;
            }
            if (w.DrivePointChat && typeof w.DrivePointChat.open === "function") {
                w.DrivePointChat.open();
                return true;
            }
            if (w.drivePointChat && typeof w.drivePointChat.show === "function") {
                w.drivePointChat.show();
                return true;
            }
            if (typeof w.openDrivePointChat === "function") {
                w.openDrivePointChat();
                return true;
            }

            const selectors = [
                'button[aria-label*="chat"]',
                'button[aria-label*="Chat"]',
                '.drive-point-chat-toggle',
                '.dp-chat-toggle',
                '.drivepoint-chat-toggle',
                '.chat-widget-toggle',
                '.dp-widget-toggle',
            ];

            for (const sel of selectors) {
                const el = document.querySelector(sel) as HTMLElement | null;
                if (el) {
                    el.click();
                    return true;
                }
            }

            const iframe = document.querySelector('iframe[src*="drivepoint"]') as HTMLIFrameElement | null;
            if (iframe) {
                iframe.focus();
                return true;
            }

            document.dispatchEvent(new CustomEvent("drive-point-chat-open"));
        } catch (e) {
            // ignore
        }
        return false;
    };

    const openWithRetries = () => {
        if (tryOpenOnce()) return;
        let attempts = 0;
        const maxAttempts = 12;
        const interval = setInterval(() => {
            attempts += 1;
            if (tryOpenOnce() || attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 250);
    };

    // Inject or update the widget script. Used for both preload and explicit click fallback.
    const ensureScript = (opts: { replace?: boolean } = {}) => {
        const existing = document.getElementById("drive-point-chat-widget-script") as HTMLScriptElement | null;
        if (existing) {
            // Update attributes in-place so widget has the correct context.
            if (apiKey) existing.setAttribute("data-api-key", apiKey);
            existing.setAttribute("data-api-url", process.env.NEXT_PUBLIC_API_URL || "https://api.drivepointautogroup.com/api/v1");
            existing.setAttribute("data-websocket-url", process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://api.drivepointautogroup.com");
            if (dealerId) existing.setAttribute("data-dealer-id", dealerId);
            else existing.removeAttribute("data-dealer-id");
            // For multi-store mode, use vehicle_id
            if (vehicleId) existing.setAttribute("data-vehicle-id", vehicleId);
            else existing.removeAttribute("data-vehicle-id");
            // For single-store mode, use VIN
            if (vin) existing.setAttribute("data-vin", vin);
            else existing.removeAttribute("data-vin");
            existing.setAttribute("data-primary-color", primaryColor);
            existing.setAttribute("data-secondary-color", secondaryColor);
            existing.setAttribute("data-placeholder", "Ask me anything...");
            existing.setAttribute("data-store-mode","single-store", );

            if (opts.replace) {
                existing.remove();
            } else {
                return existing;
            }
        }

        const s = document.createElement("script");
        s.id = "drive-point-chat-widget-script";
        s.src = `${widgetBaseUrl}/drive-point-chat-widget.js`;
        s.async = true;
        s.setAttribute("data-drive-point-chat", "");
        s.setAttribute("data-api-url", process.env.NEXT_PUBLIC_API_URL || "https://api.drivepointautogroup.com/api/v1");
        s.setAttribute("data-api-key", apiKey);
        s.setAttribute("data-websocket-url", process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://api.drivepointautogroup.com");
        if (dealerId) s.setAttribute("data-dealer-id", dealerId);
        // For multi-store mode, use vehicle_id
        if (vehicleId) s.setAttribute("data-vehicle-id", vehicleId);
        // For single-store mode, use VIN
        if (vin) s.setAttribute("data-vin", vin);
        s.setAttribute("data-primary-color", primaryColor);
        s.setAttribute("data-secondary-color", secondaryColor);
        s.setAttribute("data-placeholder", "Ask me anything...");
        s.setAttribute("data-store-mode","single-store", );

        s.onload = () => {
            // After the script loads, attempt to open the widget (use retries to handle async init)
            openWithRetries();
        };

        s.onerror = () => {
            // eslint-disable-next-line no-console
            console.error("Failed to load DrivePoint chat widget script");
        };

        document.body.appendChild(s);
        return s;
    };

    useEffect(() => {
        if (!preload) return;
        // Preload the widget script when the component mounts so the widget is initialized
        // and ready to open when the user clicks. We don't force-open here; the click
        // handler triggers openWithRetries.
        try {
            ensureScript({ replace: false });
        } catch (e) {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId, vehicleId, vin, preload]);

    const handleClick = () => {
        setLoading(true);

        const existing = document.getElementById("drive-point-chat-widget-script") as HTMLScriptElement | null;
        if (existing) {
            // update attributes in case dealer/vehicle changed
            ensureScript({ replace: false });
            // try to open immediately (with retries)
            // Try explicit API first
            const w = window as any;
            if (w.DrivePointChatWidget && typeof w.DrivePointChatWidget.open === "function") {
                try {
                    // Pass VIN for single-store mode, vehicleId for multi-store mode
                    w.DrivePointChatWidget.open(vin || vehicleId || "");
                } catch (e) {
                    // fallback to heuristics
                    openWithRetries();
                }
            } else {
                openWithRetries();
            }
            setLoading(false);
            return;
        }

        // If not present, ensureScript will append and its onload will call openWithRetries.
        ensureScript({ replace: true });
        // openWithRetries will run after load; we can also start a short retry in case
        // the script initialises quickly.
        openWithRetries();
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            data-vehicle-id={vehicleId}
            data-vin={vin}
            data-dealer-id={dealerId || undefined}
            className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded"
            aria-label="Ask AI"
        >
            {loading ? "Loading…" : "ASK AI"}
        </button>
    );
}
