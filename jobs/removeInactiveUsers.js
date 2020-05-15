const api = require('../config/api');

const getAllUsers = async () => {
  const getAllUsersBody = {
    query: 'query { users { users { id placeholder created } } }',
    variables: null,
  };

  const { data } = await api.call(getAllUsersBody);

  if (!data.users || !data.users.users) {
    throw new Error('Something went wrong! Could not fetch users.');
  }

  return data.users.users;
};

const getAllPromises = (allUsers) => {
  const currentTime = new Date();
  // NOTE: 14 days before the current time
  currentTime.setDate(currentTime.getDate() - 14);

  return allUsers.reduce((result, user) => {
    if (user.placeholder && new Date(user.created) < currentTime) {
      const removeUserByIdBody = {
        query: `mutation { deleteUser(id: ${user.id}) { error user { id } } }`,
        variables: null,
      };

      result.push(api.call(removeUserByIdBody));
    }

    return result;
  }, []);
};

const fireAllPromises = (allPromises) => {
  Promise.all(allPromises)
    .then(async () => {
      console.info('Inactive users removed.');
    })
    .catch((error) => {
      throw new Error(
        `Something went wrong! Could not remove some users. ${error}`
      );
    });
};

const removeInactiveUsers = async () => {
  console.info('Running predefined Cron Job');

  try {
    const allUsers = await getAllUsers();

    const allPromises = getAllPromises(allUsers);

    if (allPromises.length > 0) {
      fireAllPromises(allPromises);
    } else {
      console.info('No inactive users.');
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = removeInactiveUsers;
