export const config = {
  runtime: 'edge',
};

export default async function POST(request) {
  const { message, voice } = await request.json();

  console.log('message: ', message);
  console.log('voice: ', voice);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!response.ok) {
      console.log(response.body);
    }

    return response;
  } catch (error) {
    console.log(JSON.stringify({ error: error.message }), { status: 500 });
  }

  //   const arrayBuffer = await response.arrayBuffer();
  //   const buffer = Buffer.from(arrayBuffer);
  //   const file = Math.random().toString(36).substring(7);

  //   fs.writeFile(path.join('public', 'audio', `${file}.mp3`), buffer, () => {
  //     console.log('File written successfully');
  //   });

  //   return new Response(JSON.stringify({ file: `${file}.mp3` }));
}
