
export async function fetchUserRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  return res.json();
}
