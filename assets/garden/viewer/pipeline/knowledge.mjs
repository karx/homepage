/**
 * knowledge.mjs — Wikidata SPARQL fetcher.
 *
 * getEntityCore(qid)      → rich entity profile (type, temporal, metrics, tags)
 * getEntityNeighbors(qid) → first-hop related entities
 *
 * EntityProfile shape:
 * {
 *   qid, label, description, image,
 *   type, instanceofQids, instanceofLabel,
 *   temporal: { birth, death, founded, dissolved, start, end },  // years (int|null)
 *   metrics:  { population, area, employees },                   // numbers (float|null)
 *   profile:  { gender, capital, continent, occupations[], industries[] }
 * }
 */

import { log } from '../logger.mjs';
import { resolveEntityType } from '../ontology.mjs';

const ENDPOINT = 'https://query.wikidata.org/sparql';
const HEADERS  = {
  'User-Agent': 'kaaroViewer/2.0 (https://github.com/karx/kaaroViewer)',
  'Accept':     'application/sparql-results+json',
};

async function _sparql(query, label) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  const t0  = performance.now();
  try {
    const res  = await fetch(url, { method: 'GET', headers: HEADERS });
    const json = await res.json();
    const rows = json?.results?.bindings ?? [];
    const ms   = Math.round(performance.now() - t0);
    log('SPARQL', `${label} · ${rows.length} rows (${ms}ms)`, { label, ms, count: rows.length });
    return rows;
  } catch (err) {
    log('ERROR', `SPARQL failed: ${label}`, { message: err.message });
    return [];
  }
}

// ── Row helpers ───────────────────────────────────────────────────────────────

/** First non-null string value of `field` across rows. */
function _first(rows, field) {
  return rows.find(r => r[field]?.value)?.[field]?.value ?? null;
}

/** All unique non-null string values of `field` across rows. */
function _unique(rows, field) {
  return [...new Set(rows.filter(r => r[field]?.value).map(r => r[field].value))];
}

/** Parse ISO 8601 date string "YYYY-MM-DDTHH:MM:SSZ" → integer year, or null. */
function _year(isoStr) {
  if (!isoStr) return null;
  const y = parseInt(isoStr, 10);          // parseInt stops at the first '-' after digits
  return isNaN(y) ? null : y;
}

/** Parse a numeric string → float, or null. */
function _num(str) {
  if (str == null) return null;
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

// ── Core entity fetch ─────────────────────────────────────────────────────────

export async function getEntityCore(qid) {
  // Single query combining type resolution, temporal bounds, scalar metrics, and
  // categorical tags.  LIMIT 20 handles entities with up to ~4 P31 values ×
  // 5 occupation values without losing critical scalar data (dates, numbers are
  // always single-valued in Wikidata, so they appear in row 0 regardless).
  const query = `
SELECT ?label ?description ?image
  ?instanceOf ?instanceOfLabel
  ?birthDate ?deathDate ?inception ?dissolved ?startTime ?endTime
  ?population ?area ?employees
  ?gender ?genderLabel ?capital ?capitalLabel ?continent ?continentLabel
  ?occupation ?occupationLabel ?industry ?industryLabel
WHERE {
  OPTIONAL { wd:${qid} wdt:P18 ?image. }
  OPTIONAL { wd:${qid} wdt:P31 ?instanceOf. }
  OPTIONAL {
    wd:${qid} schema:description ?description.
    FILTER(LANG(?description) = "en")
  }
  OPTIONAL { wd:${qid} wdt:P569 ?birthDate. }
  OPTIONAL { wd:${qid} wdt:P570 ?deathDate. }
  OPTIONAL { wd:${qid} wdt:P571 ?inception. }
  OPTIONAL { wd:${qid} wdt:P576 ?dissolved. }
  OPTIONAL { wd:${qid} wdt:P580 ?startTime. }
  OPTIONAL { wd:${qid} wdt:P582 ?endTime. }
  OPTIONAL { wd:${qid} wdt:P1082 ?population. }
  OPTIONAL { wd:${qid} wdt:P2046 ?area. }
  OPTIONAL { wd:${qid} wdt:P1128 ?employees. }
  OPTIONAL { wd:${qid} wdt:P21 ?gender. }
  OPTIONAL { wd:${qid} wdt:P36 ?capital. }
  OPTIONAL { wd:${qid} wdt:P30 ?continent. }
  OPTIONAL { wd:${qid} wdt:P106 ?occupation. }
  OPTIONAL { wd:${qid} wdt:P452 ?industry. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en".
    wd:${qid} rdfs:label ?label.
    ?instanceOf  rdfs:label ?instanceOfLabel.
    ?gender      rdfs:label ?genderLabel.
    ?capital     rdfs:label ?capitalLabel.
    ?continent   rdfs:label ?continentLabel.
    ?occupation  rdfs:label ?occupationLabel.
    ?industry    rdfs:label ?industryLabel.
  }
} LIMIT 20`;

  const rows = await _sparql(query, `core:${qid}`);
  if (!rows.length) return null;

  // ── Type resolution ───────────────────────────────────────────────────────
  const instanceofQids = [...new Set(
    rows.filter(r => r.instanceOf).map(r => r.instanceOf.value.split('/').pop())
  )];

  // ── Temporal (always single-valued — appears in first matching row) ────────
  const temporal = {
    birth:     _year(_first(rows, 'birthDate')),
    death:     _year(_first(rows, 'deathDate')),
    founded:   _year(_first(rows, 'inception')),
    dissolved: _year(_first(rows, 'dissolved')),
    start:     _year(_first(rows, 'startTime')),
    end:       _year(_first(rows, 'endTime')),
  };

  // ── Scalar metrics ────────────────────────────────────────────────────────
  const metrics = {
    population: _num(_first(rows, 'population')),
    area:       _num(_first(rows, 'area')),
    employees:  _num(_first(rows, 'employees')),
  };

  // ── Categorical profile ───────────────────────────────────────────────────
  const profile = {
    gender:      _first(rows, 'genderLabel')    ?? null,
    capital:     _first(rows, 'capitalLabel')   ?? null,
    continent:   _first(rows, 'continentLabel') ?? null,
    occupations: _unique(rows, 'occupationLabel'),
    industries:  _unique(rows, 'industryLabel'),
  };

  return {
    qid,
    label:           _first(rows, 'label')          ?? qid,
    description:     _first(rows, 'description')    ?? '',
    image:           _first(rows, 'image')           ?? null,
    instanceofQids,
    instanceofLabel: _first(rows, 'instanceOfLabel') ?? '',
    type:            resolveEntityType(instanceofQids),
    temporal,
    metrics,
    profile,
  };
}

// ── Neighbor fetch ────────────────────────────────────────────────────────────

export async function getEntityNeighbors(qid) {
  // Notability filter: only neighbors with an English Wikipedia article.
  const query = `
SELECT DISTINCT ?prop ?propLabel ?neighbor ?neighborLabel ?neighborImage ?neighborInstanceOf WHERE {
  wd:${qid} ?propUrl ?neighbor.
  ?prop wikibase:directClaim ?propUrl.
  FILTER(isIRI(?neighbor))
  FILTER(?neighbor != wd:${qid})
  ?sitelink schema:about ?neighbor.
  ?sitelink schema:isPartOf <https://en.wikipedia.org/>.
  OPTIONAL { ?neighbor wdt:P31 ?neighborInstanceOf. }
  OPTIONAL { ?neighbor wdt:P18 ?neighborImage. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en".
    ?prop     rdfs:label ?propLabel.
    ?neighbor rdfs:label ?neighborLabel.
  }
} LIMIT 24`;

  const rows = await _sparql(query, `neighbors:${qid}`);

  return rows.map(r => ({
    qid:           r.neighbor.value.split('/').pop(),
    label:         r.neighborLabel?.value       ?? '',
    image:         r.neighborImage?.value        ?? null,
    instanceofQid: r.neighborInstanceOf?.value?.split('/').pop() ?? '',
    pid:           r.prop?.value?.split('/').pop()                ?? '',
    relLabel:      r.propLabel?.value            ?? '',
  }));
}
