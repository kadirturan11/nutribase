// Vercel Serverless Function — analyzes a food photo using Claude's vision API.
// The ANTHROPIC_API_KEY is read from a server-side environment variable and
// never exposed to the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, mediaType } = req.body || {};
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
            {
              type: 'text',
              text: 'Bu fotoğraftaki yemek/besinleri tanımla. Görebildiğin her ayrı besin için Türkçe adını, tahmini porsiyon miktarını (gram) ve yaklaşık kalori değerini tahmin et. SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir açıklama veya metin ekleme, markdown code fence kullanma:\n{"foods":[{"name":"besin adı","estimatedGrams":150,"estimatedKcal":250,"confidence":"high"}],"totalKcal":250,"note":"kısa bir gözlem notu"}'
            }
          ]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Anthropic API error' });
    }

    const textBlock = (data.content || []).find(c => c.type === 'text');
    const raw = textBlock ? textBlock.text : '';
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Could not parse AI response', raw: cleaned });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
