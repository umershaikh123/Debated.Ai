export const config = {
  runtime: 'edge',
};

export default async function POST(request) {
  const { message, voice } = await request.json();

  console.log('message: ', message);
  console.log('voice: ', voice);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream?optimize_streaming_latency=1`,
      {
        method: 'POST',
        headers: {
          accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
        }),
      }
    );

    if (!response.ok) {
      console.log(response.body);
    }

    return response;
  } catch (error) {
    console.log(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
