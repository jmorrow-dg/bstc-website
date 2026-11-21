import test from 'node:test';
import assert from 'node:assert/strict';
import { COLUMNS, parseCSV, serialise, summarise, validDate } from './citation-summary.mjs';

const observation = () => ({ run_date: '2026-11-02', question_id: 'Q01', engine: 'ChatGPT with search', status: 'complete', observed_at: '2026-11-02T09:00:00+08:00', model: 'not shown', search_mode: 'enabled', locale: 'en-ID', named_bstc: 'yes', linked_url: 'https://www.balistartupandtech.com/faq', cited_page: 'https://www.balistartupandtech.com/faq', links_to_join: 'yes', join_checked_at: '2026-11-02T09:05:00+08:00', answer_file: 'answers/Q01-chatgpt.txt', notes: 'First line, with "quotes"\nSecond line' });
const log = rows => parseCSV(serialise(rows));

test('round trips commas, quotes, newlines, Unicode and CRLF', () => {
  const row = observation(); row.notes += ' café';
  assert.deepEqual(log([row]).rows, [row]);
  assert.deepEqual(parseCSV(serialise([row]).replaceAll('\n', '\r\n')).rows, [row]);
});
test('empty template reports 90 missing observations, never no', () => {
  const result = summarise(log([]), '2026-11-02');
  assert.equal(result.length, 90);
  assert.ok(result.every(row => row.status === 'missing' && row.named_bstc === undefined));
});
test('preserves completed observations and separates dates', () => {
  const row = observation();
  assert.deepEqual(summarise(log([row]), row.run_date)[0], row);
  assert.ok(summarise(log([row]), '2026-11-09').every(r => r.status === 'missing'));
});
test('accepts a real negative answer without citations', () => {
  const row = { ...observation(), named_bstc: 'no', linked_url: '', cited_page: '', links_to_join: 'not_applicable', join_checked_at: '' };
  assert.equal(summarise(log([row]), row.run_date)[0].named_bstc, 'no');
});
test('rejects duplicate observations and malformed CSV', () => {
  const row = observation();
  assert.throws(() => summarise(log([row, row]), row.run_date), /Duplicate/);
  for (const bad of ['a,a\n1,2', 'a,b\n1', 'a\n"open', 'a\n"done"suffix', 'a\nun"quoted']) assert.throws(() => parseCSV(bad));
});
test('unavailable answers are not scored as negative', () => {
  const row = Object.fromEntries(COLUMNS.map(c => [c, '']));
  Object.assign(row, { run_date: '2026-11-02', question_id: 'Q02', engine: 'Claude', status: 'unavailable', observed_at: '2026-11-02T09:00:00+08:00', notes: 'Search unavailable' });
  assert.equal(summarise(log([row]), row.run_date).find(r => r.question_id === 'Q02' && r.engine === 'Claude').status, 'unavailable');
  assert.throws(() => summarise(log([{ ...row, named_bstc: 'no' }]), row.run_date), /blank/);
  assert.throws(() => summarise(log([{ ...row, status: 'no_overview' }]), row.run_date), /Google/);
});
test('rejects unverified join claims, bad IDs and incomplete answer evidence', () => {
  const row = observation();
  for (const change of [{join_checked_at: ''}, {question_id: 'Q19'}, {engine: 'Other'}, {answer_file: ''}, {observed_at: '2026-11-02'}, {links_to_join: 'not_applicable'}, {linked_url: 'javascript:void(0)'}]) {
    assert.throws(() => summarise(log([{ ...row, ...change }]), row.run_date));
  }
});
test('rejects impossible dates', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2026-11-02'), true);
});
