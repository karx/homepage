
class BasicWebComponent extends HTMLElement {
    schema = {
      'pre': {type: 'string', default: ''},
      'post': {type: 'string', default: ''},
      
    }
    constructor() {
      super(); // this is mandatory
      console.log(this.schema);
    }
  
    connectedCallback() {
      // this.data = new Object()
      let clip = this.getAttribute('clip') || "";
      let pre = this.getAttribute('pre') || "";
      let post = this.getAttribute('post') || "";
      const _wrapper = document.createElement('div');
      _wrapper.style.display = 'inherit';
      let anyInternalContent = this.innerHTML;
      _wrapper.innerHTML = this.innerHTML;
      // console.log(anyInternalContent);
      // console.log(pre + ' | ' + clip + ' | ' + post);
      
      let toClip = pre + clip  + anyInternalContent.trim() + post;
      let shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(_wrapper);
      shadowRoot.addEventListener('click', (event) => {
        console.log('Click');
        this.updateClipboard(toClip)
      })
    }
  
    attributeChangedCallback(attr, oldVal, newVal) {   
    }
    updateClipboard(newClip) {
      navigator.clipboard.writeText(newClip).then(function() {
        /* clipboard successfully set */
        console.log('Copied to clipboard: ' + newClip);
      }, function() {
        /* clipboard write failed */
      });
    }
  }
  
  BasicWebComponent.observedAttributes = ['pre', 'post'];
  
  customElements.define('click-clipboard', BasicWebComponent);