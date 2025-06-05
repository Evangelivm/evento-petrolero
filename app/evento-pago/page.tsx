"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  Upload,
  Building2,
  Loader2,
  Smartphone,
  Banknote,
} from "lucide-react";
import { createParticipant, uploadComprobante } from "@/data/connections";

export default function EventoPagoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Datos desde URL
  const codigo = searchParams.get("codigo") || "";
  const nombre = searchParams.get("nombre")?.trim().toUpperCase() || "";
  const telefono = searchParams.get("telefono")?.trim() || "";
  const tipo_participante = searchParams.get("tipo")?.toUpperCase() || "";
  const ruc = searchParams.get("ruc")?.trim() || "";
  const email = searchParams.get("email")?.trim() || "";
  const precioParam = searchParams.get("precio");
  const moneda = searchParams.get("moneda") || "S/";

  // Estados
  const [metodo_pago, setMetodoPago] = useState<string>("TRANSFERENCIA");
  const [activeTab, setActiveTab] = useState<string>("instrucciones");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pagoConfirmado, setPagoConfirmado] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(null);

  // Estado para los días seleccionados
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);

  // Precio base según tipo
  const getPrecioByTipo = (tipo: string) => {
    switch (tipo) {
      case "EMPRESAS":
        return 300;
      case "INSTITUCIONES":
        return 300;
      case "PROFESIONALES_ESTUDIANTES":
        return 150;
      case "PUBLICO_EN_GENERAL":
        return 200;
      default:
        return 200;
    }
  };

  const precioBase = getPrecioByTipo(tipo_participante);
  const [monto, setMonto] = useState(precioBase);

  // Actualizar monto cuando cambian los días seleccionados
  useEffect(() => {
    const nuevoMonto = precioBase * diasSeleccionados.length;
    setMonto(nuevoMonto || precioBase);
  }, [diasSeleccionados, precioBase]);

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Función para subir comprobante
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten imágenes o archivos PDF.");
        return;
      }
      setComprobanteFile(file);
      setFileName(file.name);
      setFileUploaded(true);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setComprobanteUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setComprobanteUrl(null);
      }
    }
  };

  // Función para confirmar inscripción
  const handleConfirmarInscripcion = async () => {
    setIsSubmitting(true);

    // Validar que se haya seleccionado al menos un día
    if (diasSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un día para continuar.");
      setIsSubmitting(false);
      return;
    }

    // Crear el campo "dias" como string de números separados por comas
    const diasSeleccionadosNumeros = diasSeleccionados
      .map((dia) => dia.replace("Dia ", "")) // Quitar "Dia "
      .join(","); // Unir en string

    const dataToSubmit = {
      codigo,
      nombre,
      telefono,
      tipo_participante,
      ruc,
      email,
      monto,
      moneda,
      metodo_pago: metodo_pago.toUpperCase(),
      comprobante: null as string | null,
      dias: diasSeleccionadosNumeros, // 👈 Nuevo campo añadido
    };

    try {
      if (metodo_pago !== "EFECTIVO") {
        if (!comprobanteFile) {
          alert("Debe seleccionar un comprobante antes de confirmar.");
          setIsSubmitting(false);
          return;
        }
        const url = await uploadComprobante(comprobanteFile);
        dataToSubmit.comprobante = url;
      }
      await createParticipant(dataToSubmit);
      setPagoConfirmado(true);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error al registrar el participante:", error);
      alert(
        `Hubo un problema al registrar su inscripción: ${error.response.data.message}`
      );
      setIsSubmitting(false);
    }
  };

  const generateQRCode = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          text
        )}`
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error al generar el código QR:", error);
    }
  };

  if (!codigo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">
              No se encontró información de inscripción válida.
            </p>
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/oil-barrel-logo.png"
                alt="Reactiva-Petrol Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  Reactiva-Petrol 2025
                </h1>
                <p className="text-sm text-gray-600">Proceso de Pago</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-green-600 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!pagoConfirmado ? (
            <>
              {/* Información de la inscripción */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Pre Inscripción Registrada
                  </CardTitle>
                  <CardDescription>
                    Su pre-inscripción ha sido registrada exitosamente. Complete
                    el pago para confirmar su participación.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Código de PRE-Inscripción
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-lg font-bold text-green-700">
                          {codigo}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-300"
                        >
                          Pendiente de Pago
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Participante
                      </h3>
                      <p className="font-medium">{nombre}</p>
                      <p className="text-sm text-gray-600">{telefono}</p>
                    </div>
                  </div>

                  {/* Selector de días */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Seleccionar Días
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {["Dia 1", "Dia 2", "Dia 3"].map((dia) => (
                        <div key={dia} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={dia}
                            checked={diasSeleccionados.includes(dia)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDiasSeleccionados([
                                  ...diasSeleccionados,
                                  dia,
                                ]);
                              } else {
                                setDiasSeleccionados(
                                  diasSeleccionados.filter((d) => d !== dia)
                                );
                              }
                            }}
                            className="rounded text-green-600 focus:ring-green-500"
                          />
                          <label
                            htmlFor={dia}
                            className="text-sm font-medium text-gray-700"
                          >
                            {dia}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mostrar monto actualizado */}
                  <p className="mt-4 text-lg font-semibold text-green-700">
                    Monto Total: {moneda} {monto.toFixed(2)} {" - "}
                    {diasSeleccionados.length} día(s)
                  </p>
                </CardContent>
              </Card>

              {/* Selección de método de pago */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <CardDescription>
                    Seleccione su método de pago preferido para confirmar su
                    inscripción.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={metodo_pago}
                    onValueChange={(value) => {
                      setMetodoPago(value);
                      setActiveTab("instrucciones");
                      setFileUploaded(false);
                      setFileName("");
                      setComprobanteFile(null);
                      setComprobanteUrl(null);
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem
                        value="TRANSFERENCIA"
                        id="transferencia"
                      />
                      <Label
                        htmlFor="transferencia"
                        className="flex items-center gap-2 font-normal cursor-pointer"
                      >
                        <Building2 className="h-5 w-5 text-green-600" />
                        Transferencia Bancaria
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem value="YAPE" id="yape" />
                      <Label
                        htmlFor="yape"
                        className="flex items-center gap-2 font-normal cursor-pointer"
                      >
                        <Image
                          src="/yape-bcp-37283_logosenvector.com_6.svg"
                          alt="Yape"
                          width={20}
                          height={20}
                          className="h-5 w-5 text-green-600"
                        />
                        Yape
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem value="PLIN" id="plin" />
                      <Label
                        htmlFor="plin"
                        className="flex items-center gap-2 font-normal cursor-pointer"
                      >
                        <Image
                          src="/plin-interbank-4391_logosenvector.com_5.svg"
                          alt="Plin"
                          width={20}
                          height={20}
                          className="h-5 w-5 text-green-600"
                        />
                        Plin
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border p-4">
                      <RadioGroupItem value="EFECTIVO" id="efectivo" />
                      <Label
                        htmlFor="efectivo"
                        className="flex items-center gap-2 font-normal cursor-pointer"
                      >
                        <Banknote className="h-5 w-5 text-green-600" />
                        Efectivo en el momento de la conferencia
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Detalles del método de pago */}
              {metodo_pago !== "EFECTIVO" && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>
                      {metodo_pago === "TRANSFERENCIA"
                        ? "Transferencia Bancaria"
                        : metodo_pago === "YAPE"
                        ? "Pago con Yape"
                        : "Pago con Plin"}
                    </CardTitle>
                    <CardDescription>
                      Complete el pago y suba el comprobante para confirmar su
                      PRE-inscripción.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger
                          value="instrucciones"
                          className="text-xs sm:text-base"
                        >
                          Instrucciones de Pago
                        </TabsTrigger>
                        <TabsTrigger
                          value="comprobante"
                          className="text-xs sm:text-base"
                        >
                          Subir Comprobante
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="instrucciones"
                        className="p-4 space-y-4"
                      >
                        {metodo_pago === "TRANSFERENCIA" && (
                          <>
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Realice la transferencia por S/.{monto}.00 SOLES
                                y suba el comprobante.
                              </AlertDescription>
                            </Alert>
                            <Card>
                              <CardContent className="pt-6">
                                <h4 className="font-medium mb-2 text-sm sm:text-base">
                                  Datos Bancarios
                                </h4>
                                <div className="space-y-2 text-xs sm:text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                      Banco:
                                    </span>
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        Banco de Crédito del Perú (BCP)
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2"
                                        onClick={() =>
                                          copyToClipboard(
                                            "Banco de Crédito del Perú (BCP)",
                                            "banco"
                                          )
                                        }
                                      >
                                        {copiedText === "banco" ? (
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Nuevo campo - Titular */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                      Titular:
                                    </span>
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        Reactiva Petrol Eventos
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2"
                                        onClick={() =>
                                          copyToClipboard(
                                            "Reactiva Petrol Eventos",
                                            "titular"
                                          )
                                        }
                                      >
                                        {copiedText === "titular" ? (
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Nuevo campo - Cuenta Corriente */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                      Cuenta Corriente:
                                    </span>
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        194-2458792-1-26
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2"
                                        onClick={() =>
                                          copyToClipboard(
                                            "194-2458792-1-26",
                                            "cuenta"
                                          )
                                        }
                                      >
                                        {copiedText === "cuenta" ? (
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                      Monto:
                                    </span>
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        S/.{monto}.00 SOLES
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2"
                                        onClick={() =>
                                          copyToClipboard(
                                            monto.toString(),
                                            "monto"
                                          )
                                        }
                                      >
                                        {copiedText === "monto" ? (
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">
                                      Concepto:
                                    </span>
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        {codigo}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2"
                                        onClick={() =>
                                          copyToClipboard(codigo, "concepto")
                                        }
                                      >
                                        {copiedText === "concepto" ? (
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )}

                        {(metodo_pago === "YAPE" || metodo_pago === "PLIN") && (
                          <>
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Realice el pago por S/.{monto}.00 SOLES usando{" "}
                                {metodo_pago === "YAPE" ? "Yape" : "Plin"}.
                              </AlertDescription>
                            </Alert>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                              <div className="flex-1 text-center">
                                <div className="bg-white p-2 border rounded-lg inline-block mb-2">
                                  <Image
                                    src={
                                      metodo_pago === "YAPE"
                                        ? "/yape-qr.png"
                                        : "/plin-qr.png"
                                    }
                                    alt={`Código QR de ${metodo_pago}`}
                                    width={200}
                                    height={200}
                                    className="mx-auto"
                                  />
                                </div>
                                <p className="text-sm text-gray-600">
                                  Escanea este código QR con la app de{" "}
                                  {metodo_pago === "YAPE" ? "Yape" : "Plin"}
                                </p>
                              </div>
                              <div className="flex-1">
                                <Card>
                                  <CardContent className="pt-6">
                                    <h4 className="font-medium mb-2">
                                      Datos para{" "}
                                      {metodo_pago === "YAPE" ? "Yape" : "Plin"}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                          Nombre:
                                        </span>
                                        <span className="font-medium">
                                          Reactiva Petrol
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                          Teléfono:
                                        </span>
                                        <span className="font-medium">
                                          +51 987 654 321
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                          Monto:
                                        </span>
                                        <span className="font-medium">
                                          S/.{monto}.00 SOLES
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-500">
                                          Descripción:
                                        </span>
                                        <span className="font-medium">
                                          {codigo}
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </>
                        )}

                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setActiveTab("comprobante")}
                        >
                          Continuar a Subir Comprobante
                        </Button>
                      </TabsContent>

                      <TabsContent
                        value="comprobante"
                        className="p-4 space-y-4"
                      >
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Suba el comprobante de su pago para verificar y
                            confirmar su inscripción.
                          </AlertDescription>
                        </Alert>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {fileUploaded ? (
                            <div className="space-y-2">
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                              <p className="font-medium">
                                ¡Comprobante subido correctamente!
                              </p>
                              <p className="text-sm text-gray-500">
                                Archivo: {fileName}
                              </p>
                              {comprobanteUrl && (
                                <div className="mt-2">
                                  <img
                                    src={comprobanteUrl}
                                    alt="Previsualización"
                                    className="max-h-40 mx-auto rounded"
                                  />
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFileUploaded(false);
                                  setFileName("");
                                  setComprobanteFile(null);
                                  setComprobanteUrl(null);
                                }}
                              >
                                Cambiar archivo
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <input
                                type="file"
                                id="comprobante"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                              />
                              <label
                                htmlFor="comprobante"
                                className="cursor-pointer block space-y-2"
                              >
                                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                  <Upload className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="font-medium">
                                  Haz clic para subir tu comprobante
                                </p>
                                <p className="text-sm text-gray-500">
                                  Soporta JPG, PNG o PDF (máx. 5MB)
                                </p>
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("instrucciones")}
                            className="w-full sm:flex-1 py-2 text-sm sm:text-base"
                          >
                            Volver a Instrucciones
                          </Button>
                          <Button
                            type="button"
                            onClick={handleConfirmarInscripcion}
                            disabled={!fileUploaded || isSubmitting}
                            className="w-full sm:flex-1 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verificando...
                              </span>
                            ) : (
                              "Confirmar Pago"
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Pago en efectivo */}
              {metodo_pago === "EFECTIVO" && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Pago en Efectivo</CardTitle>
                    <CardDescription>
                      Su inscripción quedará reservada. Podrá pagar en efectivo
                      el día del evento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Debe llegar 30 minutos antes del inicio del evento para
                        realizar el pago en efectivo (S/.{monto}.00 soles) y
                        completar su acreditación.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">
                          Instrucciones para el día del evento:
                        </h4>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                          <li>
                            Llegue entre 7:30 AM - 8:00 AM para realizar el pago
                          </li>
                          <li>
                            Presente su código de inscripción:{" "}
                            <strong>{codigo}</strong>
                          </li>
                          <li>
                            Tenga preparado el monto exacto: S/.{monto}.00 soles
                          </li>
                          <li>
                            Recibirá su credencial y materiales del evento
                          </li>
                        </ul>
                      </div>
                      <Button
                        type="button"
                        onClick={handleConfirmarInscripcion}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting
                          ? "Confirmando..."
                          : "Confirmar Inscripción"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Confirmación de pago */
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">
                  ¡PRE-Inscripción Confirmada!
                </h1>
                <p className="text-lg text-gray-600">
                  Su inscripción a Reactiva-Petrol 2025 ha sido confirmada
                  exitosamente.
                </p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6 text-center">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Código de PRE-Inscripción
                      </h3>
                      <p className="font-mono text-2xl font-bold text-green-700">
                        {codigo}
                      </p>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        CONFIRMADO
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/">Volver al Inicio</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Alert className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>INFORMACIÓN IMPORTANTE:</strong>
                  <br />
                  1.- Enviaremos un correo electrónico con un QR de confirmación
                  de su PAGO una vez validado.
                  <br />
                  2.- El día del evento, presente su código QR para el acceso.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
