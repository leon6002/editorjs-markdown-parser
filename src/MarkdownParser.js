import { parseHeaderToMarkdown } from './BlockTypeParsers/HeaderTypeParser';
import { parseParagraphToMarkdown } from './BlockTypeParsers/ParagraphTypeParser';
import { parseListToMarkdown } from './BlockTypeParsers/ListTypeParser';
import { parseDelimiterToMarkdown } from './BlockTypeParsers/DelimiterTypeParser';
import { parseImageToMarkdown } from './BlockTypeParsers/ImageTypeParser';
import { parseCheckboxToMarkdown } from './BlockTypeParsers/CheckboxTypeParser';
import { parseQuoteToMarkdown } from './BlockTypeParsers/QuoteTypeParser';
import { parseCodeToMarkdown } from './BlockTypeParsers/CodeTypeParser';
import { parseLinkToolToMarkdown } from './BlockTypeParsers/LinkToolTypeParser';
import { parseTableToMarkdown } from './BlockTypeParsers/TableTypeParser';
import { fileDownloadHandler } from './FileHandler';

/**
 * Parse editor data blocks to markdown syntax
 */
export async function parseToMarkdown(blocks) {
  const parsedData = blocks.map((item) => {
    // iterate through editor data and parse the single blocks to markdown syntax
    switch (item.type) {
      case 'header':
        return parseHeaderToMarkdown(item.data);
      case 'paragraph':
      default:
        return parseParagraphToMarkdown(item.data);
      case 'list':
        return parseListToMarkdown(item.data);
      case 'delimiter':
        return parseDelimiterToMarkdown(item);
      case 'image':
        return parseImageToMarkdown(item.data);
      case 'quote':
        return parseQuoteToMarkdown(item.data);
      case 'checkbox':
        return parseCheckboxToMarkdown(item.data);
      case 'code':
        return parseCodeToMarkdown(item.data);
      case 'checklist':
        return parseCheckboxToMarkdown(item.data);
      case 'linkTool':
        return parseLinkToolToMarkdown(item.data);
      case 'table':
        return parseTableToMarkdown(item.data);
    }
  });
  return parsedData.join('\n');
}

export function getTimeStamp() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  const hh = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();
  return `_${dd}-${mm}-${yyyy}_${hh}-${min}-${sec}`;
}

export async function parse(blocks) {
  const parsedData = await parseToMarkdown(blocks);
  return parsedData;
}
/**
 * Markdown Parsing class
 */
export default class MarkdownParser {
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * creates the Parser plugin
   * {editorData, api functions} - necessary to interact with the editor
   */
  constructor({ data, api, config }) {
    this.data = data;
    this.api = api;
    this.config = config || {};
    this.config.filename = this.config.filename || 'download';
    this.config.extension = this.config.extension || 'md';
  }

  /**
   * @return Plugin data such as title and icon
   */
  static get toolbox() {
    return {
      title: 'Download Markdown',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(112, 118, 132)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    };
  }

  /**
   * @return empty div and run the export funtion
   */
  async render() {
    const doc = document.createElement('div');
    const data = await this.api.saver.save();
    const content = await parse(data.blocks);
    this.download(content);
    return doc;
  }

  /**
   * Function which takes parsed data and creates a markdown file download
   */
  async download(content) {
    const timestamp = this.config.timestamp ? getTimeStamp() : '';
    // take parsed data and create a markdown file
    fileDownloadHandler(content, `${this.config.filename}${timestamp}.${this.config.extension}`);
    if (this.config.callback) {
      this.config.callback(content);
    }
  }

  /*
   * Saves the plugin data into JSON format (used as placeholder for UI)
  */
  save() {
    return {
      message: 'Downloading Markdown',
    };
  }
}
