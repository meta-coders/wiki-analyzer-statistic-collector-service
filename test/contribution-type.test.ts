import * as faker from 'faker';

import { getContributionType } from '../src/utils/contribution-type';
import {
  ContributionType,
  DetailedRevision,
} from '../src/interfaces/DetailedWikiEvent';

interface RevisionTestData {
  missing: boolean;
  diff?: string;
}

const mockRevisionDiff = (contributionType: ContributionType): string => {
  switch (contributionType) {
    case ContributionType.TYPO_EDIT:
      return `<tr>
        <td class="diff-addedline">
          <div>
            <ins class="diffchange diffchange-inline">
              Stisseria wendlandiana
            </ins>
          </div>
        </td>
      </tr>`;
    case ContributionType.CONTENT_ADDITION:
      return `<tr>
        <td class="diff-addedline">
          <div>
            Stisseria wendlandiana
          </div>
        </td>
      </tr>`;
  }
};

const mockDetailedRevision = (
  revisionTestData: RevisionTestData,
): DetailedRevision => ({
  new: faker.random.number(),
  old: faker.random.number(),
  ...revisionTestData,
});

describe('Get contribution type', () => {
  test('must correctly process missing revision', () => {
    const revision = mockDetailedRevision({ missing: true });
    const contributionType = getContributionType(revision);
    expect(contributionType).toBe(ContributionType.CONTENT_ADDITION);
  });

  test('must correctly process content additions', async () => {
    const revision = mockDetailedRevision({
      missing: false,
      diff: mockRevisionDiff(ContributionType.CONTENT_ADDITION),
    });
    const contributionType = getContributionType(revision);
    expect(contributionType).toBe(ContributionType.CONTENT_ADDITION);
  });

  test('must correctly process content additions', async () => {
    const revision = mockDetailedRevision({
      missing: false,
      diff: mockRevisionDiff(ContributionType.TYPO_EDIT),
    });
    const contributionType = getContributionType(revision);
    expect(contributionType).toBe(ContributionType.TYPO_EDIT);
  });
});
