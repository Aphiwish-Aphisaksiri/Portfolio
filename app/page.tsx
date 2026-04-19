import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import ParticleBackground from "@/components/ui/ParticleWrapper";

export default function Home() {
  return (
    <>
      {/* Particle background — fixed, behind everything */}
      <ParticleBackground />

      {/* Navigation */}
      <Nav />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Aphiwish Aphisaksiri. Built with
            Next.js.
          </p>
        </div>
      </footer>
    </>
  );
}
