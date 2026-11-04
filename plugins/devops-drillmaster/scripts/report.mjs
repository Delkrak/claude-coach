#!/usr/bin/env node
// The drill master's report: one HTML page of a project's process - the objective, the flow, each
// work process's input → steps → output, each work policy's rules - built from .drillmaster/ and the
// skills process.md names. Usage: node report.mjs [--project <dir>] [--out <file>]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : fallback
}

/** The sections of process.md under `# <part>`: each `## ` heading's name and its skill folder. */
export const indexEntries = (processText, part) => {
  const body = processText.split(new RegExp(`^# ${part}.*$`, 'm'))[1]?.split(/^# /m)[0] ?? ''
  return body
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const heading = section.split('\n')[0].replace(/`/g, '')
      const name = heading.match(/^(?:\d+\.\s*)?(.+?)\s+—/)?.[1] ?? heading.trim()
      const skillPath = section.match(/^- Skill:\s*(.+)$/m)?.[1].trim() ?? ''
      const states = section.match(/^- States:\s*(.+)$/m)?.[1].replace(/`/g, '') ?? ''
      return { stage: name, skill: path.basename(path.dirname(skillPath)), states }
    })
    .filter((entry) => entry.skill)
}

export const buildReport = (repo) => {
const read = (...parts) => fs.readFileSync(path.join(repo, ...parts), 'utf8').replace(/\r\n/g, '\n')
const readIf = (...parts) => (fs.existsSync(path.join(repo, ...parts)) ? read(...parts) : '')
const index = read('.drillmaster', 'process.md')
const title = index.match(/^# (.*)$/m)?.[1] ?? 'The process'
const entrySkill = index.match(/entry\s+skill\s+`\/?([a-z0-9-]+)`/)?.[1]
const objectiveText = readIf('.drillmaster', 'objective.md')
const measureNames = [...objectiveText.matchAll(/^- \*\*(.*?)\.\*\*/gm)].map((m) => m[1])

const skillFile = (name) => {
  const text = read('.claude', 'skills', name, 'SKILL.md')
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const description = match?.[1].match(/^description:\s*(.*)$/m)?.[1] ?? ''
  const body = (match?.[2] ?? text).trim()
  const title = body.match(/^# (.*)$/m)?.[1] ?? name
  const sections = Object.fromEntries(
    body
      .split(/^## /m)
      .slice(1)
      .map((part) => {
        const [heading, ...rest] = part.split('\n')
        return [heading.trim(), rest.join('\n').trim()]
      }),
  )
  const intro = body.split(/^## /m)[0].replace(/^# .*$/m, '').trim()
  return { name, title, description, intro, sections }
}

/** Numbered items (`2.3 …`) with their continuation lines; a `← …` tail becomes citations. */
const numbered = (text) => {
  const items = []
  let current
  for (const line of (text ?? '').split('\n')) {
    const start = line.match(/^(\d+\.\d+)\s+(.*)$/)
    if (start) {
      current = { id: start[1], lines: [start[2]] }
      items.push(current)
    } else if (current) current.lines.push(line.replace(/^ {4,6}/, ''))
  }
  return items.map(({ id, lines }) => {
    const text = lines.join('\n').trim()
    const intent = text.match(/\nIntent:\s*([\s\S]*?)(?=\nCheck:|$)/)?.[1].replace(/\s+/g, ' ').trim()
    const check = text.match(/\nCheck:\s*([\s\S]*)$/)?.[1].replace(/\s+/g, ' ').trim()
    let main = text.replace(/\nIntent:[\s\S]*$/, '')
    const cites = []
    main = main.replace(/\s*←\s*((?:[^\n]|\n(?=\/?[a-z-]+-policy|§))*)/g, (_, cite) => {
      cites.push(...cite.replace(/\n/g, ' ').split(/,\s*(?=\/?[a-z-]+-policy|§)/).map((c) => c.trim().replace(/,$/, '')).filter(Boolean))
      return ''
    })
    return { id, text: main.trim(), intent, check, cites }
  })
}

/** `- label: value` lines of a section. */
const bullets = (text) =>
  (text ?? '')
    .split(/\n(?=- )/)
    .map((b) => b.replace(/^- /, '').replace(/\n\s+/g, ' ').trim())
    .filter(Boolean)

const processes = indexEntries(index, 'Work processes').map(({ stage, skill: name, states }, i) => {
  const s = skillFile(name)
  const policies = [...new Set(JSON.stringify(s.sections).match(/[a-z]+(?:-[a-z]+)*-policy/g) ?? [])]
  return {
    name,
    stage,
    states: states.split(/,\s*moved by/)[0].split(/\s*→\s*/).map((x) => x.replace(/\(.*?\)/g, '').trim()).filter(Boolean),
    number: i + 1,
    title: s.title,
    description: s.description,
    intro: s.intro,
    serves: measureNames.filter((m) => s.intro.includes(`**${m}**`)),
    input: bullets(s.sections.Input),
    records: bullets(s.sections.Trace ?? s.sections.Records),
    output: bullets(s.sections.Output),
    steps: numbered(s.sections.Steps),
    stepsNote: (s.sections.Steps ?? '').split('\n').filter((l) => /^"/.test(l)).join(' '),
    handsOff: s.sections['Hands off to'] ?? '',
    extra: Object.entries(s.sections)
      .filter(([h]) => !['Input', 'Records', 'Trace', 'Steps', 'Output', 'Hands off to'].includes(h))
      .map(([heading, body]) => ({ heading, body })),
    policies,
  }
})

const policies = indexEntries(index, 'Work policies').map(({ skill: name }) => {
  const s = skillFile(name)
  const find = (prefix) => Object.entries(s.sections).find(([h]) => h.replace(/^\d+\.\s*/, '').startsWith(prefix))?.[1] ?? ''
  return {
    name,
    title: s.title,
    description: s.description,
    intro: s.intro,
    definitions: numbered(find('Definitions')),
    rules: numbered(find('Rules')),
    exceptions: find('Exceptions'),
    cantKeep: find('When a rule'),
    precedence: find('Precedence'),
  }
})

const objective = objectiveText
const data = {
  title,
  goal: objective.match(/## Goal\n\n([\s\S]*?)\n\n## /)?.[1].trim() ?? '',
  measures: (objective.match(/## Measures\n\n([\s\S]*?)\n\n## /)?.[1] ?? '')
    .split(/\n\n(?=- )/)
    .map((m) => {
      const name = m.match(/\*\*(.*?)\.\*\*/)?.[1] ?? ''
      const what = m.match(/\*\*.*?\*\*\s*([\s\S]*?)\n\s*(?:Recorded by|Counted from):/)?.[1].replace(/\s+/g, ' ') ?? ''
      const by = m.match(/(?:Recorded by|Counted from):\s*([\s\S]*?)\n\s*Check:/)?.[1].replace(/\s+/g, ' ') ?? ''
      const check = m.match(/Check:\s*([\s\S]*)$/)?.[1].replace(/\s+/g, ' ') ?? ''
      return { name, what, by, check }
    }),
  direction: objective.match(/## Direction and constraints\n\n([\s\S]*)$/)?.[1].trim() ?? '',
  processes,
  policies,
  entry: entrySkill && fs.existsSync(path.join(repo, '.claude', 'skills', entrySkill)) ? skillFile(entrySkill) : null,
  templates: fs.existsSync(path.join(repo, '.drillmaster', 'templates'))
    ? fs
        .readdirSync(path.join(repo, '.drillmaster', 'templates'))
        .map((file) => ({ name: file, body: read('.drillmaster', 'templates', file) }))
    : [],
}

const json = JSON.stringify(data).replace(/</g, '\\u003c')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title.replace(/</g, '&lt;')}</title>
<!-- Generated from .drillmaster/ and .claude/skills/. Edit those, then rebuild this page. -->
<style>
:root {
  --bg: #f6f5f1; --surface: #ffffff; --sunken: #efede7; --text: #1d1d1b; --muted: #67645d; --line: #dcd9d0;
  --accent: #2f5d8a; --accent-soft: #e3ecf5; --state: #7a5717; --state-soft: #f5ecd8;
  --policy: #36693f; --policy-soft: #e2efe4; --serve: #7a3c6a; --serve-soft: #f3e5ef;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #151514; --surface: #1e1e1c; --sunken: #262624; --text: #ecebe6; --muted: #a29f96; --line: #35342f;
    --accent: #8db6dd; --accent-soft: #22303f; --state: #e2c88f; --state-soft: #3a311f;
    --policy: #9ccaa5; --policy-soft: #213428; --serve: #e0a6d1; --serve-soft: #3a2535;
  }
}
:root[data-theme="dark"] {
  --bg: #151514; --surface: #1e1e1c; --sunken: #262624; --text: #ecebe6; --muted: #a29f96; --line: #35342f;
  --accent: #8db6dd; --accent-soft: #22303f; --state: #e2c88f; --state-soft: #3a311f;
  --policy: #9ccaa5; --policy-soft: #213428; --serve: #e0a6d1; --serve-soft: #3a2535;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
.app { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; }
nav { border-right: 1px solid var(--line); background: var(--surface); padding: 20px 12px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
nav .brand { font-weight: 700; font-size: 1.05rem; padding: 0 10px 12px; }
nav h4 { margin: 18px 10px 6px; font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
nav a { display: block; padding: 6px 10px; border-radius: 7px; color: var(--text); text-decoration: none; font-size: .92rem; }
nav a:hover { background: var(--sunken); }
nav a[aria-current="page"] { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
nav a .num { display: inline-block; width: 1.4em; color: var(--muted); }
nav .theme { margin: 20px 10px 0; background: none; border: 1px solid var(--line); color: var(--muted); border-radius: 7px; padding: 4px 10px; cursor: pointer; font: inherit; font-size: .85rem; }
main { padding: 32px 40px 80px; max-width: 980px; }
@media (max-width: 800px) {
  .app { grid-template-columns: 1fr; }
  nav { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--line); }
  main { padding: 20px 16px 60px; }
}
h1 { font-size: 1.75rem; margin: 0 0 6px; line-height: 1.25; }
h2 { font-size: 1.1rem; margin: 32px 0 12px; }
.sub { color: var(--muted); margin: 0 0 20px; max-width: 70ch; }
code { background: var(--sunken); padding: 1px 5px; border-radius: 4px; font-size: .88em; }
pre { background: var(--sunken); padding: 12px 14px; border-radius: 8px; overflow-x: auto; font-size: .85rem; }
pre code { background: none; padding: 0; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
blockquote { margin: 0; padding: 14px 18px; border-left: 4px solid var(--accent); background: var(--surface); border-radius: 0 12px 12px 0; font-size: 1.05rem; }
.chip { display: inline-block; font-size: .78rem; padding: 2px 9px; border-radius: 999px; margin: 2px 4px 2px 0; white-space: nowrap; }
.chip.state { background: var(--state-soft); color: var(--state); }
.chip.policy { background: var(--policy-soft); color: var(--policy); text-decoration: none; }
.chip.serve { background: var(--serve-soft); color: var(--serve); }
.label { font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.measure .name { font-weight: 650; margin-bottom: 4px; }
.measure p { margin: 6px 0 0; font-size: .9rem; }
.flow { display: flex; align-items: stretch; gap: 0; overflow-x: auto; padding: 4px 0 8px; }
.flow .step { flex: 1 0 150px; background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--accent); border-radius: 12px; padding: 12px; text-decoration: none; color: inherit; }
.flow .step:hover { background: var(--accent-soft); }
.flow .step .n { font-size: .78rem; color: var(--accent); font-weight: 700; }
.flow .step .t { font-weight: 650; display: block; margin: 2px 0 8px; }
.flow .arrow { flex: 0 0 26px; display: grid; place-items: center; color: var(--muted); font-size: 1.2rem; }
.loops { margin-top: 10px; display: grid; gap: 6px; font-size: .88rem; color: var(--muted); }
table { border-collapse: collapse; width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
th, td { border-bottom: 1px solid var(--line); padding: 8px 12px; text-align: left; font-size: .9rem; }
th { background: var(--sunken); font-weight: 600; }
td.dot { text-align: center; color: var(--policy); font-weight: 700; }
.io { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 10px; align-items: stretch; }
.io .arrow { display: grid; place-items: center; color: var(--muted); }
@media (max-width: 800px) { .io { grid-template-columns: 1fr; } .io .arrow { transform: rotate(90deg); } }
.io ul { margin: 0; padding-left: 18px; font-size: .9rem; }
.io li { margin: 3px 0; }
.timeline { list-style: none; margin: 0; padding: 0; position: relative; }
.timeline::before { content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px; width: 2px; background: var(--line); }
.timeline li { position: relative; display: grid; grid-template-columns: 44px 1fr; gap: 12px; margin-bottom: 10px; }
.timeline .id { position: relative; z-index: 1; height: 28px; border-radius: 999px; background: var(--accent); color: #fff; font-size: .78rem; font-weight: 700; display: grid; place-items: center; }
.timeline li.capture .id { background: var(--serve); }
.timeline .body { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; }
.timeline .body p { margin: 0; }
.timeline .cites { margin-top: 6px; }
.rule { display: grid; grid-template-columns: 56px 1fr; gap: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
.rule .id { font-weight: 700; color: var(--policy); font-size: 1.05rem; }
.rule .text { margin: 0 0 8px; }
.rule .meta { display: grid; grid-template-columns: 60px 1fr; gap: 4px 10px; font-size: .86rem; color: var(--muted); }
.rule .meta b { color: var(--text); font-weight: 600; }
.rule.moved { opacity: .6; }
.defs { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; font-size: .9rem; }
.defs .id { color: var(--muted); }
.md p:first-child { margin-top: 0; }
</style>
</head>
<body>
<div class="app">
  <nav id="nav"></nav>
  <main id="main"></main>
</div>
<script id="data" type="application/json">${json}</script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script>
const data = JSON.parse(document.getElementById('data').textContent)
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const inline = (md) => (window.marked ? window.marked.parseInline(md ?? '') : esc(md))
const block = (md) => (window.marked ? window.marked.parse(md ?? '') : '<pre>' + esc(md) + '</pre>')
const policyChip = (name) => '<a class="chip policy" href="#' + name + '">' + esc(name) + '</a>'
const cite = (c) => {
  const policy = c.match(/^\\/?([a-z-]+-policy)/)
  return policy ? '<a class="chip policy" href="#' + policy[1] + '">' + esc(c) + '</a>' : '<span class="chip policy">' + esc(c) + '</span>'
}

const nav = document.getElementById('nav')
nav.innerHTML =
  '<div class="brand">' + esc(data.title) + '</div>' +
  '<a href="#overview">Overview</a>' +
  '<h4>Work processes</h4>' +
  data.processes.map((p) => '<a href="#' + p.name + '"><span class="num">' + p.number + '</span>' + esc(p.stage) + '</a>').join('') +
  '<h4>Work policies</h4>' +
  data.policies.map((p) => '<a href="#' + p.name + '">' + esc(p.title) + '</a>').join('') +
  '<h4>Reference</h4>' +
  (data.entry ? '<a href="#' + data.entry.name + '">' + esc(data.entry.title) + '</a>' : '') +
  (data.templates.length ? '<a href="#templates">Templates</a>' : '') +
  '<button class="theme" id="theme" type="button">Light / dark</button>'

const overview = () => {
  const flow = data.processes
    .map((p, i) =>
      (i ? '<div class="arrow">→</div>' : '') +
      '<a class="step" href="#' + p.name + '"><span class="n">' + p.number + '</span><span class="t">' + esc(p.stage) + '</span>' +
      p.states.map((s) => '<span class="chip state">' + esc(s) + '</span>').join('') + '</a>',
    )
    .join('')
  const matrix =
    '<table><tr><th>Work process</th>' + data.policies.map((p) => '<th>' + esc(p.name) + '</th>').join('') + '</tr>' +
    data.processes.map((p) => '<tr><td><a href="#' + p.name + '">' + p.number + '. ' + esc(p.stage) + '</a></td>' +
      data.policies.map((q) => '<td class="dot">' + (p.policies.includes(q.name) ? '●' : '') + '</td>').join('') + '</tr>').join('') +
    '</table>'
  return (
    '<h1>' + esc(data.title) + '</h1><p class="sub">How a work item moves from the owner\\'s idea to a merged PR, which work policies it must meet on the way, and how every step is traced so the process can improve.</p>' +
    '<h2>Goal</h2><blockquote>' + inline(data.goal.replace(/^"|"$/g, '')) + '</blockquote>' +
    '<h2>Measures</h2><div class="grid">' +
    data.measures.map((m) => '<div class="card measure"><div class="name">' + esc(m.name) + '</div><div>' + inline(m.what) + '</div>' +
      '<p><span class="label">Recorded by</span><br>' + inline(m.by) + '</p><p><span class="label">Check</span><br>' + inline(m.check) + '</p></div>').join('') +
    '</div><h2>Direction</h2><div class="card md">' + block(data.direction) + '</div>' +
    '<h2>The flow</h2><div class="flow">' + flow + '</div>' +
    '<div class="loops"><div>↺ Feedback on a ready PR sends it back to the pre-PR review, in the same session.</div>' +
    '<div>⏸ Stuck at any stage: <span class="chip state">Needs input</span> with the question on the issue and in the session, then back to the state it left.</div>' +
    '<div>⚙ Linear\\'s GitHub automation moves AI Review, Review and Done; the work processes move the rest.</div></div>' +
    '<h2>Which work policy each work process meets</h2>' + matrix
  )
}

const processView = (p) =>
  '<div class="label">Work process ' + p.number + ' · <code>' + esc(p.name) + '</code></div>' +
  '<h1>' + esc(p.title.replace(/^\\d+\\.\\s*/, '')) + '</h1>' +
  '<p class="sub">' + inline(p.description) + '</p>' +
  '<div>' + p.serves.map((s) => '<span class="chip serve">serves: ' + esc(s) + '</span>').join('') +
  p.states.map((s) => '<span class="chip state">→ ' + esc(s) + '</span>').join('') + '</div>' +
  '<h2>Input → output</h2><div class="io">' +
  '<div class="card"><div class="label">Input</div><ul>' + p.input.map((x) => '<li>' + inline(x) + '</li>').join('') + '</ul></div><div class="arrow">→</div>' +
  '<div class="card"><div class="label">Trace</div><ul>' + p.records.map((x) => '<li>' + inline(x) + '</li>').join('') + '</ul></div><div class="arrow">→</div>' +
  '<div class="card"><div class="label">Output</div><ul>' + p.output.map((x) => '<li>' + inline(x) + '</li>').join('') + '</ul></div></div>' +
  '<h2>Steps</h2><ol class="timeline">' +
  p.steps.map((s) => '<li class="' + (/devops-drillmaster:trace/.test(s.text) ? 'capture' : '') + '"><div class="id">' + s.id + '</div><div class="body md">' +
    block(s.text) + (s.cites.length ? '<div class="cites">' + s.cites.map(cite).join('') + '</div>' : '') + '</div></li>').join('') +
  '</ol>' + (p.stepsNote ? '<p class="sub">' + inline(p.stepsNote) + '</p>' : '') +
  '<h2>Hands off to</h2><div class="card md">' + block(p.handsOff) + '</div>' +
  p.extra.map((e) => '<h2>' + esc(e.heading) + '</h2><div class="card md">' + block(e.body) + '</div>').join('') +
  '<h2>Work policies it cites</h2><div>' + p.policies.map(policyChip).join('') + '</div>'

const policyView = (p) =>
  '<div class="label">Work policy · <code>' + esc(p.name) + '</code></div><h1>' + esc(p.title) + '</h1>' +
  '<p class="sub">' + inline(p.description) + '</p>' +
  (p.definitions.length ? '<h2>Definitions</h2><div class="card defs">' + p.definitions.map((d) => '<span class="id">' + d.id + '</span><span>' + inline(d.text) + '</span>').join('') + '</div>' : '') +
  '<h2>Rules</h2>' +
  p.rules.map((r) => '<div class="rule' + (/^(Moved|Merged|Removed)/.test(r.text) ? ' moved' : '') + '"><div class="id">' + r.id + '</div><div><p class="text">' + inline(r.text.replace(/\\n/g, ' ')) + '</p>' +
    (r.intent ? '<div class="meta"><b>Intent</b><span>' + inline(r.intent) + '</span>' + (r.check ? '<b>Check</b><span>' + inline(r.check) + '</span>' : '') + '</div>' : '') + '</div></div>').join('') +
  '<h2>Exceptions</h2><div class="card md">' + block(p.exceptions) + '</div>' +
  '<h2>When a rule can\\'t be kept</h2><div class="card md">' + block(p.cantKeep) + '</div>' +
  (p.precedence ? '<h2>Precedence</h2><div class="card md">' + block(p.precedence) + '</div>' : '')

const entryView = () => {
  const e = data.entry
  return '<div class="label">Entry skill · <code>/' + esc(e.name) + '</code></div><h1>' + esc(e.title) + '</h1><p class="sub">' + inline(e.description) + '</p>' +
    Object.entries(e.sections).map(([h, b]) => '<h2>' + esc(h) + '</h2><div class="card md">' + block(b) + '</div>').join('')
}

const templatesView = () =>
  '<h1>Templates</h1><p class="sub">The artifacts the work processes fill in, from <code>.drillmaster/templates/</code>.</p>' +
  data.templates.map((t) => '<h2><code>' + esc(t.name) + '</code></h2><div class="card"><pre><code>' + esc(t.body) + '</code></pre></div>').join('')

const show = () => {
  const id = location.hash.slice(1) || 'overview'
  const process = data.processes.find((p) => p.name === id)
  const policy = data.policies.find((p) => p.name === id)
  document.getElementById('main').innerHTML = process ? processView(process) : policy ? policyView(policy)
    : data.entry && id === data.entry.name ? entryView() : id === 'templates' ? templatesView() : overview()
  nav.querySelectorAll('a').forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + id) || a.setAttribute('aria-current', 'page'))
  nav.querySelectorAll('a').forEach((a) => (a.getAttribute('href') === '#' + id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')))
  window.scrollTo(0, 0)
}
window.addEventListener('hashchange', show)
show()

const root = document.documentElement
const saved = (() => { try { return localStorage.getItem('theme') } catch { return null } })()
if (saved) root.dataset.theme = saved
document.getElementById('theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  root.dataset.theme = dark ? 'light' : 'dark'
  try { localStorage.setItem('theme', root.dataset.theme) } catch {}
})
</script>
</body>
</html>
`

return html
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repo = path.resolve(arg('--project', '.'))
  const out = path.resolve(repo, arg('--out', 'process-overview.html'))
  const html = buildReport(repo)
  fs.writeFileSync(out, html)
  console.log('wrote', out, Math.round(html.length / 1024) + ' KB')
}
