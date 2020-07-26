import fetch from 'cross-fetch';
import queryString from 'query-string';

const qs = queryString.parse(location.search);

// const qs = {
//   token: 'd68285da1d05ef894ec650f1b3d85dd1a16496d0',
//   uid: '3922161186'
// }

const stringify = queryString.stringify(qs);

export const get = (apiPath, data) => fetch(
  `${API_BASEURL}${apiPath}?${stringify}${data ? '&' + queryString.stringify(data) : ''}`
).then(res => res.json())

export const post = (apiPath, data) => fetch(
  `${API_BASEURL}/${apiPath}`,
  {
    method: 'POST',
    body: JSON.stringify(data),
  }
).then(res => res)

export default fetch;
