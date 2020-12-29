import { Client } from 'pg';
import format from 'pg-format';
import DetailedWikiEvent, {
  DetailedWikiEditEvent,
} from './interfaces/DetailedWikiEvent';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 2 * DAY;

const client = new Client();

client
  .connect()
  .then(() => console.log('Connected to DB'))
  .catch((err: Error) => console.error('Connection DB error', err.stack));

const getLastTimeStamp = async () => {
  const lastContributionRes = await client.query(
    'SELECT * FROM contributions ORDER BY timestamp DESC LIMIT 1',
  );
  const timestamp: Date =
    lastContributionRes.rows.length > 0
      ? new Date(lastContributionRes.rows[0].timestamp)
      : new Date();
  if ((Date.now() as any) - (timestamp as any) > 2 * WEEK) {
    return new Date((Date.now() as any) - 2 * WEEK);
  } else {
    return timestamp;
  }
};

const insertUserId = async (
  contribution: DetailedWikiEditEvent,
): Promise<DetailedWikiEditEvent> => {
  const userQueryRes = await client.query(
    "SELECT * FROM users WHERE username = '" + contribution.user + "' LIMIT 1",
  );

  if (userQueryRes.rowCount === 0) {
    const userInsertRes = await client.query({
      text: 'INSERT INTO users (username) VALUES ($1::text) RETURNING user_id',
      values: [contribution.user],
      rowMode: 'array',
    });
    contribution.userId = userInsertRes.rows[0][0];
    // return contribution;
  } else if (userQueryRes.rowCount > 0) {
    contribution.userId = userQueryRes.rows[0].user_id;
    // return contribution;
  }

  await insertContribution(contribution);

  return contribution;
};

const insertContribution = async (
  contribution: DetailedWikiEditEvent,
): Promise<any> => {
  const valuesContr = [
    [
      new Date(contribution.timestamp * 1000).toISOString(),
      contribution.title,
      contribution.userId,
      contribution.meta.id + contribution.meta.domain,
      contribution.revision ? contribution.revision.contributionType : 'other',
    ],
  ];

  try {
    const res = await client.query(
      format(
        'INSERT INTO contributions (timestamp, topic, user_id, event_id, contribution_type) VALUES %L',
        valuesContr,
      ),
      [],
    );
    return res;
  } catch (e) {
    // console.log(e);
    return 'Duplicate';
  }
};

export { insertUserId, insertContribution, getLastTimeStamp };
