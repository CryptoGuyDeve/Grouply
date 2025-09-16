import Image from "next/image";
import Header from "@/components/Header";

export const metadata = {
  title: "Our Team – Grouplyy",
  description: "Meet the Grouplyy founding team: Crypto Aka FaizuRrehman and Fahad Bilal.",
  openGraph: {
    title: "Our Team – Grouplyy",
    description: "Meet the Grouplyy founding team: Crypto Aka FaizuRrehman and Fahad Bilal.",
    type: "website",
    url: "/team",
  },
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-16 sm:py-20 text-center gap-20">
        {/* Hero */}
        <section className="w-full max-w-6xl">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-3 bg-black text-white rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Meet the builders behind Grouplyy</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-black leading-[0.95]">
              Small team.
              <br />
              <span className="relative">
                Big impact.
                <div className="absolute -bottom-3 left-0 w-full h-2 bg-black rounded-full" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-light">
              We move fast, ship often, and obsess over great experiences.
            </p>
          </div>
        </section>

        {/* Members */}
        <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Member 1 */}
          <article className="rounded-3xl border-2 border-black bg-white p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-black flex-shrink-0">
                <Image src="/grouplypng.png" alt="Crypto Aka FaizuRrehman" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black">Crypto Aka FaizuRrehman</h2>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-xs font-bold">CEO</span>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-xs font-bold">Founder</span>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-xs font-bold">Developer</span>
                </div>
                <p className="mt-2 text-gray-700">Age 16 • Pakistan</p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Vision-led builder focused on performance, security, and a clean user experience.
                  Drives product strategy and ships core features at speed.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['TypeScript','Next.js','Convex','Stream Chat','Tailwind','UI/UX'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Member 2 */}
          <article className="rounded-3xl border-2 border-black bg-white p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-black flex-shrink-0">
                <Image src="/grouplypng.png" alt="Fahad Bilal" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black">Fahad Bilal</h2>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-xs font-bold">Co‑Founder</span>
                </div>
                <p className="mt-2 text-gray-700">~15 • Lahore, Pakistan (near FaizuRrehman)</p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Product-minded collaborator and best bro. Keeps momentum high with rapid prototyping,
                  feedback loops, and community engagement.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Community','Product','QA','Support','Docs'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Story / Timeline */}
        <section className="w-full max-w-6xl text-left space-y-8">
          <h3 className="text-3xl sm:text-4xl font-black text-black">Our Story</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <p className="text-sm text-gray-500">2024 → Early 2025</p>
              <h4 className="mt-2 font-bold">Idea to MVP</h4>
              <p className="mt-2 text-gray-700">Built the first version of Grouplyy with a focus on speed and simplicity.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <p className="text-sm text-gray-500">2025</p>
              <h4 className="mt-2 font-bold">Desktop Experience</h4>
              <p className="mt-2 text-gray-700">Launched a modern desktop app look with powerful chat & video.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <p className="text-sm text-gray-500">Next</p>
              <h4 className="mt-2 font-bold">Community & Growth</h4>
              <p className="mt-2 text-gray-700">Expanding features and listening closely to our users.</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="w-full max-w-6xl text-left space-y-6">
          <h3 className="text-3xl sm:text-4xl font-black text-black">Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {t:'Speed',d:'Ship fast, iterate faster.'},
              {t:'Quality',d:'Polished UX and reliable infra.'},
              {t:'Respect',d:'Community-first, privacy-first.'},
            ].map(v => (
              <div key={v.t} className="rounded-2xl border border-gray-200 p-6 bg-white">
                <h4 className="font-bold">{v.t}</h4>
                <p className="mt-2 text-gray-700">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="w-full max-w-5xl">
          <div className="rounded-3xl border-2 border-black bg-white p-10 sm:p-16 text-center shadow-2xl">
            <h3 className="text-3xl sm:text-5xl font-black text-black">Join our journey</h3>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">We’re building the future of group collaboration. Follow our updates and say hi.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="/" className="px-8 py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition">Home</a>
              <a href="/dashboard" className="px-8 py-4 rounded-2xl border-2 border-black text-black hover:bg-black hover:text-white font-bold transition">Open App</a>
            </div>
          </div>
        </section>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Grouplyy',
              url: 'https://grouplyy.app/team',
              member: [
                {
                  '@type': 'Person',
                  name: 'Crypto Aka FaizuRrehman',
                  jobTitle: 'CEO, Founder, Developer',
                  address: { '@type': 'PostalAddress', addressCountry: 'PK' },
                  image: 'https://grouplyy.app/grouplypng.png',
                  description: 'Age 16, based in Pakistan.'
                },
                {
                  '@type': 'Person',
                  name: 'Fahad Bilal',
                  jobTitle: 'Co-Founder',
                  address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
                  image: 'https://grouplyy.app/grouplypng.png',
                  description: 'Age ~15, lives near FaizuRrehman in Lahore. Best bros.'
                }
              ]
            })
          }}
        />
      </main>

      <footer className="w-full bg-white border-t-2 border-black mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Grouplyy</p>
        </div>
      </footer>
    </div>
  );
}


