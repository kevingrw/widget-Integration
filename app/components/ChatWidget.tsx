"use client";

import { useEffect } from "react";

type Props = {
    dealerId?: string | null;
    apiKey?: string;
    primaryColor?: string;
    secondaryColor?: string;
    widgetBaseUrl?: string;
};

export default function ChatWidget({
    dealerId,
    apiKey = "GnsBqGI0OjOCwPL4Ps9F",
    primaryColor = "#083062",
    secondaryColor = "#B21945",
    widgetBaseUrl = "http://localhost:3000",
}: Props) {
    useEffect(() => {
        // Check if script already exists
        const existingScript = document.getElementById("drive-point-chat-widget-script");
        if (existingScript) return;

        // Create and configure the script
        const script = document.createElement("script");
        script.id = "drive-point-chat-widget-script";
        script.src = `${widgetBaseUrl}/drive-point-chat-widget.js`;
        script.async = true;
        script.setAttribute("data-drive-point-chat", "");
        script.setAttribute("data-api-url", "https://api.drivepointautogroup.com/api/v1");
        script.setAttribute("data-api-key", apiKey);
        script.setAttribute("data-websocket-url", "wss://api.drivepointautogroup.com");
        if (dealerId) script.setAttribute("data-dealer-id", dealerId);
        script.setAttribute("data-primary-color", primaryColor);
        script.setAttribute("data-secondary-color", secondaryColor);
        script.setAttribute("data-placeholder", "Ask me anything...");

        script.onload = () => {
            console.log("DrivePoint chat widget loaded successfully");
        };

        script.onerror = () => {
            console.error("Failed to load DrivePoint chat widget script");
        };

        document.body.appendChild(script);

        // Cleanup function
        return () => {
            const scriptToRemove = document.getElementById("drive-point-chat-widget-script");
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, [dealerId, apiKey, primaryColor, secondaryColor, widgetBaseUrl]);

    return null; // This component doesn't render anything visible
}
