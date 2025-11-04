# DrivePoint Chat Widget Integration

This is a [Next.js](https://nextjs.org) project demonstrating the integration of the DrivePoint AI Chat Widget for automotive dealerships.

## 🚀 Features

- **Secure Widget Integration**: All API credentials handled server-side
- **Simple Setup**: Minimal configuration required
- **VIN Support**: Pass VIN on vehicle detail pages for context-aware conversations
- **Customizable Theming**: Brand colors and styling options
- **Two Integration Methods**:
  - `ChatWidget` component for global widget presence
  - `AskAIButton` component for specific pages (VDPs)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WIDGET_URL=https://chatwidget.drivepointautogroup.com
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Widget Integration

### Global Widget (Entire Site)

Add the `ChatWidget` component to your root layout (`app/layout.tsx`):

```tsx
import ChatWidget from "./components/ChatWidget";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				{children}
				<ChatWidget
					dealerId='YOUR_DEALER_ID'
					widgetBaseUrl={process.env.NEXT_PUBLIC_WIDGET_URL}
				/>
			</body>
		</html>
	);
}
```

### Vehicle Detail Pages (VDP)

For vehicle-specific context, pass the VIN:

```tsx
import ChatWidget from "@/app/components/ChatWidget";

export default function VehiclePage({ params }: { params: { id: string } }) {
	const vehicle = getVehicleById(params.id);

	return (
		<div>
			<h1>{vehicle.name}</h1>
			{/* Your vehicle details */}

			<ChatWidget
				dealerId='YOUR_DEALER_ID'
				vin={vehicle.vin}
				widgetBaseUrl={process.env.NEXT_PUBLIC_WIDGET_URL}
			/>
		</div>
	);
}
```

### Ask AI Button Component

Use the `AskAIButton` component on VDPs to open the widget with vehicle context:

```tsx
import AskAIButton from "@/app/components/AskAIButton";

export default function VehiclePage({ params }: { params: { id: string } }) {
	const vehicle = getVehicleById(params.id);

	return (
		<div>
			<h1>{vehicle.name}</h1>

			<AskAIButton
				dealerId='YOUR_DEALER_ID'
				vin={vehicle.vin}
				preload={true}
				widgetBaseUrl={process.env.NEXT_PUBLIC_WIDGET_URL}
			/>
		</div>
	);
}
```

## 🔧 Component API

### ChatWidget Props

| Prop             | Type             | Required | Default                 | Description                 |
| ---------------- | ---------------- | -------- | ----------------------- | --------------------------- |
| `dealerId`       | `string \| null` | ✅ Yes   | -                       | Your dealer/store ID        |
| `vin`            | `string`         | ❌ No    | -                       | Vehicle VIN for VDP pages   |
| `primaryColor`   | `string`         | ❌ No    | `#083062`               | Primary theme color (hex)   |
| `secondaryColor` | `string`         | ❌ No    | `#B21945`               | Secondary theme color (hex) |
| `widgetBaseUrl`  | `string`         | ❌ No    | `http://localhost:3000` | Widget server URL           |

### AskAIButton Props

| Prop             | Type             | Required | Default                 | Description                    |
| ---------------- | ---------------- | -------- | ----------------------- | ------------------------------ |
| `dealerId`       | `string \| null` | ✅ Yes   | -                       | Your dealer/store ID           |
| `vin`            | `string`         | ❌ No    | -                       | Vehicle VIN for VDP pages      |
| `primaryColor`   | `string`         | ❌ No    | `#083062`               | Primary theme color (hex)      |
| `secondaryColor` | `string`         | ❌ No    | `#B21945`               | Secondary theme color (hex)    |
| `preload`        | `boolean`        | ❌ No    | `true`                  | Preload widget script on mount |
| `widgetBaseUrl`  | `string`         | ❌ No    | `http://localhost:3000` | Widget server URL              |

## 🎨 Customization

You can customize the widget appearance by passing custom colors:

```tsx
<ChatWidget
	dealerId='YOUR_DEALER_ID'
	primaryColor='#FF5733'
	secondaryColor='#33FF57'
/>
```

## 🔒 Security

- **Server-Side Credentials**: All API keys and endpoints are configured server-side
- **No Client Exposure**: Widget embed code never exposes sensitive credentials
- **Secure Proxying**: All API calls routed through Next.js API routes

## 📁 Project Structure

```
app/
├── components/
│   ├── ChatWidget.tsx      # Global chat widget component
│   └── AskAIButton.tsx     # VDP-specific "Ask AI" button
├── layout.tsx              # Root layout with widget
├── page.tsx                # Home page
└── cars/
    └── [id]/
        └── page.tsx        # Vehicle detail pages
```

## Project Details

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
