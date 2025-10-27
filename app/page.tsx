import Image from "next/image";
import Link from "next/link";
import cars from "./data/cars";

function displayPrice(car: any) {
  if (car.price && car.price !== "$0.00") return car.price;
  if (car.msrp && car.msrp !== "$0.00") return car.msrp;
  return "Contact for price";
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="Next.js" width={60} height={18} className="dark:invert" />
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Inventory ({cars.length})
            </h1>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any) => (
            <article
              key={car.id}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                {car.photos && car.photos[0] ? (
                  // use a normal img tag for external URLs to avoid Next Image domain config
                  <img
                    src={car.photos[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {car.year} {car.make} {car.model}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                      {car.series ? car.series + ' · ' : ''}
                      {car.body}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                      {displayPrice(car)}
                    </div>
                    <div className="text-sm text-zinc-500">{car.drive_train_desc || ''}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                  <div>
                    <div>{car.odometer ? `${car.odometer} miles` : ''}</div>
                    <div>{car.engine ? car.engine + ' · ' + (car.fuel || '') : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{car.store?.name}</div>
                    <div className="text-xs text-zinc-500">{car.store?.address?.city || ''}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {car.certified === 'Yes' && (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                      Certified
                    </span>
                  )}
                  {car.special_offer && (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                      Special Offer
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    className="flex-1 inline-block text-center rounded-md bg-black text-white px-3 py-2 text-sm hover:opacity-90"
                    href={car.photos && car.photos[0] ? car.photos[0] : '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Photo
                  </a>
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 inline-block text-center rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
