import { readFile, writeFile } from 'node:fs/promises';
import postcss from 'postcss';
const css = postcss.parse(
  await readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
);
css.walkAtRules('import', (rule) => {
  rule.params = "'../../src/styles/fonts.css'";
});
css.walkRules((rule) => {
  if (rule.parent?.type === 'atrule' && /keyframes$/.test(rule.parent.name))
    return;
  rule.selectors = rule.selectors.map((selector) => {
    if ([':root', 'html', 'body'].includes(selector))
      return '.portfolio-preview';
    return `.portfolio-preview ${selector}`;
  });
});
await writeFile(
  new URL('../studio/components/portfolio.css', import.meta.url),
  css.toString() +
    '\n' +
    (await readFile(
      new URL('../studio/components/preview.css', import.meta.url),
      'utf8',
    )),
);
