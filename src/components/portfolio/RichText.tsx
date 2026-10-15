import type { ReactNode } from 'react';
import { safeUrl } from '../../content/api';
import type { TextBlock } from '../../content/types';

function blockText(block: TextBlock): ReactNode {
  return block.children.map((span) => {
    let text: ReactNode = span.text;
    for (const mark of span.marks ?? []) {
      if (mark === 'strong') text = <strong>{text}</strong>;
      else if (mark === 'em') text = <em>{text}</em>;
      else if (mark === 'code') text = <code>{text}</code>;
      else if (mark === 'underline') text = <u>{text}</u>;
      else {
        const link = block.markDefs?.find((def) => def._key === mark);
        if (link && safeUrl(link.href, true))
          text = <a href={link.href}>{text}</a>;
      }
    }
    return <span key={span._key}>{text}</span>;
  });
}

export function RichText({ blocks }: { blocks: TextBlock[] }) {
  const nodes: ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.listItem) {
      const items = [block];
      while (blocks[index + 1]?.listItem === block.listItem)
        items.push(blocks[++index]);
      const children = items.map((item) => (
        <li key={item._key}>{blockText(item)}</li>
      ));
      nodes.push(
        block.listItem === 'number' ? (
          <ol key={block._key}>{children}</ol>
        ) : (
          <ul key={block._key}>{children}</ul>
        ),
      );
    } else if (block.style === 'h3')
      nodes.push(<h3 key={block._key}>{blockText(block)}</h3>);
    else if (block.style === 'blockquote')
      nodes.push(<blockquote key={block._key}>{blockText(block)}</blockquote>);
    else nodes.push(<p key={block._key}>{blockText(block)}</p>);
  }
  return <div className="prose">{nodes}</div>;
}
