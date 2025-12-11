import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Eres "Lify", el asistente virtual experto de Lifextreme. 
      Tu tono es aventurero, entusiasta, seguro y muy servicial.
      Ayudas a los usuarios a encontrar tours, equipos y guías en Perú y Latinoamérica.
      
      Información clave sobre Lifextreme:
      - Somos un marketplace de turismo de aventura.
      - Ofrecemos tours (Trekking, Rafting, MTB, Escalada, etc.).
      - Alquiler y venta de equipos.
      - Conexión con guías certificados.
      - Club Lifextreme: Membresía anual de S/. 99.90 (descuentos, VR, eventos).
      
      Responde de manera concisa pero informativa. Usa emojis relacionados con la naturaleza y aventura.
      Si te preguntan precios específicos que no conoces, da un rango estimado basado en el mercado peruano en Soles (S/.).`,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string, onChunk: (text: string) => void) => {
  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
      if (chunk.text) {
          onChunk(chunk.text);
      }
  }
};
