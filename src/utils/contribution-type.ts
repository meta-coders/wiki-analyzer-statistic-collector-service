import DOMParser, { Node } from 'dom-parser';
import {
  ContributionType,
  DetailedRevision,
} from '../interfaces/DetailedWikiEvent';

interface WikiDiff {
  addedInlines: string[];
  deletedInlines: string[];
}

const getInlineChanges = (node: Node): string[] => {
  const inlines = node.getElementsByClassName('diffchange-inline');
  if (inlines) {
    return inlines.map((n) => n.textContent);
  }
  return [];
};

const getChanges = (diff = ''): WikiDiff => {
  const dom = new DOMParser().parseFromString(diff);
  const rows = dom.getElementsByTagName('tr');

  if (!rows) {
    return {
      addedInlines: [],
      deletedInlines: [],
    };
  }

  return rows.reduce(
    (changes: WikiDiff, node: Node) => {
      const addedLines = node.getElementsByClassName('diff-addedline');
      const deletedLines = node.getElementsByClassName('diff-deletedline');

      if (addedLines) {
        addedLines.forEach((n) => {
          const inlines = getInlineChanges(n);
          if (inlines.length) {
            changes.addedInlines.push(...inlines);
          }
          return n.innerHTML;
        });
      }

      if (deletedLines) {
        deletedLines.forEach((n) => {
          const inlines = getInlineChanges(n);
          if (inlines.length) {
            changes.deletedInlines.push(...inlines);
          }
          return n.innerHTML;
        });
      }

      return changes;
    },
    {
      addedInlines: [],
      deletedInlines: [],
    } as WikiDiff,
  );
};

export const getContributionType = (
  revision: DetailedRevision,
): ContributionType => {
  if (revision.missing) {
    return ContributionType.CONTENT_ADDITION;
  }
  const changes = getChanges(revision.diff);
  return changes.addedInlines.length || changes.deletedInlines.length
    ? ContributionType.TYPO_EDIT
    : ContributionType.CONTENT_ADDITION;
};
