"use client"

import Link from "next/link"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  telefono: z.string().regex(/^\d{9}$/, {
    message: "El teléfono debe tener exactamente 9 dígitos.",
  }),
  empresa: z.string().min(2, {
    message: "Por favor ingrese el nombre de su empresa.",
  }),
  cargo: z.string().min(2, {
    message: "Por favor ingrese su cargo.",
  }),
  pais: z.string({
    required_error: "Por favor seleccione su país.",
  }),
  tipoPase: z.enum(["completo", "ejecutivo", "virtual"], {
    required_error: "Por favor seleccione un tipo de pase.",
  }),
  intereses: z.array(z.string()).optional(),
  comentarios: z.string().optional(),
  terminosCondiciones: z.boolean().refine((value) => value === true, {
    message: "Debe aceptar los términos y condiciones para continuar.",
  }),
})

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      empresa: "",
      cargo: "",
      pais: "",
      tipoPase: "completo",
      intereses: [],
      comentarios: "",
      terminosCondiciones: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulación de envío al servidor
    setTimeout(() => {
      console.log(values)

      // Redirigir a la página de pago
      window.location.href = `/pago?nombre=${encodeURIComponent(values.nombre)}&apellido=${encodeURIComponent(values.apellido)}&email=${encodeURIComponent(values.email)}&tipoPase=${encodeURIComponent(values.tipoPase)}`

      setIsSubmitting(false)
      form.reset()
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="correo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="987654321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de su empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Su cargo o puesto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su país" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mexico">México</SelectItem>
                  <SelectItem value="colombia">Colombia</SelectItem>
                  <SelectItem value="venezuela">Venezuela</SelectItem>
                  <SelectItem value="brasil">Brasil</SelectItem>
                  <SelectItem value="argentina">Argentina</SelectItem>
                  <SelectItem value="chile">Chile</SelectItem>
                  <SelectItem value="peru">Perú</SelectItem>
                  <SelectItem value="ecuador">Ecuador</SelectItem>
                  <SelectItem value="usa">Estados Unidos</SelectItem>
                  <SelectItem value="canada">Canadá</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipoPase"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Auspicio</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="completo" />
                    </FormControl>
                    <FormLabel className="font-normal">Crudos Superligeros (54 API) $5,000 USD</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ejecutivo" />
                    </FormControl>
                    <FormLabel className="font-normal">Crudos Ligeros (42 API) $3,500 USD</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="virtual" />
                    </FormControl>
                    <FormLabel className="font-normal">Crudos Pesados (22 API) $2,500 USD</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intereses"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Áreas de Interés</FormLabel>
                <FormDescription>Seleccione las áreas que más le interesan.</FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { id: "reactivacion", label: "Plan Reactivación Petrolera en 47 nuevos Lotes E&P Fase Cero." },
                  {
                    id: "remediacion",
                    label: "Plan Remediacion Ambiental en 3265 Pasivos Cuencas Corrientes, Tigre, Pastaza y Marañón.",
                  },
                  {
                    id: "masificacion",
                    label:
                      "Plan Masificacion del Gas en 8 Regiones (Ucayali, Junín, Ayacucho, Apurímac, Huancavelica, Cusco, Puno y Juliaca).",
                  },
                  { id: "abandonos", label: "Plan de Abandonos de 4200 Pozos PASH." },
                ].map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="intereses"
                    render={({ field }) => {
                      return (
                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(field.value?.filter((value) => value !== item.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comentarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios o Preguntas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Si tiene alguna pregunta o comentario, escríbalo aquí."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terminosCondiciones"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Acepto los términos y condiciones del evento</FormLabel>
                <FormDescription>
                  Al marcar esta casilla, acepta nuestros{" "}
                  <Link href="#" className="text-amber-600 hover:underline">
                    términos de servicio
                  </Link>{" "}
                  y{" "}
                  <Link href="#" className="text-amber-600 hover:underline">
                    política de privacidad
                  </Link>
                  .
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Continuar al Pago"}
        </Button>
      </form>
    </Form>
  )
}
