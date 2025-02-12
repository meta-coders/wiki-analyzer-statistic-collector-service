import {
  WikiCategorizeEvent,
  WikiExternalEvent,
  WikiLogEvent,
  WikiNewEvent,
  WikiEditEvent,
} from './WikiEvent';

export enum ContributionType {
  TYPO_EDIT = 'typo_editting',
  CONTENT_ADDITION = 'content_addition',
}

export interface DetailedRevision {
  new: number;
  old: number;
  missing: boolean;
  diff?: string;
  contributionType?: ContributionType;
}

export interface DetailedWikiEditEvent extends WikiEditEvent {
  revision: DetailedRevision;
  userId?: string;
}

type DetailedWikiEvent =
  | WikiLogEvent
  | WikiCategorizeEvent
  | WikiNewEvent
  | DetailedWikiEditEvent
  | WikiExternalEvent;

export default DetailedWikiEvent;
