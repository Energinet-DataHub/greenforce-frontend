import hljs from 'highlight.js';

onmessage = (event) => {
  const result = hljs.highlightAuto(event.data, ['xml', 'json']);
  postMessage(result.value);
};
