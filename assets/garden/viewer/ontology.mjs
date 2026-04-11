/**
 * ontology.mjs — visual grammar for entity types and relationships.
 *
 * Bloomberg Terminal palette:
 *   bg       #000000  pure black
 *   orange   #ff6600  primary accent
 *   amber    #ffaa00  secondary / labels
 *   yellow   #e8e000  key data
 *   cyan     #00cccc  selected / focus
 *   green    #00ff88  geographic / growth
 *   red      #ff4444  error / warning
 *   purple   #aa88ff  abstract / concept
 *   dim      #555533  inactive
 */

// ── Entity types ──────────────────────────────────────────────────────────────

export const ENTITY_TYPES = {
  // code: short Bloomberg-style type code shown on node + detail panel
  person:       { color: 0x00ccff, radius: 0.58, label: 'Person',       code: 'HUMN' },
  place:        { color: 0x00ff88, radius: 0.65, label: 'Place',        code: 'GEO'  },
  country:      { color: 0x00ee77, radius: 0.80, label: 'Country',      code: 'CNTRY'},
  organization: { color: 0xff6600, radius: 0.65, label: 'Organization', code: 'ORG'  },
  company:      { color: 0xff8800, radius: 0.60, label: 'Company',      code: 'CORP' },
  government:   { color: 0xff6600, radius: 0.70, label: 'Government',   code: 'GOVT' },
  film:         { color: 0xff44aa, radius: 0.58, label: 'Film',         code: 'FILM' },
  book:         { color: 0xffcc00, radius: 0.52, label: 'Book',         code: 'PUBL' },
  music:        { color: 0xff88cc, radius: 0.52, label: 'Music',        code: 'MUSC' },
  event:        { color: 0xff4400, radius: 0.58, label: 'Event',        code: 'EVNT' },
  concept:      { color: 0xaa88ff, radius: 0.48, label: 'Concept',      code: 'CONC' },
  species:      { color: 0x44ff88, radius: 0.52, label: 'Species',      code: 'BIO'  },
  software:     { color: 0x00ccee, radius: 0.50, label: 'Software',     code: 'TECH' },
  sport:        { color: 0xffee00, radius: 0.52, label: 'Sport',        code: 'SPRT' },
  artwork:      { color: 0xff99ee, radius: 0.50, label: 'Artwork',      code: 'ART'  },
  award:        { color: 0xffd700, radius: 0.48, label: 'Award',        code: 'AWRD' },
  law:          { color: 0xcc9900, radius: 0.50, label: 'Law',          code: 'LAW'  },
  academic:     { color: 0x88ccff, radius: 0.52, label: 'Academic',     code: 'ACAD' },
  religion:     { color: 0xddaa88, radius: 0.52, label: 'Religion',     code: 'RELN' },
  language:     { color: 0xaaffcc, radius: 0.48, label: 'Language',     code: 'LANG' },
  // ── Local-document types ──────────────────────────────────────────────────
  platform:     { color: 0x00aaff, radius: 0.70, label: 'Platform',     code: 'PLTF' },
  issue:        { color: 0xff3322, radius: 0.58, label: 'Issue',        code: 'ISSU' },
  solution:     { color: 0x00ff66, radius: 0.52, label: 'Solution',     code: 'SOLN' },
  union:        { color: 0xffdd00, radius: 0.58, label: 'Union',        code: 'UNON' },
  metric:       { color: 0xffee88, radius: 0.40, label: 'Metric',       code: 'METR' },
  // ── External source types ──────────────────────────────────────────────────
  video:        { color: 0xff4466, radius: 0.55, label: 'Video',        code: 'VDEO' },
  channel:      { color: 0xff2222, radius: 0.58, label: 'Channel',      code: 'CHNL' },
  post:         { color: 0xff6633, radius: 0.48, label: 'Post',         code: 'POST' },
  subreddit:    { color: 0xff4500, radius: 0.60, label: 'Subreddit',    code: 'SUBR' },
  player:       { color: 0x00ddff, radius: 0.55, label: 'Player',       code: 'PLYR' },
  team:         { color: 0x00bbdd, radius: 0.62, label: 'Team',         code: 'TEAM' },
  tournament:   { color: 0xffdd00, radius: 0.65, label: 'Tournament',   code: 'TRNY' },
  civ:          { color: 0xcc8833, radius: 0.44, label: 'Civilization',  code: 'CIV'  },
  dlc:          { color: 0xee88ff, radius: 0.52, label: 'DLC',          code: 'DLC'  },
  // ── Legal / institutional types ────────────────────────────────────────────
  ruling:       { color: 0xcc9900, radius: 0.56, label: 'Ruling',       code: 'RLLG' },
  regulation:   { color: 0xcc7700, radius: 0.52, label: 'Regulation',   code: 'REGL' },
  // ── Technical knowledge types ───────────────────────────────────────────────
  algorithm:    { color: 0xbb88ff, radius: 0.50, label: 'Algorithm',    code: 'ALGO' },
  standard:     { color: 0x88aacc, radius: 0.50, label: 'Standard',     code: 'STND' },
  dataset:      { color: 0x00cccc, radius: 0.48, label: 'Dataset',      code: 'DATA' },
  model:        { color: 0x44ddcc, radius: 0.52, label: 'Model',        code: 'MODL' },
  // ── Analytical / narrative types ──────────────────────────────────────────
  insight:      { color: 0xffffff, radius: 0.62, label: 'Insight',      code: 'ISGT' },
  milestone:    { color: 0xffee00, radius: 0.50, label: 'Milestone',    code: 'MLST' },
  conflict:     { color: 0xff2244, radius: 0.56, label: 'Conflict',     code: 'CNFL' },
  default:      { color: 0x888866, radius: 0.48, label: 'Entity',       code: 'ENTY' },
};

// Wikidata P31 QID → type key
export const QID_TO_TYPE = {
  // People
  Q5:         'person',
  Q15632617:  'person',   // fictional human
  // Places
  Q515:       'place',    // city
  Q1549591:   'place',    // big city
  Q3957:      'place',    // town
  Q2221906:   'place',    // geographic location
  Q486972:    'place',    // human settlement
  Q1093829:   'place',    // city of USA
  Q200250:    'place',    // national capital
  Q6256:      'country',
  Q3624078:   'country',  // sovereign state
  Q133442:    'place',    // island
  Q23442:     'place',    // island
  // Organizations
  Q43229:     'organization',
  Q4830453:   'company',
  Q783794:    'company',
  Q7210356:   'government',
  Q7188:      'government',
  Q1530022:   'government',
  // Creative works
  Q11424:     'film',
  Q93204:     'film',     // documentary
  Q24856:     'film',     // film series
  Q571:       'book',
  Q7725634:   'book',     // literary work
  Q47461344:  'book',     // written work
  Q482994:    'music',    // album
  Q105543609: 'music',    // musical work
  Q7302866:   'music',    // soundtrack
  Q838948:    'artwork',
  Q3305213:   'artwork',  // painting
  Q179700:    'artwork',  // statue
  // Events
  Q1190554:   'event',
  Q645883:    'event',    // military operation
  Q40231:     'event',    // election
  Q18536594:  'event',    // natural event
  Q198:       'event',    // war
  // Concepts & knowledge
  Q16521:     'species',
  Q7397:      'software',
  Q9135:      'software', // OS
  Q341:       'software', // free software
  Q7366:      'sport',
  Q4438121:   'sport',    // sports discipline
  Q1021867:   'award',
  Q618779:    'award',
  Q820655:    'law',
  Q7748:      'law',      // constitution
  Q1756157:   'academic', // academic discipline
  Q11862829:  'academic',
  Q9842:      'religion',
  Q1648793:   'religion',
  Q34770:     'language',
  Q33742:     'language',
};

// ── Relationship types ────────────────────────────────────────────────────────

export const REL_TYPES = {
  creation:   { color: 0xffcc00, label: 'CREATED BY',  code: 'CREA' },
  location:   { color: 0x00ff88, label: 'LOCATED IN',  code: 'LOC'  },
  membership: { color: 0x00cccc, label: 'MEMBER OF',   code: 'MEMB' },
  temporal:   { color: 0x888866, label: 'TIME',        code: 'TIME' },
  leadership: { color: 0xff6600, label: 'LED BY',      code: 'LEAD' },
  education:  { color: 0x88ccff, label: 'EDUCATED AT', code: 'EDU'  },
  association:{ color: 0xaa88ff, label: 'ASSOCIATED',  code: 'ASSN' },
  causes:     { color: 0xff4422, label: 'CAUSES',      code: 'CAUS' },
  mitigates:  { color: 0x00ff66, label: 'MITIGATES',   code: 'MITG' },
  governs:    { color: 0xffaa00, label: 'GOVERNS',     code: 'GOVN' },
  employment: { color: 0x00ccff, label: 'EMPLOYS',     code: 'EMPL' },
  ownership:  { color: 0xff6600, label: 'OWNS',        code: 'OWNR' },
  competes:   { color: 0xff3366, label: 'COMPETES',    code: 'COMP' },
  qualifies:  { color: 0x00aaff, label: 'QUALIFIES FOR', code: 'QUAL' },
  features:   { color: 0xffcc00, label: 'FEATURES',    code: 'FEAT' },
  broadcasts: { color: 0x8899ff, label: 'BROADCASTS',  code: 'BCST' },
  precedes:   { color: 0x888866, label: 'PRECEDES',    code: 'PRCD' },
  enables:    { color: 0x44ff88, label: 'ENABLES',     code: 'ENBL' },
  disrupts:   { color: 0xff6622, label: 'DISRUPTS',    code: 'DSRP' },
  reveals:      { color: 0xeeeeff, label: 'REVEALS',       code: 'RVLS' },
  opposes:      { color: 0xff2244, label: 'OPPOSES',       code: 'OPPS' },
  // ── Structural / technical ────────────────────────────────────────────────
  implements:   { color: 0x00ccee, label: 'IMPLEMENTS',    code: 'IMPL' },
  supersedes:   { color: 0xcc9900, label: 'SUPERSEDES',    code: 'SPSD' },
  permits:      { color: 0x00ff66, label: 'PERMITS',       code: 'PRMT' },
  prohibits:    { color: 0xff2244, label: 'PROHIBITS',     code: 'PRBT' },
  derives_from: { color: 0xaa88ff, label: 'DERIVES FROM',  code: 'DRFM' },
  achieves:     { color: 0xffee00, label: 'ACHIEVES',      code: 'ACHV' },
  cites:        { color: 0x888866, label: 'CITES',         code: 'CITE' },
  contradicts:  { color: 0xff4466, label: 'CONTRADICTS',   code: 'CNTR' },
  default:      { color: 0x446644, label: 'RELATED TO',    code: 'REL'  },
};

// Wikidata PID → relationship type key
export const PID_TO_REL = {
  // Creation / authorship
  P50:  'creation',   // author
  P57:  'creation',   // director
  P161: 'creation',   // cast member
  P175: 'creation',   // performer
  P86:  'creation',   // composer
  P170: 'creation',   // creator
  P162: 'creation',   // producer
  P58:  'creation',   // screenwriter
  // Location / geography
  P17:  'location',   // country
  P131: 'location',   // located in
  P19:  'location',   // place of birth
  P20:  'location',   // place of death
  P276: 'location',   // location
  P495: 'location',   // country of origin
  P36:  'location',   // capital
  P159: 'location',   // headquarters
  // Membership / structure
  P361: 'membership', // part of
  P527: 'membership', // has part
  P463: 'membership', // member of
  P1376:'membership', // capital of
  P179: 'membership', // part of series
  P137: 'membership', // operator
  // Leadership / governance
  P35:  'leadership', // head of state
  P6:   'leadership', // head of government
  P1308:'leadership', // officeholder
  P488: 'leadership', // chairperson
  P169: 'leadership', // CEO
  // Education / academia
  P69:  'education',  // educated at
  P184: 'education',  // doctoral supervisor
  P185: 'education',  // doctoral student
  P1416:'education',  // affiliation
  // Temporal
  P571: 'temporal',   // inception
  P576: 'temporal',   // dissolved
  P580: 'temporal',   // start time
  P582: 'temporal',   // end time
  P569: 'temporal',   // birth date
  P570: 'temporal',   // death date
  // General association
  P921: 'association',// main subject
  P180: 'association',// depicts
  P135: 'association',// movement
  P737: 'association',// influenced by
};

// ── Resolvers ─────────────────────────────────────────────────────────────────

export function resolveEntityType(instanceofQids = []) {
  for (const qid of instanceofQids) {
    const type = QID_TO_TYPE[qid];
    if (type) return type;
  }
  return 'default';
}

export function resolveRelType(pid) {
  return PID_TO_REL[pid] ?? 'default';
}

export function getEntityStyle(type) {
  return ENTITY_TYPES[type] ?? ENTITY_TYPES.default;
}

export function getRelStyle(relType) {
  return REL_TYPES[relType] ?? REL_TYPES.default;
}

export function getTypeCode(type) {
  return (ENTITY_TYPES[type] ?? ENTITY_TYPES.default).code;
}
