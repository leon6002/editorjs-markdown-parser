export function parseListToMarkdown(blocks) {
  let items = [];
  switch (blocks.style) {
    case 'unordered':
    default:
      items = blocks.items.map((item) => `- ${item}`);
      return `\n${items.join('\n')}\n`;
    case 'ordered':
      items = blocks.items.map((item, index) => `${index + 1}. ${item}`);
      return `\n${items.join('\n')}\n`;
  }
}

export function parseMarkdownToList(blocks) {
  let listData = {};
  const itemData = [];

  blocks.children.forEach((items) => {
    items.children.forEach((listItem) => {
      listItem.children.forEach((listEntry) => {
        itemData.push(listEntry.value);
      });
    });
  });

  listData = {
    data: {
      items: itemData,
      style: blocks.ordered ? 'ordered' : 'unordered',
    },
    type: 'list',
  };

  return listData;
}
