import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function InscriptionHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-amber-200 shadow-sm">
              <Image
                src="/petro-summit-logo.png"
                alt="PetroSummit 2025 Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              PetroSummit <span className="text-amber-600">2025</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-amber-600 transition-colors">
            Inicio
          </Link>
          <Link href="/#acerca" className="text-sm font-medium hover:text-amber-600 transition-colors">
            Acerca del Evento
          </Link>
          <Link href="/#agenda" className="text-sm font-medium hover:text-amber-600 transition-colors">
            Agenda
          </Link>
          <Link href="/inscripciones" className="text-sm font-medium text-amber-600 transition-colors">
            Inscripciones
          </Link>
        </nav>
        <div>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/inscripciones/registro">Inscríbete Ahora</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
