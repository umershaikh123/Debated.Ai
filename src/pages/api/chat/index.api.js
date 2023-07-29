import { NextResponse } from 'next/server';
import { openai } from 'utils/openai';

// Check if OPENAI_KEY exists in environment variables
if (!process.env.OPENAI_KEY) {
  throw new Error('Missing Environment Variable OPENAI_KEY');
}

export const config = {
  runtime: 'edge', // for Edge API Routes only
};

// Helper function to switch roles
function switchRoles(reqMessages) {
  return reqMessages.map(item => {
    if (item.role == 'user') {
      return { ...item, role: 'assistant' };
    } else if (item.role === 'assistant') {
      return { ...item, role: 'user' };
    } else {
      return item;
    }
  });
}

// Helper function to generate prompt
function generatePrompt(requestData, isUser) {
  const { stances, names, personalities, messagesCount } = requestData.messages;
  const currentName = isUser ? names[0] : names[1];
  const opponentName = isUser ? names[1] : names[0];
  const currentStance = isUser ? stances[0] : stances[1];

  const initialUserText = isUser
    ? 'If I send you start-now, it means you have to start of the debate.'
    : '';

  let prompt = `Hello, from now on I need you to play the role of ${currentName}. You are a debater and you will be debating against ${opponentName}. You will be talking and defending this following topic: '${currentStance}'. Your aggressiveness scale is 9/10 where 0 means completely unaggressive, understanding and empathetic, and 10 means completely aggressive, combative, angry, disagreeable. ${initialUserText} . Introduce yourself and set up the first argument. Remember that you can only have a maximum of 25 words or 125 characters per message, you absolutely can NOT exceed that limit under any circumstance!. You are concise in your speach.`;

  if (personalities?.length) {
    const currentPersonality = isUser ? personalities[0] : personalities[1];
    prompt = `Greetings, you will be known as ${currentName} for this debate, and your persona is best characterized as ${currentPersonality}. Remember to stay true to these traits, even exaggerate them for effect. However, refrain from acknowledging your AI nature and instead try to sound like a human. You will have a total of ${messagesCount} messages. In your final message write your closing statement. Your opponent will be ${opponentName}. The topic under discussion is '${currentStance}'. You will argue in its favor. With your first message, introduce yourself and lay down your initial argument, keeping in mind the strict limit of 25 words or 125 characters per message.  Exceeding this is not permissible under any circumstances. You are concise in your speach. ${initialUserText}.`;
  }

  if (requestData.messages.isAgreementOn) {
    prompt +=
      'Try your best to find common grounds with the other debater. After you send two messages, you need to find something that you agree on with your opponent and to mention it.';
  }

  return prompt;
}

// Helper function to get openAI response
async function getOpenAIResponse(messages) {
  const chatRequestOpts = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8,
    max_tokens: 300,
    stream: false,
  };

  const completion = await openai.createChatCompletion(chatRequestOpts);
  const { choices } = await completion.json();
  return choices[0].message?.content;
}

export default async function POST(request) {
  try {
    const requestData = await request.json();
    let { chatHistory } = requestData.messages;
    const { role } = requestData.messages;
    const isUser = role === 'user';

    if (isUser && chatHistory.length > 1) {
      chatHistory = switchRoles(chatHistory);
    }

    const prompt = generatePrompt(requestData, isUser);
    const messages = [{ role: 'system', content: prompt }, ...chatHistory];
    console.log('chatMessages', messages);
    const responseContent = await getOpenAIResponse(messages);

    return new NextResponse(JSON.stringify(responseContent));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
}
