// The id of a YouTube video from its address, or null: youtu.be/<id>,
// youtube.com/watch?v=<id> and youtube.com/embed/<id>.
export function youtubeId(address) {
  let url;
  try {
    url = new URL(address);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1)
      : host === 'youtube.com'
        ? url.searchParams.get('v') ?? url.pathname.match(/^\/embed\/([^/]+)/)?.[1]
        : null;
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}
