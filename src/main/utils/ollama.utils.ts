import { getPromptForType } from './transcript.utils'

/**
 * Generate summary using Ollama
 */
export async function generateSummary(transcript: string, recordingType: string): Promise<string> {
  try {
    const ollamaUrl = 'http://localhost:11434/api/generate'
    const prompt = getPromptForType(recordingType, transcript)

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama API response:', response.status, errorText)
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.response || 'No summary generated'
  } catch (error) {
    console.error('Error generating summary with Ollama:', error)

    try {
      const alternativeUrl = 'http://localhost:11434/api/chat'

      const prompt = getPromptForType(recordingType, transcript)

      const response = await fetch(alternativeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.message?.content || 'No summary generated'
      }
    } catch (altError) {
      console.error('Alternative Ollama endpoint also failed:', altError)
    }

    // Fallback to a simple summary if Ollama is not available
    return `Summary: This is a fallback summary for the transcript.
    Ollama integration failed: ${error instanceof Error ? error.message : 'Unknown error'}

    To enable AI summaries:
    1. Install Ollama: https://ollama.ai/
    2. Pull a model: ollama pull mistral
    3. Start Ollama service: ollama serve
    4. Check if Ollama is running: curl http://localhost:11434/api/tags

    Original transcript length: ${transcript.length} characters.`
  }
}
