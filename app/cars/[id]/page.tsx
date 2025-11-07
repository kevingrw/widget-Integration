import Link from "next/link";
import { notFound } from "next/navigation";
import cars from "../../data/cars";
import AskAIButton from "../../components/AskAIButton";

type Props = { params: Promise<{ id: string }> };

export default async function CarPage({ params }: Props) {
    const { id } = await params;
    const car = cars.find((c: any) => c.id === id);
    if (!car) return notFound();

    console.log("Car data:", {
        id: car.id,
        dealer_id: car.dealer_id,
        vin: car.vin,
        hasStore: !!car.store,
        storeKeys: car.store ? Object.keys(car.store) : []
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{car.year} {car.make} {car.model}</h1>
                    <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-300">Back to inventory</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border dark:border-zinc-800">
                        {car.photos && car.photos.length > 0 ? (
                            <img src={car.photos[0]} alt={`${car.make} ${car.model}`} className="w-full h-96 object-cover" />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center text-zinc-400">No image</div>
                        )}

                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-medium">{car.store?.name}</div>
                                    <div className="text-sm text-zinc-500">{car.store?.address?.street_number} {car.store?.address?.street_name}, {car.store?.address?.city}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-semibold">{car.price && car.price !== "$0.00" ? car.price : (car.msrp || 'Contact for price')}</div>
                                    <div className="text-sm text-zinc-500">{car.drive_train_desc || ''} · {car.transmission || ''}</div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">{car.description}</p>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium">Key info</h3>
                                <ul className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 space-y-1">
                                    <li>VIN: {car.vin}</li>
                                    <li>Mileage: {car.odometer ? `${car.odometer} miles` : '—'}</li>
                                    <li>Engine: {car.engine} {car.engine_displacement ? `· ${car.engine_displacement}L` : ''}</li>
                                    <li>Fuel: {car.fuel || '—'}</li>
                                    <li>Exterior: {car.exterior_color || '—'}</li>
                                    <li>Interior: {car.interior_color || '—'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-800">
                            <h4 className="text-sm font-medium">Features</h4>
                            <ul className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 space-y-1 max-h-64 overflow-auto">
                                {(car.features || []).map((f: string, i: number) => (
                                    <li key={i} className="">• {f}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-800">
                            <h4 className="text-sm font-medium">More photos</h4>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {(car.photos || []).slice(0, 9).map((p: string, i: number) => (
                                    <img key={i} src={p} alt={`${car.make} ${car.model} ${i + 1}`} className="h-20 w-full object-cover rounded" />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-800">
                            <h4 className="text-sm font-medium">Actions</h4>
                            <div className="mt-3 flex flex-col gap-2">
                                <a href={car.photos && car.photos[0] ? car.photos[0] : '#'} target="_blank" rel="noreferrer" className="block text-center bg-black text-white px-3 py-2 rounded">View Primary Photo</a>
                                <button className="block w-full text-center border border-gray-200 px-3 py-2 rounded">Contact dealer</button>
                                {/* ASK AI widget trigger - using VIN for single-store mode */}
                                <AskAIButton
                                    dealerId={car.dealer_id || car.store?.public_key || car.store?.id || car.store?.dealer_id || "MP2227"}
                                    vin={car.vin}
                                    storeMode="single-store"
                                    widgetBaseUrl={process.env.NEXT_PUBLIC_WIDGET_URL || "http://localhost:3000"}
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
