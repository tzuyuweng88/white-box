import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, BookOpen, Box, ChevronDown, Compass, House, NotebookPen, Pencil, Settings as Gear, Sparkles, Scale, Route, ShieldCheck, Trash2, X } from 'lucide-react'
import { basics, scenarios, valueIds, values } from './content'
import type { ValueId } from './content'
import { attempt, demo, load, storageKey } from './state'
import type { Attempt, Entry } from './state'
import { Back, Badge, Field, Heading, Next, OrderList } from './ui'
import { choiceText, Dilemma } from './Dilemma'
import { Designer } from './Designer'
import '@fontsource-variable/dm-sans'
import '@fontsource/instrument-serif/latin-400.css'
import './style.css'

const nav = [{ name: 'Home', path: 'home', Icon: House }, { name: 'Lessons', path: 'lessons', Icon: BookOpen }, { name: 'Values Studio', path: 'studio', Icon: Compass }, { name: 'My Guide', path: 'guide', Icon: NotebookPen }, { name: 'Settings', path: 'settings', Icon: Gear }]
const activities = [
  { title: 'Explore Values', description: 'Learn about different values and what they might mean when using AI.', label: 'Explore Values', target: 'explore', Icon: Compass, color: '#e9ddf8' },
  { title: 'Try a Dilemma', description: 'Practice making decisions when there isn’t an easy answer.', label: 'Try a Dilemma', target: 'dilemmas', Icon: Scale, color: '#ffe7a3' },
  { title: 'My Values Guide', description: 'See the values and guidelines you’ve been building.', label: 'Open My Guide', target: 'guide', Icon: NotebookPen, color: '#ddeed9' },
]
type Go = (path: string) => void
const readRoute = () => window.location.hash.slice(1) || 'home'
const date = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' })

function ValueForm({ id, entry, board, save, back }: { id: ValueId; entry?: Entry; board: Entry[]; save: (entry: Entry, replace?: ValueId) => void; back: Go }) {
  const value = values[id]
  const [definition, setDefinition] = useState(entry?.definition ?? '')
  const [guideline, setGuideline] = useState(entry?.guideline ?? '')
  const [reflection, setReflection] = useState(entry?.reflection ?? '')
  const [replace, setReplace] = useState<ValueId | ''>('')
  const full = !entry && board.length >= 5
  return <div className="value-page">
    <Back onClick={() => back('explore')}>Explore Values</Back>
    <div className="value-hero" style={{ background: value.color }}><Badge id={id}/><Heading title={value.name} subtitle={value.definition}/></div>
    <div className="detail-grid"><article className="panel"><h2>What does it mean?</h2><p>{value.definition}</p><h2>What might this look like when using AI?</h2><p>{value.example}</p></article>
    <form className="panel" onSubmit={e => { e.preventDefault(); if (definition.trim() && guideline.trim() && (!full || replace)) save({ id, definition: definition.trim(), guideline: guideline.trim(), reflection: reflection.trim(), updated: new Date().toISOString() }, replace || undefined) }}>
      <h2>Think About It</h2>
      <Field label={value.question} value={reflection} onChange={setReflection}/>
      <Field label="What does this value mean to you?" value={definition} onChange={setDefinition} placeholder={`To me, ${value.name.toLowerCase()} means…`} limit={240}/>
      <Field label="How might this value guide your AI use?" value={guideline} onChange={setGuideline} placeholder="When using AI, I want to…" limit={240}/>
      {full && <label className="field"><span>Your board has five values. Choose one to replace. Its saved answers will be removed from the board.</span><select value={replace} onChange={e => setReplace(e.target.value as ValueId | '')}><option value="">Choose a value to replace</option>{board.map(item => <option key={item.id} value={item.id}>{values[item.id].name}</option>)}</select></label>}
      <div className="actions"><button className="primary" type="submit" disabled={!definition.trim() || !guideline.trim() || (full && !replace)}>{full ? 'Replace Value on My Board' : 'Save to My Values Board'}</button><button className="secondary" type="button" onClick={() => back('explore')}>Back to Explore Values</button></div>
    </form></div>
  </div>
}

function LearningHistory({ history, remove }: { history: Attempt[]; remove?: (id: string) => void }) {
  if (!history.length) return <p className="muted">Your saved dilemma reflections will appear here.</p>
  return <div className="history">{[...history].reverse().map(item => <details key={item.id} className="history-item"><summary><span>{scenarios[item.scenario].title}</span><time dateTime={item.completed}>{date(item.completed!)}</time></summary>
    <dl><dt>First choice</dt><dd>{choiceText(item.scenario, item.initial, item.idea)}</dd><dt>Final choice</dt><dd>{choiceText(item.scenario, item.choice, item.finalIdea)}</dd>
    {item.selected.length > 0 && <><dt>Values I considered</dt><dd className="tags">{item.selected.map(id => <Badge key={id} id={id} small/>)}</dd></>}
    {item.ranked && <><dt>Before this dilemma</dt><dd>{item.before.map(id => values[id].name).join(' → ') || 'No values saved yet.'}</dd><dt>In this dilemma</dt><dd>{item.ranking.map(id => values[id].name).join(' → ')}</dd></>}
    {([['Why these values mattered', item.why], ['How the values pulled in different directions', item.tension], ['What mattered most', item.decision], ['What changed', item.changed], ['What was difficult', item.difficult], ['Values I found hard to balance', item.balance], ['How my thinking changed', item.learning], ['Where I landed', item.stance]]).filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    {item.revision && <><dt>How I revised {values[item.revision.before.id].name}</dt><dd><strong>Before</strong><p>{item.revision.before.definition}</p><p>{item.revision.before.guideline}</p><strong>After</strong><p>{item.revision.after.definition}</p><p>{item.revision.after.guideline}</p></dd></>}</dl>
    {remove && <button className="secondary danger" onClick={() => remove(item.id)}><Trash2 size={16}/>Delete Reflection</button>}</details>)}</div>
}

function ResponsibleBasics() {
  return <section className="panel basics"><h2><ShieldCheck size={24}/>Responsible AI Basics</h2><ul>{basics.map(text => <li key={text}>{text}</li>)}</ul></section>
}

function App() {
  const [state, setState] = useState(load)
  const [route, setRoute] = useState(readRoute)
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState('')
  const [confirm, setConfirm] = useState<{ title: string; description: string; label: string; action: () => void } | null>(null)
  const [editOrigin, setEditOrigin] = useState('board')
  const [storageError, setStorageError] = useState(false)
  const notify = (text: string) => setToast(text)
  useEffect(() => {
    const handle = () => { setRoute(readRoute()); setMenu(false); window.scrollTo(0, 0); requestAnimationFrame(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })) }
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)) }
    catch { setStorageError(true) }
  }, [state])
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(''), 3600)
    return () => clearTimeout(timeout)
  }, [toast])
  useEffect(() => {
    document.documentElement.classList.toggle('large-text', state.settings.larger)
    document.documentElement.classList.toggle('reduced-motion', state.settings.motion)
    document.documentElement.classList.toggle('high-contrast', state.settings.contrast)
  }, [state.settings])
  const go: Go = path => { setMenu(false); if (readRoute() !== path) window.location.hash = path }
  const [page, sub] = route.split('/')
  const currentId = valueIds.includes(sub as ValueId) ? sub as ValueId : null
  const active = ['studio', 'explore', 'value', 'board', 'dilemmas', 'dilemma', 'review'].includes(page) ? 'studio' : page === 'design' ? 'guide' : page === 'journey' || page === 'profile' ? 'home' : page
  const reflections = state.history.filter(item => !item.reflectionDeleted)
  const count = new Set(state.history.map(item => item.scenario)).size
  const openValue = (id: ValueId, origin = 'board') => {
    setEditOrigin(origin)
    setState(current => current.explored.includes(id) ? current : { ...current, explored: [...current.explored, id] })
    go(`value/${id}`)
  }
  useEffect(() => {
    if (page === 'value' && currentId) setState(current => current.explored.includes(currentId) ? current : { ...current, explored: [...current.explored, currentId] })
  }, [page, currentId])
  const orderBoard = (ids: ValueId[]) => setState(current => ({ ...current, board: ids.map(id => current.board.find(entry => entry.id === id)!).filter(Boolean) }))
  const start = (id: string, fresh = false) => {
    setState(current => !fresh && current.drafts[id] ? current : { ...current, drafts: { ...current.drafts, [id]: attempt(id, current.board.map(entry => entry.id)) } })
    go(`dilemma/${id}`)
  }
  const draft = state.drafts[sub]
  const updateDraft = (patch: Partial<Attempt>) => setState(current => ({ ...current, drafts: { ...current.drafts, [sub]: { ...current.drafts[sub], ...patch } } }))
  const complete = (patch: Partial<Attempt>, revision?: Entry) => {
    setState(current => {
      const before = revision ? current.board.find(entry => entry.id === revision.id) : undefined
      const saved = { ...current.drafts[sub], ...patch, revisionDraft: undefined, completed: new Date().toISOString(), revision: revision && before ? { before, after: revision } : undefined }
      const drafts = { ...current.drafts }
      delete drafts[sub]
      return { ...current, drafts, history: [...current.history, saved], board: revision ? current.board.map(entry => entry.id === revision.id ? revision : entry) : current.board }
    })
    notify(revision ? 'Reflection saved and your value was updated.' : 'Your reflection was saved.')
    go(`review/${sub}`)
  }
  const journey = <section className="journey"><div className="section-heading"><div><h2>Your Learning Journey</h2><p>See what you’ve explored and saved so far.</p></div>{page !== 'journey' && <button className="text-button" onClick={() => go('journey')}>View journey<ArrowRight size={16}/></button>}</div><div className="stats">
    {[{ title: 'Values explored', total: state.explored.length, max: 6, Icon: Compass, color: '#e9ddf8' }, { title: 'Dilemmas completed', total: count, max: 3, Icon: Scale, color: '#ffe7a3' }, { title: 'Reflections saved', total: reflections.length, Icon: NotebookPen, color: '#ddeed9' }].map(({ title, total, max, Icon, color }) => <div className="stat" key={title}><span className="stat-icon" style={{ background: color }}><Icon size={19}/></span><div><strong>{total}{max && <small> / {max}</small>}</strong><p>{title}</p></div></div>)}
  </div></section>
  const cards = (studio: boolean) => <div className="activity-grid">{activities.map(({ title, description, label, target, Icon, color }) => {
    const board = studio && target === 'guide'
    return <article className="activity" key={target} style={{ '--card-accent': color } as React.CSSProperties}><span className="value-icon" style={{ background: color }}><Icon size={27}/></span><h2>{board ? 'My Values Board' : title}</h2><p>{board ? 'Collect your values and decide how you want to use AI.' : description}</p><button onClick={() => go(board ? 'board' : target)}>{board ? 'Open My Values Board' : label}<ArrowRight size={17}/></button></article>
  })}</div>
  const removeReflection = (id: string) => setConfirm({ title: 'Delete this reflection?', description: 'This clears your written reflections for this attempt. Your choices and saved ranking stay in your dilemma history.', label: 'Delete Reflection', action: () => { setState(current => ({ ...current, history: current.history.map(item => item.id === id ? { ...item, reflectionDeleted: true, why: '', tension: '', decision: '', changed: '', difficult: '', balance: '', learning: '', stance: '', revision: undefined } : item) })); notify('Reflection deleted.') } })
  const valueDetails = (entry: Entry) => <><dl className="entry-details"><div><dt>What it means to me</dt><dd>{entry.definition}</dd></div><div><dt>How I want to use AI</dt><dd>{entry.guideline}</dd></div></dl>{entry.sample ? <span className="sample">Demo example</span> : <small className="muted">Updated {date(entry.updated)}</small>}</>
  let screen
  if (page === 'home' || page === 'studio') screen = <>
    <section className="hero"><div><h1 tabIndex={-1}>{page === 'home' ? 'Hi, Sarah!' : 'Values Studio'}</h1><p>{page === 'home' ? 'Explore what matters to you, think through tricky choices, and build your own guide for using AI.' : 'Explore important values, think through real situations, and build your own guide for using AI.'}</p><Next onClick={() => go('explore')}>Explore Values</Next></div><img src="/sarah-hero.webp" alt="Sarah writes in a notebook beside her laptop" /></section>
    {cards(page === 'studio')}{journey}</>
  else if (page === 'explore') screen = <><Heading title="Explore Values" subtitle="Values are ideas about what matters to us. They can help us think through decisions, especially when the answer isn’t simple."><button className="secondary" onClick={() => go('board')}>My Values Board<ArrowRight size={17}/></button></Heading><div className="values-grid">{valueIds.map(id => <button className="value-card" style={{ '--card-accent': values[id].color } as React.CSSProperties} key={id} onClick={() => openValue(id)}><Badge id={id}/><strong>{values[id].name}</strong><span>{values[id].definition}</span><span className="card-link">Explore This Value<ArrowRight size={17}/></span></button>)}</div></>
  else if (page === 'value' && currentId) screen = <ValueForm key={currentId} id={currentId} entry={state.board.find(entry => entry.id === currentId)} board={state.board} back={go} save={(entry, replace) => {
    setState(current => {
      const old = current.board.find(item => item.id === (replace ?? entry.id))
      return { ...current, board: old ? current.board.map(item => item.id === old.id ? entry : item) : [...current.board, entry] }
    })
    notify(`${values[entry.id].name} saved to your board.`)
    go(editOrigin)
  }}/>
  else if (page === 'board') screen = <><Heading title="My Values Board" subtitle="These are the values you’re exploring. Your ideas can change as you learn."><span className="board-count">{state.board.length} / 5 values</span></Heading>
    {state.board.length ? <OrderList ids={state.board.map(entry => entry.id)} onChange={orderBoard} detail={id => { const entry = state.board.find(item => item.id === id)!; return <div className="board-detail">{valueDetails(entry)}<div className="actions"><button className="secondary" onClick={() => openValue(id)}><Pencil size={16}/>Edit {values[id].name}</button><button className="secondary danger" onClick={() => setConfirm({ title: `Remove ${values[id].name}?`, description: 'This removes the value and its saved answers from your board.', label: 'Remove Value', action: () => { setState(current => ({ ...current, board: current.board.filter(item => item.id !== id) })); notify('Value removed.') } })}><Trash2 size={16}/>Remove</button></div></div> }}/> : <div className="panel"><p>Your board is empty. Explore a value to add your own definition and guideline.</p></div>}
    <p className="muted">You can always come back to rethink or update your values.</p><div className="actions">{state.board.length < 5 ? <button className="secondary" onClick={() => go('explore')}>Add a Value</button> : <button className="secondary" onClick={() => go('explore')}>Explore a Replacement</button>}<Next onClick={() => go('dilemmas')}>Practice with a Dilemma</Next></div>{state.board.length === 5 && <p className="muted">Your board is full. You can choose which existing value to replace when saving a new one.</p>}</>
  else if (page === 'dilemmas') screen = <><Heading title="Let’s Think Through a Dilemma" subtitle="Sometimes, different values matter at the same time. Explore a situation and decide what you would do."/><div className="scenario-list">{Object.entries(scenarios).map(([id, data]) => {
    const completed = state.history.some(item => item.scenario === id)
    return <article className="panel scenario-card" key={id}><span className="value-icon" style={{ background: data.color }}><data.Icon size={27}/></span><div><h2>{data.title}</h2><p>{data.description}</p><div className="tags">{data.tags.map(id => <Badge key={id} id={id} small/>)}</div></div><div className="scenario-actions">{(state.drafts[id] || !completed) && <Next onClick={() => start(id)}>{state.drafts[id] ? 'Continue Dilemma' : 'Explore This Dilemma'}</Next>}{completed && <button className="secondary" onClick={() => go(`review/${id}`)}>Review Previous Responses</button>}</div></article>
  })}</div></>
  else if (page === 'dilemma' && scenarios[sub]) screen = draft ? <Dilemma key={draft.id} draft={draft} board={state.board} update={updateDraft} finish={complete} exit={() => go('dilemmas')} updateOrder={ids => { orderBoard(ids); notify('Your Values Board order was updated.') }}/> : <><Heading title={scenarios[sub].title}/><Next onClick={() => start(sub)}>Start Dilemma</Next></>
  else if (page === 'review' && scenarios[sub]) screen = <><Back onClick={() => go('dilemmas')}>All dilemmas</Back><Heading title={scenarios[sub].title} subtitle="Review your previous choices, rankings, and reflections."/><LearningHistory history={state.history.filter(item => item.scenario === sub)}/><div className="actions mt-5"><Next onClick={() => start(sub)}>{state.drafts[sub] ? 'Continue Dilemma' : 'Try It Again'}</Next><button className="secondary" onClick={() => go('dilemmas')}>Try Another Dilemma</button><button className="secondary" onClick={() => go('guide')}>Open My Guide</button></div></>
  else if (page === 'guide') screen = <><Heading title="My AI Values Guide" subtitle="A guide you create and keep building as you learn."><Next onClick={() => go('design')}>Design My Guide</Next></Heading><section className="guide-values">{state.board.map(entry => <article className="panel guide-entry" key={entry.id}><div className="guide-entry-heading"><Badge id={entry.id}/><h2>{values[entry.id].name}</h2><button className="icon-button" aria-label={`Edit ${values[entry.id].name}`} onClick={() => openValue(entry.id, 'guide')}><Pencil size={18}/></button></div>{valueDetails(entry)}</article>)}</section>{!state.board.length && <div className="panel"><Next onClick={() => go('explore')}>Explore Values</Next></div>}
    <section className="panel spaced"><h2>My Learning Reflections</h2><p className="muted">Saved in this browser for you to revisit.</p><LearningHistory history={reflections}/></section><ResponsibleBasics/></>
  else if (page === 'design') screen = <Designer board={state.board} initial={state.design} save={design => { setState(current => ({ ...current, design })); notify('Your design was saved.') }} back={() => go('guide')} edit={entry => openValue(entry.id, 'design')} notice={notify}/>
  else if (page === 'settings') screen = <><Heading title="Settings" subtitle="Choose how White Box works for you."/><div className="settings-grid"><section className="panel"><h2>Accessibility</h2>{([{ key: 'larger', label: 'Larger text' }, { key: 'motion', label: 'Reduced motion' }, { key: 'contrast', label: 'High contrast' }] as const).map(({ key, label }) => <label className="toggle" key={key}><input type="checkbox" checked={state.settings[key]} onChange={e => setState(current => ({ ...current, settings: { ...current.settings, [key]: e.target.checked } }))}/>{label}</label>)}</section><section className="panel"><h2>Privacy</h2><p>Your Values Guide and reflections are saved in this browser for this demo.</p></section></div><section className="panel spaced"><h2>My Learning Data</h2><h3>Saved reflections</h3><LearningHistory history={reflections} remove={removeReflection}/><button className="secondary danger spaced" onClick={() => setConfirm({ title: 'Reset demo progress?', description: 'This clears your saved values, drafts, reflections, design, and preferences in this browser and restores Sarah’s starter example.', label: 'Reset Demo', action: () => { setState(demo()); notify('Demo progress reset.') } })}>Reset Demo</button></section></>
  else if (page === 'journey') screen = <><Heading title="My Learning Journey"/>{journey}<section className="panel spaced"><h2>My Learning Reflections</h2><LearningHistory history={reflections}/></section></>
  else if (page === 'profile') screen = <><Heading title="My Profile"/><div className="panel profile-card"><span className="avatar"><img src="/sarah-avatar.webp" alt=""/></span><div><h2>Sarah</h2><p>Grade 10 · Demo profile</p></div></div><div className="actions mt-5"><Next onClick={() => go('journey')}>My Learning Journey</Next></div></>
  else if (page === 'lessons') screen = <><Heading title="Lessons" subtitle="Build habits for using AI thoughtfully, then practice them in a real situation."/><ResponsibleBasics/><div className="actions mt-5"><Next onClick={() => go('dilemmas')}>Practice with a Dilemma</Next></div><section className="panel spaced"><h2>Learning resources</h2><p>Explore how high school students can question AI outputs and discuss the choices people make with AI.</p><ul><li><a href="https://craft.stanford.edu/resource/what-principles-should-guide-ethical-use-of-ai/" target="_blank" rel="noreferrer">Stanford CRAFT · What principles should guide ethical use of AI?</a></li><li><a href="https://hai.stanford.edu/education/k-12" target="_blank" rel="noreferrer">Stanford HAI · K–12 Education</a></li></ul></section></>
  else screen = <><Heading title="This page is unavailable"/><Next onClick={() => go('home')}>Return Home</Next></>

  return <div className="app"><a className="skip" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus() }}>Skip to content</a>
    <aside className="sidebar"><a href="#home" className="brand"><span><Box size={25}/></span>White Box</a><nav aria-label="Main navigation">{nav.map(({ name, path, Icon }) => <a key={path} href={`#${path}`} className={active === path ? 'active' : ''} aria-current={active === path ? 'page' : undefined}><Icon size={20}/><span>{name}</span></a>)}</nav><div className="sidebar-bottom"><button onClick={() => go('journey')}><Route size={19}/>My Learning Journey</button></div></aside>
    <div className="workspace"><header className="topbar"><span className="section-name">{nav.find(item => item.path === active)?.name ?? 'White Box'}</span><div className="profile" onKeyDown={e => { if (e.key === 'Escape') { setMenu(false); document.getElementById('profile-trigger')?.focus() } }}><button id="profile-trigger" className="profile-trigger" aria-expanded={menu} aria-controls="profile-links" onClick={() => setMenu(!menu)}><span className="avatar"><img src="/sarah-avatar.webp" alt=""/></span><span><strong>Sarah</strong><small>Grade 10</small></span><ChevronDown size={15}/></button>{menu && <div className="profile-menu" id="profile-links">{[{ label: 'My Profile', path: 'profile' }, { label: 'My Learning Journey', path: 'journey' }, { label: 'Settings', path: 'settings' }].map(item => <button key={item.path} onClick={() => go(item.path)}>{item.label}</button>)}</div>}</div></header>
      <main id="main-content" tabIndex={-1}>{storageError && <p className="note" role="status">This browser could not save your changes. Keep this tab open to continue working.</p>}{screen}</main>
      <footer className="app-footer"><Box size={15}/>White Box <span>·</span> Values-Guided Ethical Learning</footer>
    </div>
    {toast && <div className="toast" role="status"><Sparkles size={18}/>{toast}<button className="icon-button" aria-label="Dismiss message" onClick={() => setToast('')}><X size={17}/></button></div>}
    {confirm && <ConfirmDialog title={confirm.title} description={confirm.description} label={confirm.label} close={() => setConfirm(null)} action={() => { confirm.action(); setConfirm(null) }}/>}
  </div>
}

function ConfirmDialog({ title, description, label, close, action }: { title: string; description: string; label: string; close: () => void; action: () => void }) {
  return <dialog aria-labelledby="dialog-title" ref={node => { if (node && !node.open) node.showModal() }} onCancel={e => { e.preventDefault(); close() }}><h2 id="dialog-title">{title}</h2><p>{description}</p><div className="actions"><button className="secondary" autoFocus onClick={close}>Cancel</button><button className="primary destructive" onClick={action}>{label}</button></div></dialog>
}

createRoot(document.getElementById('root')!).render(<App/>)
