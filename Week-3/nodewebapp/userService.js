
const userDAO = require('./UserDAO');

class UserService {
  async getUsers() {
    return await userDAO.getAllUsers();
  }

  async getUser(id) {
    return await userDAO.getUserById(id);
  }

  async addUser(user) {
    return await userDAO.createUser(user);
  }

  async updateUser(id, user) {
    await userDAO.updateUser(id, user);
  }

  async deleteUser(id) {
    await userDAO.deleteUser(id);
  }
}
module.exports = new UserService();  
