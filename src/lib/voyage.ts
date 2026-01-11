const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;

// Check if Voyage API is configured
export function isVoyageConfigured(): boolean {
  return !!VOYAGE_API_KEY && VOYAGE_API_KEY.length > 0;
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function embedText(text: string): Promise<number[]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'voyage-3-lite',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage AI error: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  // Batch in groups of 128
  const batchSize = 128;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const response = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        input: batch,
        model: 'voyage-3-lite',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Voyage AI error: ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    allEmbeddings.push(...data.data.map((d: { embedding: number[] }) => d.embedding));
  }

  return allEmbeddings;
}
