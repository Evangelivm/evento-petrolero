import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

// Función para generar PDF
function generatePDF(data: any) {
  const doc = new jsPDF()

  // Configurar colores
  const greenColor = [34, 197, 94] as [number, number, number]
  const darkGreenColor = [21, 128, 61] as [number, number, number]
  const grayColor = [107, 114, 128] as [number, number, number]

  // Header con fondo verde
  doc.setFillColor(...greenColor)
  doc.rect(0, 0, 210, 40, "F")

  // Título principal
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("REACTIVA-PETROL 2025", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Reactivación Petrolera en la Región Piura", 105, 30, { align: "center" })

  // Información del evento
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("CONFIRMACIÓN DE INSCRIPCIÓN", 105, 55, { align: "center" })

  // Línea separadora
  doc.setDrawColor(...darkGreenColor)
  doc.setLineWidth(1)
  doc.line(20, 65, 190, 65)

  // Información del participante
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("INFORMACIÓN DEL PARTICIPANTE", 20, 80)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  let yPos = 90
  doc.text(`Código de Inscripción: ${data.codigo}`, 20, yPos)
  yPos += 7

  if (data.nombre) {
    doc.text(`Nombre: ${data.nombre}`, 20, yPos)
    yPos += 7
  }

  if (data.telefono) {
    doc.text(`Teléfono: ${data.telefono}`, 20, yPos)
    yPos += 7
  }

  doc.text(`Tipo de Participante: ${data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1)}`, 20, yPos)
  yPos += 7

  if (data.ruc) {
    doc.text(`RUC: ${data.ruc}`, 20, yPos)
    yPos += 7
  }

  if (data.email) {
    doc.text(`Email: ${data.email}`, 20, yPos)
    yPos += 7
  }

  // Si es tipo especial, mostrar información de las personas
  if (data.personas && data.personas.length > 0) {
    yPos += 10
    doc.setFont("helvetica", "bold")
    doc.text("PERSONAS REGISTRADAS", 20, yPos)
    doc.setFont("helvetica", "normal")

    data.personas.forEach((persona: any, index: number) => {
      if (persona.nombre && persona.telefono) {
        yPos += 10
        doc.text(`Persona ${index + 1}:`, 20, yPos)
        yPos += 5
        doc.text(`  Nombre: ${persona.nombre}`, 25, yPos)
        yPos += 5
        doc.text(`  Teléfono: ${persona.telefono}`, 25, yPos)
      }
    })
  }

  // Información del evento
  yPos += 15
  doc.setFont("helvetica", "bold")
  doc.text("INFORMACIÓN DEL EVENTO", 20, yPos)

  doc.setFont("helvetica", "normal")
  yPos += 10
  doc.text("Fecha: 12-14 Agosto, 2025", 20, yPos)
  yPos += 7
  doc.text("Lugar: Barrio Particular, Av. Aviación 441, Talara 20811", 20, yPos)
  yPos += 7
  doc.text("Horario: 8:00 AM - 6:00 PM", 20, yPos)

  // Estado de la inscripción
  yPos += 15
  doc.setFont("helvetica", "bold")
  doc.text("ESTADO DE LA INSCRIPCIÓN", 20, yPos)

  doc.setFont("helvetica", "normal")
  yPos += 10
  doc.setTextColor(...greenColor)

  const specialTypes = ["organizador", "expositor", "patrocinador", "auspiciador", "media-partner"]
  if (specialTypes.includes(data.tipo)) {
    doc.text("✓ REGISTRADO - PENDIENTE DE VALIDACIÓN", 20, yPos)
  } else {
    doc.text("✓ REGISTRADO - PENDIENTE DE PAGO", 20, yPos)
  }

  doc.setTextColor(0, 0, 0)

  // Instrucciones importantes
  yPos += 20
  doc.setFont("helvetica", "bold")
  doc.text("INSTRUCCIONES IMPORTANTES", 20, yPos)

  const instrucciones = specialTypes.includes(data.tipo)
    ? [
        "• Su inscripción debe ser validada por el administrador",
        "• Recibirá confirmación por email una vez aprobada",
        "• Conserve este documento como comprobante",
        "• Para consultas: info@reactivapetrol.online",
      ]
    : [
        "• Complete el proceso de pago para confirmar su participación",
        "• Use el código de inscripción como referencia",
        "• Conserve este documento como comprobante",
        "• Para consultas: info@reactivapetrol.online",
      ]

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  instrucciones.forEach((instruccion) => {
    yPos += 8
    doc.text(instruccion, 20, yPos)
  })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.text("© 2025 Reactiva-Petrol. Todos los derechos reservados.", 105, 280, { align: "center" })

  return doc.output("blob")
}

export async function POST(request: NextRequest) {
  try {
    console.log("API de email llamada")

    const data = await request.json()
    console.log("Datos recibidos:", data)

    // Generar PDF
    const pdfBlob = generatePDF(data)

    // Determinar el tipo de inscripción
    const specialTypes = ["organizador", "expositor", "patrocinador", "auspiciador", "media-partner"]
    const isSpecialType = specialTypes.includes(data.tipo)

    // Simular envío de email (en producción real, aquí iría nodemailer)
    console.log("Simulando envío de email a:", data.email)
    console.log("Tipo de inscripción:", isSpecialType ? "Especial" : "Regular")

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Inscripción procesada exitosamente. El correo de confirmación será enviado en breve.",
      codigo: data.codigo,
      emailSimulated: true,
      pdfGenerated: true,
    })
  } catch (error) {
    console.error("Error procesando inscripción:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la inscripción",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
