const api = require('../../config/api');

const removeInactiveUsersMock = async () => {
  console.log('Running predefined Cron Job');

  const removeInactiveUserBody = {
    query: 'mutation { deleteInactiveUsers { error, users { id } } }',
    variables: null,
  };

  await api.mutation(removeInactiveUserBody);
};

module.exports = removeInactiveUsersMock;
