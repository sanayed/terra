const loginTemplate = (message = "") => `
  <h1>Login</h1>
  ${
    message
      ? `<p style="color:white; padding:10px; background:lightcoral">${message}</p>`
      : ""
  }
  <form method='POST'>
    <input name='email' type='email' placeholder='Email' required/><br>
    <input name='password' type='password' placeholder='Password' required/><br>
    <button type='submit'>Login</button>
  </form>
  <a href="/auth/register">Register</a>
`;

const registerTemplate = (message = "") => `
  <h1>Register</h1>
  ${
    message
      ? `<p style="color:white; padding:10px; background:lightcoral">${message}</p>`
      : ""
  }
  <form method='POST'>
    <input name='email' type='email' placeholder='Email' required/><br>
    <input name='password' type='password' placeholder='Password' required/><br>
    <button type='submit'>Register</button>
  </form>
  <a href="/auth/login">Login</a>
`;

module.exports = {
  loginTemplate,
  registerTemplate,
};
