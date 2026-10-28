import assert from 'node:assert/strict';
import fs from 'node:fs';
import { detectBrowserLanguage, isLanguage, languageLocale, resolveLanguage, resolveRegion, LANGUAGE_CODES, REGION_CODES } from '../app/lib/languages';
import { es } from '../app/locales/es';
import { en } from '../app/locales/en';
import { pt } from '../app/locales/pt';
import { ro } from '../app/locales/ro';
import { getDailyPrayerForDate } from '../app/lib/dailyPrayerData';
import { getSOSContent } from '../app/lib/sosData';
import { getNotificationCategories } from '../app/lib/notifications';
import { BIBLE_BOOKS, getBibleBookName } from '../app/lib/bibleData';
import { verses } from '../app/lib/versesData';
import { getChallenges } from '../app/lib/challengeData';
import { getDevotionals } from '../app/lib/devotionalsData';

assert.deepEqual(LANGUAGE_CODES, ['es', 'en', 'pt', 'ro']);
assert.deepEqual(REGION_CODES, ['LATAM', 'US', 'BR', 'ES', 'RO']);
assert.equal(isLanguage('ro'), true);
assert.equal(isLanguage('de'), false);
assert.equal(detectBrowserLanguage('ro-RO'), 'ro');
assert.equal(detectBrowserLanguage('pt-BR'), 'pt');
assert.equal(detectBrowserLanguage('en-US'), 'en');
assert.equal(detectBrowserLanguage('fr-FR'), 'es');
assert.equal(languageLocale('ro'), 'ro-RO');
assert.equal(resolveLanguage('ro', 'en', 'es-ES'), 'ro');
assert.equal(resolveLanguage(undefined, 'pt', 'ro-RO'), 'pt');
assert.equal(resolveLanguage(undefined, undefined, 'ro-RO'), 'ro');
assert.equal(resolveRegion(undefined, undefined, 'ro'), 'RO');

function flatten(value: unknown, path = ''): Record<string, unknown> {
    if (Array.isArray(value)) return { [path]: value };
    if (!value || typeof value !== 'object') return { [path]: value };
    return Object.entries(value).reduce<Record<string, unknown>>((result, [key, child]) => ({
        ...result,
        ...flatten(child, path ? `${path}.${key}` : key),
    }), {});
}

const localeEntries = { es: flatten(es), en: flatten(en), pt: flatten(pt), ro: flatten(ro) };
const expectedKeys = Object.keys(localeEntries.es).sort();
for (const [language, entries] of Object.entries(localeEntries)) {
    assert.deepEqual(Object.keys(entries).sort(), expectedKeys, `${language} keys differ`);
    for (const [key, value] of Object.entries(entries)) {
        if (typeof value === 'string') assert.notEqual(value.trim(), '', `${language}.${key} is empty`);
        const placeholders = (String(localeEntries.es[key]).match(/\{[^}]+\}|%[a-zA-Z]/g) || []).sort();
        assert.deepEqual((String(value).match(/\{[^}]+\}|%[a-zA-Z]/g) || []).sort(), placeholders, `${language}.${key} placeholders differ`);
    }
}
assert.notEqual(ro.common.continue, es.common.continue);
assert.notEqual(ro.auth.login_button, es.auth.login_button);
assert.notEqual(ro.pwa_prompt.title, es.pwa_prompt.title);
const date = new Date('2026-10-27T12:00:00Z');
const romanianPrayer = getDailyPrayerForDate(date, 'ro');
assert.match(romanianPrayer.title, /Rugăciunea/);
assert.notEqual(romanianPrayer.content, getDailyPrayerForDate(date, 'es').content);
assert.equal(getSOSContent('ro').prayers.length, 5);
assert.match(getSOSContent('ro').prayers[0], /Dumnezeu|Doamne|Tată/);
assert.match(getNotificationCategories('ro').PRAYER[0].body, /Dumnezeu/);
assert.equal(getBibleBookName(BIBLE_BOOKS[0], 'ro'), BIBLE_BOOKS[0].name);
assert.match(verses[0].text, /Aunque|valle|muerte/);
assert.equal(getChallenges('ro')[0].question, getChallenges('es')[0].question);
const romanianDevotional = getDevotionals('ro')[0];
assert.match(romanianDevotional.title, /Când/);
assert.match(romanianDevotional.content[0], /Dumnezeu/);
assert.notEqual(romanianDevotional.content[0], getDevotionals('es')[0].content[0]);
assert.match(fs.readFileSync('app/components/DailyPrayerCard.tsx', 'utf8'), /daily_prayer:\$\{language\}/);
assert.match(fs.readFileSync('worker/index.js', 'utf8'), /offlineLanguage/);

console.log('localization contract: ok');
