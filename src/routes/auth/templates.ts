export const loginTemplate = (message: string = ""): string => `
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

export const registerTemplate = (message: string = ""): string => `
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
