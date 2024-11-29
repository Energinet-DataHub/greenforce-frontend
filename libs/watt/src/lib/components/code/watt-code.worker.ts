import hljs from 'highlight.js';

onmessage = (event) => {
  const { data } = event;
  if (data === null || data === undefined) {
    return postMessage('');
  }
  const result = hljs.highlightAuto(event.data, ['xml', 'json']);
  return postMessage(result.value);
};
