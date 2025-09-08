self.onmessage = async function(e) {
  const { type, payload } = e.data;
  if (type === 'getPosts') {
    try {
      const { offset = 0, limit = 1000, userId } = payload || {};
      const base = 'https://z5zk8q777zbt.soon-night.xyz';
      let url = `${base}/posts?offset=${offset}&limit=${limit}`;
      if (userId) url = `${base}/posts/user/${userId}?offset=${offset}&limit=${limit}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      self.postMessage({ type: 'posts', data });
    } catch (err) {
      self.postMessage({ type: 'error', error: err.message });
    }
  }
}; 
