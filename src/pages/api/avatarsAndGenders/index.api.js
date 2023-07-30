import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Fetch the gender for a given name
async function fetchGender(name) {
  const res = await fetch(`https://api.genderize.io/?name=${name.trim()}`);

  let data;

  if (res.ok) {
    data = await res.json();
    console.log('fetched gender', data);
  } else {
    console.log('Error: ', res.status);
    return;
  }

  let gender = data.gender;

  // If gender is undefined, choose male or female randomly
  if (!gender) {
    gender = Math.random() < 0.5 ? 'male' : 'female';
  }

  return gender;
}

// Fetch the avatar for a given gender
async function fetchAvatar(gender) {
  const res = await fetch(`https://randomuser.me/api/?gender=${gender}`);

  if (!res.ok) {
    console.log('Error: ', res.status);
    return;
  }

  const data = await res.json();

  // Construct the avatar URL
  const avatarUrl = data.results[0].picture.large;

  return avatarUrl;
}

export default async function POST(request) {
  try {
    const {
      messages: { names },
    } = await request.json();

    // Make sure names is an array
    if (!Array.isArray(names)) {
      throw new TypeError('Names must be an array');
    }

    // Array to store all the promises
    const promises = names.map(async name => {
      const gender = await fetchGender(name);
      const avatarUrl = await fetchAvatar(gender);

      return { gender, avatarUrl };
    });

    const results = await Promise.all(promises);

    console.log('fetched all results', results);
    // Wait for all promises to resolve and return the results
    return NextResponse.json({ results });
  } catch (error) {
    console.log('Avatars and Genders api error', error);
  }
}
