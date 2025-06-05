"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Persona {
  nombre: string;
  telefono: string;
}

interface FormData {
  tipoParticipante: string;
  nombre: string;
  telefono: string;
  ruc: string;
  email: string;
  personas: Persona[];
  terminosCondiciones: boolean;
}

export default function EventRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipoParticipante: "",
    nombre: "",
    telefono: "",
    ruc: "",
    email: "",
    personas: Array(5)
      .fill(null)
      .map(() => ({ nombre: "", telefono: "" })),
    terminosCondiciones: false,
  });

  const isInstitucion =
    formData.tipoParticipante === "instituciones" ||
    formData.tipoParticipante === "empresas";

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.tipoParticipante) {
      return "Por favor seleccione el tipo de participante.";
    }

    if (isInstitucion) {
      if (!formData.nombre || formData.nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }
      if (!formData.telefono || !/^\d{9}$/.test(formData.telefono)) {
        return "El teléfono debe tener exactamente 9 dígitos.";
      }
      if (!formData.ruc || formData.ruc.length !== 12) {
        return "El RUC debe tener exactamente 12 dígitos.";
      }
      if (!formData.email || !formData.email.includes("@")) {
        return "Por favor ingrese un correo electrónico válido.";
      }
    } else {
      if (!formData.nombre || formData.nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }
      if (!formData.telefono || !/^\d{9}$/.test(formData.telefono)) {
        return "El teléfono debe tener exactamente 9 dígitos.";
      }
      if (!formData.email || !formData.email.includes("@")) {
        return "Por favor ingrese un correo electrónico válido.";
      }
    }

    if (!formData.terminosCondiciones) {
      return "Debe aceptar los términos y condiciones para continuar.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Formulario enviado con valores:", formData);

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generar código de inscripción único
      const codigoInscripcion = `RP2025-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;

      // Determinar precio según tipo de participante
      // let monto = 0;
      // const moneda = "S/";
      // switch (formData.tipoParticipante) {
      //   case "empresas":
      //     monto = 900;
      //     break;
      //   case "instituciones": // instituciones
      //     monto = 900;
      //     break;
      //   case "estudiante": // profesionales - estudiantes
      //     monto = 450;
      //     break;
      //   case "publico":
      //     monto = 600;
      //     break;
      //   default:
      //     monto = 600;
      // }
      // Función para obtener el label del tipo de participante
      const getTipoLabel = (tipo: string) => {
        switch (tipo) {
          case "empresas":
            return "Empresas";
          case "instituciones":
            return "Instituciones";
          case "estudiante":
            return "Profesionales_Estudiantes";
          case "publico":
            return "Público_en_General";
          default:
            return tipo;
        }
      };

      // Limpiar y transformar datos
      const cleanedData = {
        codigo: codigoInscripcion,
        tipo_participante: getTipoLabel(
          formData.tipoParticipante
        ).toUpperCase(),
        nombre: formData.nombre.trim().toUpperCase(),
        telefono: formData.telefono.trim(),
        ruc: formData.ruc.trim(),
        email: formData.email.trim(),
        // monto,
      };

      // Mostrar en consola el objeto que se enviaría al backend
      //console.log("Datos a enviar al backend:", cleanedData);

      // Crear parámetros para la URL (URLSearchParams requiere strings)
      const params = new URLSearchParams({
        codigo: cleanedData.codigo,
        tipo: cleanedData.tipo_participante,
        // precio: cleanedData.monto.toString(), // 👈 Solo aquí se convierte a string
        // moneda,
        nombre: cleanedData.nombre,
        telefono: cleanedData.telefono,
        ruc: cleanedData.ruc,
        email: cleanedData.email,
      });

      // Redirigir siempre a evento-pago
      window.location.href = `/evento-pago?${params.toString()}`;
    } catch (error) {
      console.error("Error general en el envío:", error);
      alert(
        "Hubo un error al procesar su inscripción. Por favor, inténtelo nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo: Tipo de Participante */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Tipo de Participante</Label>
        <RadioGroup
          value={formData.tipoParticipante}
          onValueChange={(value) => updateField("tipoParticipante", value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="empresas" id="empresas" />
            <Label htmlFor="empresas" className="font-normal cursor-pointer">
              Empresas
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="instituciones" id="instituciones" />
            <Label
              htmlFor="instituciones"
              className="font-normal cursor-pointer"
            >
              Instituciones
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="estudiante" id="estudiante" />
            <Label htmlFor="estudiante" className="font-normal cursor-pointer">
              Profesionales - Estudiantes
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="publico" id="publico" />
            <Label htmlFor="publico" className="font-normal cursor-pointer">
              Público en General
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Campo: Nombre */}
      <div>
        <Label>
          {isInstitucion
            ? "Nombre de la Empresa / Institución"
            : "Nombre Completo"}
        </Label>
        <Input
          placeholder={
            isInstitucion
              ? "Ingrese el nombre de la empresa o institución"
              : "Ingrese su nombre completo"
          }
          value={formData.nombre}
          onChange={(e) => updateField("nombre", e.target.value)}
        />
      </div>

      {/* Campo: RUC (solo empresas e instituciones) */}
      {isInstitucion && (
        <div>
          <Label>RUC de la Empresa / Institución</Label>
          <Input
            placeholder="Ingrese el RUC de la empresa o institución"
            value={formData.ruc}
            onChange={(e) => updateField("ruc", e.target.value)}
          />
        </div>
      )}

      {/* Campo: Correo Electrónico */}
      <div>
        <Label>Correo Electrónico</Label>
        <Input
          placeholder="correo@empresa.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>

      {/* Campo: Teléfono */}
      <div>
        <Label>Teléfono</Label>
        <Input
          placeholder="987654321"
          value={formData.telefono}
          onChange={(e) => updateField("telefono", e.target.value)}
        />
      </div>

      {/* Términos y condiciones */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="terminos"
          checked={formData.terminosCondiciones}
          onCheckedChange={(checked) =>
            updateField("terminosCondiciones", checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="terminos" className="cursor-pointer">
            Acepto los términos y condiciones del evento
          </Label>
          <p className="text-sm text-gray-600">
            Al marcar esta casilla, confirma que los datos proporcionados son
            correctos.
          </p>
        </div>
      </div>

      {/* Botón de envío */}
      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isSubmitting || !formData.terminosCondiciones}
      >
        {isSubmitting ? "Enviando inscripción..." : "Enviar Inscripción"}
      </Button>
    </form>
  );
}
