const { default: axios } = require('axios');
async function getActivityAsyncAwait() {
  const activity = await axios.get('https://www.boredapi.com/api/activity');
  console.log('You could do:', activity.data.activity);
}

function getActivityPromise() {
  axios
    .get('https://www.boredapi.com/api/activity')
    .then((activity) => {
      console.log('You could do:', activity.data.activity);
    })
    .catch((err) => {
      console.log(err);
    });
}

getActivityAsyncAwait();
getActivityPromise();
