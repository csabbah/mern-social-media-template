// SUBSCRIBED - Facts / No premium option, unlimited requests, no request frequency limit
// https://rapidapi.com/brianweidl/api/random-facts4/
export const fetchFacts = async () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ffae5646afmshec63d61fbd07b2fp17ee73jsn3371d91d22c0",
      "X-RapidAPI-Host": "random-facts4.p.rapidapi.com",
    },
  };

  try {
    const data = await fetch(
      "https://random-facts4.p.rapidapi.com/get?count=5",
      options
    );
    return data.json();
  } catch (err) {
    console.log(err);
  }
};

// SUBSCRIBED - Famous quotes - Free = 1,000 requests/month, no request frequency limit
// https://rapidapi.com/saicoder/api/famous-quotes4/

export const fetchQuotes = async () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ffae5646afmshec63d61fbd07b2fp17ee73jsn3371d91d22c0",
      "X-RapidAPI-Host": "famous-quotes4.p.rapidapi.com",
    },
  };

  try {
    const data = await fetch(
      "https://famous-quotes4.p.rapidapi.com/random?category=all&count=2",
      options
    );
    return data.json();
  } catch (err) {
    console.log(err);
  }
};

// function getMultipleRandom(arr, num) {
//   const shuffled = [...arr].sort(() => 0.5 - Math.random());

//   return shuffled.slice(0, num);
// }

// let wordsArr = getMultipleRandom(words, 5);

// const fetchReq1 = fetch(
//   `https://api.dictionaryapi.dev/api/v2/entries/en/${wordsArr[1]}`
// ).then((res) => res.json());
// const fetchReq2 = fetch(
//   `https://api.dictionaryapi.dev/api/v2/entries/en/${wordsArr[2]}`
// ).then((res) => res.json());
// const fetchReq3 = fetch(
//   `https://api.dictionaryapi.dev/api/v2/entries/en/${wordsArr[3]}`
// ).then((res) => res.json());

// const allData = Promise.all([fetchReq1, fetchReq2, fetchReq3]);
// allData.then((res) => res);

// return allData;

export const fetchWords = async () => {
  try {
    const wordDb = await fetch("https://random-word-api.herokuapp.com/all");

    let words = await wordDb.json();
    let chosenWord = words[Math.ceil(Math.random() * words.length)];

    // https://dictionaryapi.dev/
    const data = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${chosenWord}`
    );

    return data.json();
  } catch (err) {
    console.log(err);
  }
};

// IMPORTANT NOTE
// Realistically, we only need to use certain APIs once to upload to the database
// I.e. We only need to run the Geography API once and then save all the data
// However, with news, that updates daily, so we cannot do that

// Articles (Medium - Expensive) / Free = 150 requests/month, no request frequency limit
// 2 requests are needed > Get Top Feeds > Take a random Article ID > Get Article's Content
// https://rapidapi.com/nishujain199719-vgIfuFHZxVZ/api/medium2

// SUBSCRIBED - Geography / Free = 1 request/second & 100 requests/day
// https://rapidapi.com/natkapral/api/countries-cities/

// SUBSCRIBED - Articles (Good one) - Free = 50 requests/month, no request frequency limit
// Users can input their city to return local news
// https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-news-data/pricing

// SUBSCRIBED - Vocabulary / Free = 2,500 requests/day, no request frequency limit
// https://rapidapi.com/dpventures/api/wordsapi/pricing
