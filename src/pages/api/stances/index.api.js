import { NextResponse } from 'next/server';
import { openai } from 'utils/openai';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

export const config = {
  runtime: 'edge',
};

const nameConfig = {
  dictionaries: [colors, animals],
  style: 'capital',
  separator: ' ',
};

export const getRandomName = () => uniqueNamesGenerator(nameConfig);

const environmentCheck = () => {
  if (!process.env.OPENAI_KEY) {
    throw new Error('Missing Environment Variable OPENAI_KEY');
  }
};

export default async function POST(request) {
  try {
    environmentCheck();

    const {
      messages: { stance, isNameRandomlyGenerated },
    } = await request.json();

    const promptBase = `If there was a debate to be had regarding the topic of ${stance}, what are the two most popular opposing opinions related to that topic. Please try to have specific opinions not general ones. Please simply write a general title (up to 10 words) for that side.`;

    const prompt = isNameRandomlyGenerated
      ? `${promptBase} Please list them in this format 1) {insert Side1 Here} || 2) {insert Side2 Here} for example 1) Red hot Chilli Peppers is the best band in the world || 2) Pink Floyd is the best band in the world`
      : `${promptBase} Also give me two stereotypical names for each side. Please list them in this format 1) {insert name1 here} || {insert Side1 Here} || 2) {insert name2 here} || {insert Side2 Here} for example 1) James || Red hot Chilli Peppers is the best band in the world || 2) Martin || Pink Floyd is the best band in the world`;

    const completionRequestOpts = {
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      max_tokens: 200,
      n: 3,
    };

    const completion = await openai.createCompletion(completionRequestOpts);

    const { choices } = await completion.json();

    const splitRegex = /\d\)\s/g;
    const stancesAndNames = choices.map(({ text }) =>
      text
        .replace(/[\n\r]+|[\s]{2,}/g, ' ')
        .trim()
        .replace(splitRegex, '')
        .split('||')
    );

    const response = isNameRandomlyGenerated
      ? stancesAndNames.map(nameOption => [
          getRandomName(),
          nameOption[0],
          getRandomName(),
          nameOption[1],
        ])
      : stancesAndNames;

    return new NextResponse(JSON.stringify(response));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
}
