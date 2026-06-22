/**
 * Custom Preview Template for 'pages' collection
 * Prepared for Decap CMS / Sveltia CMS (when implemented)
 * Uses the global `h` (create element) and `createClass` provided by the CMS.
 */

var PagesPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var content = entry.getIn(['data', 'content']);
    var title = entry.getIn(['data', 'title']);
    
    var blocks = [];
    
    if (content) {
      content.forEach(function(block, index) {
        var type = block.get('type');
        
        if (type === 'text') {
          var bTitle = block.get('title');
          var bContent = block.get('content');
          var children = [];
          if (bTitle) {
            children.push(h('h3', { key: 'title' }, bTitle));
          }
          if (bContent) {
            // Note: In a preview, we ideally want to parse markdown. 
            // For a simple script, we just output the raw text or use the widget.
            children.push(h('div', { className: 'text-content', key: 'content' }, bContent));
          }
          blocks.push(h('div', { key: index }, children));
          
        } else if (type === 'video') {
          var url = this.props.getAsset(block.get('url'));
          var poster = this.props.getAsset(block.get('poster'));
          var caption = block.get('caption');
          
          blocks.push(h('div', { className: 'video-block', key: index }, [
            h('video', { controls: true, poster: poster ? poster.toString() : undefined, key: 'video' }, [
              h('source', { src: url ? url.toString() : '', type: 'video/mp4', key: 'source' })
            ]),
            caption ? h('p', { className: 'media-caption', key: 'caption' }, caption) : null
          ]));
          
        } else if (type === 'gallery') {
          var gTitle = block.get('title');
          var images = block.get('images');
          var children = [];
          
          if (gTitle) {
            children.push(h('div', { className: 'gallery-title', key: 'title' }, gTitle));
          }
          
          if (images) {
            images.forEach(function(img, iIdx) {
              var url = this.props.getAsset(img.get('url'));
              var caption = img.get('caption');
              children.push(h('div', { className: 'gallery-item', key: iIdx }, [
                h('img', { src: url ? url.toString() : '', alt: 'Workbook Visual Asset', key: 'img' }),
                caption ? h('p', { className: 'media-caption', key: 'caption' }, caption) : null
              ]));
            }.bind(this));
          }
          
          blocks.push(h('div', { className: 'gallery-block', key: index }, children));
          
        } else if (type === 'pdf_download') {
          var pTitle = block.get('title');
          var url = this.props.getAsset(block.get('url'));
          var desc = block.get('description');
          var size = block.get('file_size');
          
          var children = [];
          if (pTitle) children.push(h('span', { className: 'download-heading', key: 'title' }, pTitle));
          if (desc) children.push(h('p', { className: 'download-desc', key: 'desc' }, desc));
          if (size) children.push(h('span', { className: 'file-info', key: 'size' }, 'PDF Document • ' + size));
          if (url) children.push(h('a', { href: url.toString(), className: 'download-button', target: '_blank', key: 'link' }, 'Download PDF'));
          
          blocks.push(h('div', { className: 'download-block', key: index }, children));
          
        } else if (type === 'questionnaire') {
          var qTitle = block.get('title') || 'Knowledge Check';
          var questions = block.get('questions');
          var children = [h('h3', { key: 'title' }, qTitle)];
          
          if (questions) {
            questions.forEach(function(q, qIdx) {
              var question = q.get('question');
              var optA = q.get('option_a');
              var optB = q.get('option_b');
              var optC = q.get('option_c');
              var optD = q.get('option_d');
              
              var qChildren = [h('p', { className: 'quiz-question', key: 'q' }, question)];
              if (optA) qChildren.push(h('button', { className: 'quiz-btn', key: 'a' }, 'A) ' + optA));
              if (optB) qChildren.push(h('button', { className: 'quiz-btn', key: 'b' }, 'B) ' + optB));
              if (optC) qChildren.push(h('button', { className: 'quiz-btn', key: 'c' }, 'C) ' + optC));
              if (optD) qChildren.push(h('button', { className: 'quiz-btn', key: 'd' }, 'D) ' + optD));
              
              qChildren.push(h('button', { className: 'quiz-submit', key: 'sub' }, 'Check Answers'));
              
              children.push(h('div', { className: 'quiz-block', key: qIdx }, qChildren));
            });
          }
          blocks.push(h('div', { className: 'quiz-section', key: index }, children));
        }
      }.bind(this));
    }

    return h('div', { className: 'container' }, [
      h('h2', { key: 'h2' }, title ? title : 'Draft Page'),
      h('div', { key: 'content' }, blocks)
    ]);
  }
});

// Check if CMS supports custom templates, and register it to avoid throwing errors in Sveltia right now.
if (typeof CMS !== 'undefined' && CMS.registerPreviewTemplate) {
  CMS.registerPreviewTemplate("pages", PagesPreview);
}
