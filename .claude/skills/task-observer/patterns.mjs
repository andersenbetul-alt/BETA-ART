#!/usr/bin/env node
/*
 * Skill adayi taramasi.
 *
 * Once kelime istatistigiyle otomatik kumeleme denendi ve ATILDI: 54 kisa
 * baslikta terim sikligi anlamli tema vermiyor. Yalnizca gotcha'larda gecen
 * her terim ayni tavan skoru aliyordu, ve uretilen "temalar" -- show, runs,
 * cache -- skill'e cevrilecek seyler degildi. Kumeler anlamsal; okunarak
 * bulunuyor, sayilarak degil.
 *
 * Bu yuzden arac kumelemiyor. Isi, okunmasi gereken satirlari one cikarmak:
 * 135 gozlemden "bir daha isimize yarar" diye isaretlenmis olanlari getirir.
 * Kumeleme ve skill karari okuyana ait.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const DB = process.env.CLAUDE_MEM_DB ?? `${process.env.HOME}/.claude-mem/claude-mem.db`;
const PROJECT = process.env.COBBAN_PROJECT ?? 'BETA-ART';

if (!existsSync(DB)) {
  console.log(`  claude-mem veritabani yok (${DB}) — gozlem toplanmamis.`);
  process.exit(0);
}

const py = `
import sqlite3, json, sys
c = sqlite3.connect(${JSON.stringify(DB)})
rows = c.execute("select id, title, subtitle, concepts, files_modified from observations where project = ? order by id",
                 (${JSON.stringify(PROJECT)},)).fetchall()
out = []
for i, t, s, con, fm in rows:
    def j(x):
        try: return json.loads(x or '[]')
        except Exception: return []
    out.append({"id": i, "title": t or "", "sub": s or "", "con": j(con), "files": j(fm)})
json.dump(out, sys.stdout)
`;
const all = JSON.parse(execFileSync('python3', ['-c', py], { encoding: 'utf8', maxBuffer: 64e6 }));
const marked = all.filter((o) => o.con.includes('gotcha') || o.con.includes('pattern'));

// Skill adi gozlemde aciktan geciyorsa kapsanmis say. Gevsek eslestirme
// (govdede kelime aramak) her skill'i eslestiriyordu, degersizdi.
const dir = '.claude/skills';
const names = existsSync(dir)
  ? readdirSync(dir).filter((d) => existsSync(`${dir}/${d}/SKILL.md`))
  : [];

console.log(`\n  skill adayi taramasi — ${PROJECT}`);
console.log(`  ${all.length} gozlem · ${marked.length} tanesi gotcha/pattern isaretli`);
console.log(`  ${names.length} kurulu skill\n`);
console.log('  Arac kumelemez. Asagidakileri oku, tekrar edeni kendin gor.\n');

for (const o of marked) {
  const tag = o.con.includes('gotcha') ? 'tuzak ' : 'oruntu';
  const hit = names.find((nm) => `${o.title} ${o.sub}`.toLowerCase().includes(nm.replace(/-/g, ' ')));
  console.log(`  ${tag} #${String(o.id).padStart(3)}  ${o.title.slice(0, 88)}`);
  if (o.sub) console.log(`               ${o.sub.slice(0, 88)}`);
  if (o.files.length) console.log(`               → ${o.files.slice(0, 3).join(', ')}`);
  if (hit) console.log(`               (skill var: ${hit})`);
}

console.log(`\n  Karar: tekrar eden bir tema gorduysen ya mevcut skill'i guncelle,`);
console.log(`  ya yenisini yaz. Tek seferlik bir sey skill olmaz.`);
