const fetch = require('node-fetch');

const { API_URL, API_AUTH_TOKEN } = process.env;

class Api {
  constructor() {}

  async call(body) {
    try {
      const result = await fetch(API_URL, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_AUTH_TOKEN}`,
        },
      }).then((res) => res.json());

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new Api();
