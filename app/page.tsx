"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import EventRegistrationForm from "./components/event-registration-form";
import { useState } from "react";

// 👇 Añadimos la declaración de módulo aquí, dentro del mismo archivo
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

export default function Home() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  };

  const generateProgramPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import("jspdf");
      // @ts-ignore
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();

      // Añadir encabezado
      doc.setFillColor(245, 158, 11); // Color ámbar
      doc.rect(0, 0, 210, 40, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("REACTIVA-PETROL 2025", 105, 15, { align: "center" });
      doc.setFontSize(16);
      doc.text("PROGRAMA COMPLETO DEL EVENTO", 105, 25, { align: "center" });
      doc.setFontSize(12);
      doc.text("12-14 de Agosto, 2025 | Talara - Perú", 105, 35, {
        align: "center",
      });

      // Añadir subtítulo
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Reactivación Petrolera en la Región Piura", 105, 50, {
        align: "center",
      });

      // Día 1
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11); // Color ámbar
      doc.text("Día 1: Innovación y Tecnología", 20, 65);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("12 de Agosto, 2025", 20, 72);

      // Tabla para el día 1
      autoTable(doc, {
        startY: 75,
        head: [["Horario", "Actividad", "Ponente"]],
        body: [
          ["08:00 - 09:00", "Registro y Café de Bienvenida", ""],
          [
            "09:00 - 10:30",
            "Ceremonia de Apertura",
            "Carlos Rodríguez, CEO PetroMex Internacional",
          ],
          [
            "10:45 - 12:15",
            "Panel: Digitalización en la Industria Petrolera",
            "Varios Ponentes",
          ],
          ["12:30 - 14:00", "Almuerzo Networking", ""],
          [
            "14:15 - 15:45",
            "Conferencia: Inteligencia Artificial en Exploración",
            "Alejandro Méndez, TechOil Solutions",
          ],
          [
            "16:00 - 17:30",
            "Taller: Nuevas Tecnologías de Perforación",
            "Equipo Técnico, DrillTech",
          ],
          ["17:45 - 19:00", "Cóctel de Networking", ""],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 30 } },
      });

      // Día 2
      const finalYDay1 = doc.lastAutoTable?.finalY || 75;
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11);
      doc.text("Día 2: Sostenibilidad y Medio Ambiente", 20, finalYDay1 + 20);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("13 de Agosto, 2025", 20, finalYDay1 + 27);

      // Tabla para el día 2
      autoTable(doc, {
        startY: finalYDay1 + 30,
        head: [["Horario", "Actividad", "Ponente"]],
        body: [
          ["08:30 - 09:00", "Café de Bienvenida", ""],
          [
            "09:00 - 10:30",
            "Conferencia: Reducción de Emisiones en Operaciones",
            "Hugo G. Pelliza, YPF Argentina",
          ],
          [
            "10:45 - 12:15",
            "Panel: Estrategias ESG en el Sector Petrolero",
            "Varios Ponentes",
          ],
          ["12:30 - 14:00", "Almuerzo Networking", ""],
          [
            "14:15 - 15:45",
            "Taller: Certificaciones Ambientales",
            "Equipo de Certificación, EcoOil",
          ],
          [
            "16:00 - 17:30",
            "Conferencia: Economía Circular en la Industria",
            "Laura Vázquez, ALAP",
          ],
          ["17:45 - 19:00", "Cena de Gala (Solo para VIP)", ""],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 30 } },
      });

      // Día 3
      const finalYDay2 = doc.lastAutoTable?.finalY || finalYDay1 + 30;
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11);
      doc.text("Día 3: Mercados y Regulación", 20, finalYDay2 + 20);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("14 de Agosto, 2025", 20, finalYDay2 + 27);

      // Tabla para el día 3
      autoTable(doc, {
        startY: finalYDay2 + 30,
        head: [["Horario", "Actividad", "Ponente"]],
        body: [
          ["08:30 - 09:00", "Café de Bienvenida", ""],
          [
            "09:00 - 10:30",
            "Conferencia: Tendencias del Mercado Global",
            "Analista Senior, PetroMarket",
          ],
          [
            "10:45 - 12:15",
            "Panel: Regulación y Políticas Energéticas",
            "Representantes Gubernamentales",
          ],
          ["12:30 - 14:00", "Almuerzo Networking", ""],
          [
            "14:15 - 15:45",
            "Taller: Estrategias de Inversión en el Sector",
            "Consultores, Energy Capital",
          ],
          [
            "16:00 - 17:00",
            "Conferencia de Clausura",
            "Director General, Ministerio de Energía",
          ],
          ["17:00 - 18:00", "Ceremonia de Clausura y Despedida", ""],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 30 } },
      });

      // Añadir pie de página
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Página ${i} de ${pageCount} - Reactiva-Petrol 2025: Reactivación Petrolera en la Región Piura`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Guardar el PDF
      doc.save("Programa_ReactivaPetrol2025.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(
        "Hubo un error al generar el PDF. Por favor, inténtelo de nuevo más tarde."
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12 overflow-hidden rounded-full border-2 border-amber-400 shadow-md">
              <Image
                src="/oil-pump-logo.png"
                alt="Reactiva-Petrol 2025 Logo"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              Reactiva-Petrol <span className="text-amber-600">2025</span>
            </span>
          </div>
          <div>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 min-h-[40px] touch-manipulation"
              onClick={() => scrollToSection("inscripciones-evento")}
            >
              <span className="hidden sm:inline">
                ADQUIERE TUS TICKETS AL EVENTO
              </span>
              <span className="sm:hidden">TICKETS</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-x-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-petroleum.png"
            alt="Plataforma petrolera"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="container mx-auto relative z-10 py-12 sm:py-20 md:py-32 lg:py-40 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-3xl space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-block rounded-lg bg-amber-600 px-3 py-1 text-xs sm:text-sm text-white">
                12-14 de Agosto, 2025 | Talara - Perú
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                Congreso Internacional:{" "}
                <span className="text-amber-500">Reactivación Petrolera</span>{" "}
                en las Regiones Piura Y Tumbes
              </h1>
              <p className="text-base sm:text-xl text-gray-300">
                Impulsando las Operaciones Offshore y OnShore en Cuencas Talara
                y Tumbes. El evento más importante del sector petrolero. Tres
                días de conferencias, networking y exposiciones con los líderes
                de la industria.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto min-h-[48px] touch-manipulation text-base font-semibold"
                  onClick={() => scrollToSection("inscripciones-evento")}
                >
                  Inscríbete Ahora
                </Button>
              </div>
            </div>

            {/* Promotional Image */}
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="max-w-xl sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl w-full">
                <Image
                  src="flyer_horizontal.webp"
                  alt="Congreso Internacional Reactivación Petrolera en la Región Piura - 12 al 14 Agosto 2025 - Hotel Pacifico Talara"
                  width={1600}
                  height={1200}
                  className="w-full h-auto rounded-lg shadow-lg border-2 border-amber-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inscripciones al Evento Petrolero 2025 */}
      <section
        id="inscripciones-evento"
        className="py-12 sm:py-16 bg-green-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
              ADQUIERE TU TICKET AL EVENTO PETROLERO DEL 2025 DESDE AQUI
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
              Regístrate para participar en el evento más importante del sector
              petrolero en la región.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg border border-gray-200">
              <EventRegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full border-2 border-amber-400 shadow-md">
                  <Image
                    src="/oil-pump-logo.png"
                    alt="Reactiva-Petrol 2025 Logo"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  Reactiva-Petrol <span className="text-amber-500">2025</span>
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                El evento más importante del sector petrolero en Latinoamérica.
                Impulsando las operaciones offshore y onshore en las cuencas
                Talara y Tumbes.
              </p>
            </div>

            {/* Información del evento */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">
                Información del Evento
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Fecha:</p>
                  <p className="text-white text-sm">12-14 de Agosto, 2025</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Lugar:</p>
                  <p className="text-white text-sm">
                    Centro de Convenciones Hotel Pacifico
                  </p>
                  <p className="text-gray-400 text-xs">
                    Av. Aviación 441, Talara - Perú
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Horario:</p>
                  <p className="text-white text-sm">8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">
                Contacto
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Inscripciones e Información:
                  </p>
                  <div className="space-y-1">
                    <p className="text-white text-sm">945 709 570</p>
                    <p className="text-white text-sm">933 685 901</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Email:</p>
                  <a
                    href="mailto:info@reactivapetrol.online"
                    className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                  >
                    info@reactivapetrol.online
                  </a>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">WhatsApp:</p>
                  <a
                    href="https://wa.me/51945709570"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                  >
                    +51 945 709 570
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-center sm:text-left text-gray-400 text-sm">
                © 2025 Reactiva-Petrol. Todos los derechos reservados.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs">
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Términos y Condiciones
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Política de Privacidad
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a
        href="whatsapp://send?phone=51945709570&text=Hola,%20estoy%20interesado%20en%20el%20evento%20Reactiva-Petrol%202025.%20¿Podrían%20brindarme%20más%20información?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </a>
    </div>
  );
}
