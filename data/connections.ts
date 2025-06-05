import axios from "axios";

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // URL del backend
  timeout: 10000, // 10 segundos
});

export const createParticipant = async (data: {
  codigo: string;
  tipo_participante: string;
  nombre: string;
  telefono: number;
  ruc: string;
  email: string;
  monto: number;
  moneda: string;
}) => {
  try {
    const response = await apiClient.post("/participants", data);
    return response.data;
  } catch (error) {
    console.error("Error creando participante:", error);
    throw error;
  }
};

export const getParticipants = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get("/participants", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo participantes:", error);
    throw error;
  }
};

export const getParticipant = async (id: string) => {
  try {
    const response = await apiClient.get(`/participants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo participante ${id}:`, error);
    throw error;
  }
};

export const getParticipantByEmail = async (email: string) => {
  try {
    const response = await apiClient.get(`/participants/email/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo participante por email ${email}:`, error);
    throw error;
  }
};

export const updateParticipant = async (
  id: string,
  data: Partial<{
    nombre: string;
    telefono: string;
    ruc: string;
    email: string;
  }>
) => {
  try {
    const response = await apiClient.patch(`/participants/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando participante ${id}:`, error);
    throw error;
  }
};

export const confirmPayment = async (data: {
  metodo_pago: string;
  codigo: string;
}) => {
  try {
    const response = await apiClient.post(
      "/participants/confirm-payment",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error confirmando pago:", error);
    throw error;
  }
};

export const generateTicket = async (id: string) => {
  try {
    const response = await apiClient.post(
      `/participants/${id}/generate-ticket`
    );
    return response.data;
  } catch (error) {
    console.error(`Error generando ticket para ${id}:`, error);
    throw error;
  }
};

export const deleteParticipant = async (id: string) => {
  try {
    const response = await apiClient.delete(`/participants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando participante ${id}:`, error);
    throw error;
  }
};

export const uploadComprobante = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload-comprobante", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al subir el comprobante");
    }

    const data = await response.json();
    return data.url; // Retorna la URL del comprobante
  } catch (error) {
    console.error("Error subiendo el comprobante:", error);
    throw error;
  }
};
