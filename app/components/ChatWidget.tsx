"use client";

import { useEffect } from "react";

type Props = {
    dealerId?: string | null;
    vin?: string; // Optional - for VDP pages with specific vehicle
    primaryColor?: string;
    secondaryColor?: string;
    widgetBaseUrl?: string;
};

export default function ChatWidget({
    dealerId,
    vin,
    primaryColor = "#083062",
    secondaryColor = "#B21945",
    widgetBaseUrl = process.env.NEXT_PUBLIC_WIDGET_URL || "http://localhost:3000",
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
        if (dealerId) script.setAttribute("data-dealer-id", dealerId);
        if (vin) script.setAttribute("data-vin", vin);
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
    }, [dealerId, vin, primaryColor, secondaryColor, widgetBaseUrl]);

    return null; // This component doesn't render anything visible
}
