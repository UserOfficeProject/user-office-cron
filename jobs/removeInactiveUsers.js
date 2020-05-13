const api = require('../config/api');

const removeInactiveUsers = async () => {
  console.log('Running predefined Cron Job');

  const removeInactiveUserBody = {
    query: 'mutation { deleteInactiveUsers { error, users { id } } }',
    variables: null,
  };

  await api.mutation(removeInactiveUserBody);
};

module.exports = removeInactiveUsers;
