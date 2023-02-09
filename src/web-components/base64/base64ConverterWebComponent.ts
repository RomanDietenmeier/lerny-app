import { decode } from 'base-64';
import { webComponentTagsToWrap } from '../../constants/webComponentTags';

class base64ConverterWebComponent extends HTMLElement {
  constructor() {
    super();
    let decodedContent = decode(this.innerHTML);

    for (const componentTag of webComponentTagsToWrap) {
      const endComponentTag = `</${componentTag}>`;
      if (
        decodedContent.startsWith(`<${componentTag}`) &&
        decodedContent.endsWith(endComponentTag)
      ) {
        const componentContent = decodedContent.substring(
          decodedContent.indexOf('>') + 1,
          decodedContent.lastIndexOf(endComponentTag)
        );
        decodedContent = decodedContent.replace(
          componentContent,
          `<!--${componentContent}-->`
        );

        break;
      }
    }

    this.innerHTML = decodedContent;
  }
}

export const base64Tag = {
  open: '<base-sixty-four>',
  end: '</base-sixty-four>',
  tag: 'base-sixty-four',
};

window.customElements.define(base64Tag.tag, base64ConverterWebComponent);
