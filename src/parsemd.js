// markdown-it
var hljs = require('highlight.js');
var md = require('markdown-it')({
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                // This is only for full CommonMark compatibility.
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                // useful for external highlighters.
    linkify:      false,        // Autoconvert URL-like text to links
   
    // Enable some language-neutral replacement + quotes beautification
    typographer:  false,
    // 代码高亮
    highlight: function (str, lang) {
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                     hljs.highlight(lang, str, true).value +
                     '</code></pre>';
            } catch (__) {}
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
exports = module.exports = md;