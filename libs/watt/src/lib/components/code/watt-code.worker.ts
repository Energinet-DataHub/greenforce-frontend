import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);

onmessage = (event) => {
  console.log(event.data);
  const result = hljs.highlightAuto(event.data);
  console.log(result.value);
  postMessage(result.value);
};
