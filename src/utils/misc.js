export async function fetchJson (url) {
  try {
    const res = await fetch(url)
    return res.json()
  } catch (err) {
    console.error(`Unable to fetch and parse JSON from url: ${url}`)
  }
  return {}
}
