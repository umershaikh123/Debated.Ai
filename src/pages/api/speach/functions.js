export async function getVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices');

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const data = await response.json();

    return data.voices;
  } catch (error) {
    console.log(error.message);
  }
}

// Posts a message to the provided API endpoint and returns the response
export const postVoiceMessage = async (endpoint, messages) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...messages }),
  });
  if (!response.ok) {
    console.error('Failed to fetch from API', response);
  }

  return response;
};

export async function generateVoice(voice, message) {
  if (!voice) {
    return null;
  }
  // maximum of 500 characters will be spoken per message
  let trimmedMessage = await message.slice(0, 500);

  try {
    const response = await postVoiceMessage('/api/speach', {
      message: trimmedMessage,
      voice,
    });

    if (!response.ok) {
      console.log('Error', response);
      return null;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.log('Failed to generate voice:', error);
    return null;
  }
}

export function getVoicesByGenders(genders) {
  const maleArray = [
    { name: 'Clyde', voice_id: '2EiwWnXFnvU5JabPnv8n' },
    { name: 'Dave', voice_id: 'CYw3kZ02Hs0563khs1Fj' },
    { name: 'Fin', voice_id: 'D38z5RcWu1voky8WS1ja' },
    { name: 'Thomas', voice_id: 'GBv7mTt0atIp3Br8iCZE' },
    { name: 'Charlie', voice_id: 'IKne3meq5aSn9XLyUdCD' },
    { name: 'Harry', voice_id: 'SOYHLrjzK2X1ezoPC6cr' },
    { name: 'Liam', voice_id: 'TX3LPaxmHKxFdv7VOQHJ' },
    { name: 'Antoni', voice_id: 'ErXwobaYiN019PkySvjV' },
    { name: 'Wayne', voice_id: 'iB5lJCTfIFqABPjIqOtS' },
  ];

  const femaleArray = [
    { name: 'Bella', voice_id: 'EXAVITQu4vr4xnSDxMaL' },
    { name: 'Elli', voice_id: 'MF3mGyEYCl7XYWbV9V6O' },
    { name: 'Charlotte', voice_id: 'XB0fDUnXU5powFXDhCwa' },
    { name: 'Freya', voice_id: 'jsCqWAovK2LkecY7zXl4' },
    { name: 'Valley Girl', voice_id: '5w6jXkxqNDrifxMekqBk' },
  ];

  const voices = {
    male: maleArray,
    female: femaleArray,
  };

  return genders.map(gender => {
    const array = voices[gender];
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex].voice_id;
  });
}

// export async function generateVoicesByGenders(genders, message) {
//   try {
//     const response = await postVoiceMessage('/api/speach', {
//       message,
//       voice,
//     });

//     if (!response.ok) {
//       console.log('Error', response);
//     }
//     const blob = await response.blob();
//     const url = URL.createObjectURL(blob);

//     return url;
//   } catch (error) {
//     console.log('Failed to generate voice:', error);
//     return null;
//   }
// }
