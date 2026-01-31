import { decompress } from 'lz-ts'

const date = new Date()
const currentDate = `${date.getFullYear()}-${date.getMonth() + 1
  }-${date.getDate()}`

const THERAPEUTIC_SYSTEM_MESSAGE = {
  role: 'system',
  content: `Eres un asistente terapeuta profesional con especialización en psicología clínica y bienestar mental.

PRINCIPIOS FUNDAMENTALES:
- Escucha activa y empatía genuina
- Haz preguntas reflexivas para ayudar a la autoexploración
- Utiliza técnicas cognitivo-conductuales cuando sea apropiado
- Respeta los límites del rol terapéutico

RESTRICCIONES IMPORTANTES:
- NO diagnostiques condiciones psiquiátricas
- NO prescribas medicamentos
- NO reemplaces la terapia profesional en persona
- Mantén confidencialidad y privacidad

ESPECIALIZACIONES:
- Ansiedad
- Depresión
- Duelo y pérdidas
- Manejo del estrés
- Problemas de sueño
- Dificultades en relaciones interpersonales

ESTILO DE COMUNICACIÓN:
- Valida los sentimientos del usuario
- Usa un lenguaje cálido, comprensivo y profesional
- Ofrece estrategias prácticas y recursos basados en evidencia
- Sugiere apoyo profesional cuando sea necesario

RESPUESTAS SEGURAS:
- Si el usuario expresa ideación suicida: "Entiendo que estás pasando por un momento muy difícil. Por favor, contacta a los servicios de emergencia o una línea de crisis local inmediatamente. Si estás en [tu país], llama al número de emergencia o a la línea de prevención de suicidio más cercana."
- Si solicita medicamentos: "Eso requiere evaluación de un/una psiquiatra o profesional médico. Te recomiendo consultar a un proveedor de salud mental para una evaluación adecuada."

Fecha actual: ${currentDate}. Responde de forma empática, profesional y con límites claros.`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { prompt, conversation } = req.query

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  let previousConversation = []
  try {
    if (conversation) {
      const decompressedConversation = decompress(conversation)
      let parsedConversation = {}
      try {
        parsedConversation = JSON.parse(decompressedConversation)
      } catch (e) {
        console.warn('Problems parsing conversation, starting fresh:', decompressedConversation)
        previousConversation = []
      }

      previousConversation = parsedConversation
        .map((entry) => {
          const role = entry.ia ? 'assistant' : 'user'

          // ignore messages without content
          if (!entry.message) return null

          return {
            role,
            content: entry.message
          }
        })
        .filter(Boolean)
    }
  } catch (error) {
    console.warn('Error decompressing conversation, starting fresh:', error.message)
    previousConversation = []
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
        messages: [
          THERAPEUTIC_SYSTEM_MESSAGE,
          ...previousConversation,
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      console.error('Groq API Error Status:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Groq API Error Body:', errorData)
      return res.status(500).json({ error: `Groq API error: ${response.status}`, details: errorData })
    }

    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream;charset=utf-8'
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        res.end('data: [DONE]\n\n')
        break
      }

      const text = decoder.decode(value)
      const data = text
        .split('\n')
        .filter(Boolean)
        .map((line) => line.trim().replace('data: ', '').trim())

      for (const line of data) {
        if (line === '[DONE]') {
          res.end('data: [DONE]\n\n')
          break
        }

        let content = ''
        try {
          const json = JSON.parse(line)
          content = json?.choices[0]?.delta?.content ?? ''
        } catch (e) {
          console.error('No se pudo parsear la línea', line)
          console.error(e)
        }

        if (content) {
          res.write(`data: ${JSON.stringify(content)}\n\n`)
          res.flush()
        }
      }
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
