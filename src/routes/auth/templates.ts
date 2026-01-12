export const loginTemplate = (message: string = ""): string => `
  <link rel="stylesheet" href="/style.css">
  <main class="center dvh">
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
    <a href="/auth/signup">signup</a>
  </main>
`;

export const signupTemplate = (message: string = ""): string => `
  <link rel="stylesheet" href="/style.css">
  <main class="center dvh">
    <h1>signup</h1>
    ${
      message
        ? `<p style="color:white; padding:10px; background:lightcoral">${message}</p>`
        : ""
    }
    <form method='POST'>
      <input name='name' type='text' placeholder='Name' required/><br>
      <input name='email' type='email' placeholder='Email' required/><br>
      <input name='password' type='password' placeholder='Password' required/><br>
      <button type='submit'>signup</button>
    </form>
    <a href="/auth/login">Login</a>
  </main>
`;
