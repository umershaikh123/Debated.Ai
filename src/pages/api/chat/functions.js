// API endpoints constants
const CHAT_ENDPOINT = '/api/chat';
const STANCES_ENDPOINT = '/api/stances';
const AVATARS_AND_GENDERS_ENDPOINT = '/api/avatarsAndGenders';

// Posts a message to the provided API endpoint and returns the response
export const postMessage = async (endpoint, messages) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) {
    console.error('Failed to fetch from API', response);
  }

  console.log('response: ', response);
  // parse the JSON response into a JavaScript object
  const responseData = await response.json();
  return responseData;
};

export const getAvatarsAndGenders = async names => {
  const response = await postMessage(AVATARS_AND_GENDERS_ENDPOINT, {
    names: names,
  });

  return response.results;
};

export const getStances = async (stance, isNameRandomlyGenerated) => {
  const stances = await postMessage(STANCES_ENDPOINT, {
    stance: stance,
    isNameRandomlyGenerated: isNameRandomlyGenerated,
  });
  return stances;
};

export const startDebate = async (names, stances, personalities, messagesCount) => {
  const message = await postMessage(CHAT_ENDPOINT, {
    chatHistory: [
      {
        role: 'user',
        content: 'start-now',
      },
    ],
    stances: stances,
    names: names,
    personalities: personalities,
    messagesCount: messagesCount,
    role: 'user',
  });

  return message;
};
