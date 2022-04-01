const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');
module.exports = class UserService {
  static async create(code) {
    //need to exchange our code for a token
    const token = await exchangeCodeForToken(code);

    //use that token to fetch our github profile
    const profile = await getGithubProfile(token);

    //just in case the user does not have a profile...
    //we need to insert a user profile
    let user = await GithubUser.findByUsername(profile.username);
    console.log('profile: ', profile);
    //then return the user
    if (!user) {
      user = await GithubUser.insert({
        username: profile.login,
        avatar: profile.avatar_url,
        email: profile.email,
      });
    }

    return user;
  }
};
