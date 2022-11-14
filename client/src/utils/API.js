export const test = async () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ffae5646afmshec63d61fbd07b2fp17ee73jsn3371d91d22c0",
      "X-RapidAPI-Host": "anime-db.p.rapidapi.com",
    },
  };
  return fetch(
    "https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=Fullmetal&genres=Fantasy%2CDrama&sortBy=ranking&sortOrder=asc",
    options
  );
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

// SUBSCRIBED - Vocabulary / Free = 2,500 requests/day, no request frequency limit
// https://rapidapi.com/dpventures/api/wordsapi/pricing

// SUBSCRIBED - Facts / No premium option, unlimited requests, no request frequency limit
// https://rapidapi.com/brianweidl/api/random-facts4/

// SUBSCRIBED - Articles (Good one) - Free = 50 requests/month, no request frequency limit
// Users can input their city to return local news
// https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-news-data/pricing

// SUBSCRIBED - Famous quotes - Free = 1,000 requests/month, no request frequency limit
// https://rapidapi.com/saicoder/api/famous-quotes4/
