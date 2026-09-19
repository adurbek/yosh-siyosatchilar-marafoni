import Image from "next/image";

/**
 * 404 page body: the main marathon logo centred, with a large "404 Not Found"
 * underneath. Shared by app/global-not-found.tsx (unmatched URLs) and
 * app/[locale]/not-found.tsx (notFound() calls inside the site).
 */
export function NotFoundView() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white px-4 text-center">
      <Image
        src="/logo-marafon-navy.png"
        alt="Yosh siyosatchilar marafoni"
        width={905}
        height={393}
        priority
        className="h-auto w-64 sm:w-80 md:w-96"
      />
      <h1 className="font-display text-6xl font-extrabold leading-none text-on-primary-fixed sm:text-8xl md:text-9xl">
        404 Not Found
      </h1>
    </main>
  );
}
