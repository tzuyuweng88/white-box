import { useState } from 'react'
import { AlertTriangle, Check, MessageCircle, Scale, ThumbsUp } from 'lucide-react'
import { scenarios, valueIds, values } from './content'
import type { ValueId } from './content'
import type { Attempt, Entry } from './state'
import { Back, Badge, Field, Heading, Next, OrderList } from './ui'

const labels = ['Read', 'Choose', 'Identify', 'Explore', 'Consider', 'Decide', 'Rank', 'Reflect']
const stances = ['My understanding has changed.', 'I understand one of my values more clearly now.', 'I want to keep my current guideline.', 'I’m still thinking about it.']
export function choiceText(scenario: string, choice: number, idea: string) {
  return scenarios[scenario].options[choice] ?? (idea || 'I have another idea.')
}

export function Dilemma({ draft, board, update, finish, exit, updateOrder }: { draft: Attempt; board: Entry[]; update: (patch: Partial<Attempt>) => void; finish: (patch: Partial<Attempt>, revision?: Entry) => void; exit: () => void; updateOrder: (ids: ValueId[]) => void }) {
  const { step, scenario } = draft
  const data = scenarios[scenario]
  const [compare, setCompare] = useState(draft.ranked)
  const exploringAgain = Boolean(draft.choosingAgain)
  const { revisionDraft } = draft
  const { id: revisionId = '', definition = '', guideline = '' } = revisionDraft ?? {}
  const go = (step: number, patch: Partial<Attempt> = {}) => {
    update({ ...patch, step })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.flow h1')?.focus())
  }
  const options = [...data.options, 'I have another idea.']
  const actionOptions = (final: boolean) => {
    const selected = final ? draft.choice : exploringAgain ? draft.exploredChoice : draft.initial
    return <fieldset className="options"><legend>{final ? 'After thinking about the possibilities, what would you choose?' : 'What would you do next?'}</legend>
      {options.map((option, index) => <label className={selected === index ? 'option selected' : 'option'} key={option}><input type="radio" name={final ? 'decision' : 'action'} checked={selected === index} onChange={() => update(final ? { choice: index } : exploringAgain ? { exploredChoice: index } : { initial: index })}/><span className="letter">{'ABCDE'[index]}.</span><span>{option}</span></label>)}
      {selected === 4 && <Field label="Describe your idea" value={final ? draft.finalIdea : exploringAgain ? draft.exploredIdea ?? '' : draft.idea} onChange={text => update(final ? { finalIdea: text } : exploringAgain ? { exploredIdea: text } : { idea: text })}/>}
    </fieldset>
  }
  const activeRanking = draft.ranking.filter(id => board.some(entry => entry.id === id))
  const ranking = [...activeRanking, ...board.map(entry => entry.id).filter(id => !activeRanking.includes(id))]
  const current = board.find(entry => entry.id === revisionId)
  const selectRevision = (id: ValueId | '') => {
    const entry = board.find(item => item.id === id)
    update({ revisionDraft: entry ? { id: entry.id, definition: entry.definition, guideline: entry.guideline } : undefined })
  }
  const field = (label: string, key: 'why' | 'tension' | 'decision' | 'changed' | 'difficult' | 'balance' | 'learning') =>
    <Field label={label} value={draft[key]} onChange={value => update({ [key]: value })}/>
  const examined = draft.exploredChoice ?? draft.initial
  const examinedIdea = draft.exploredIdea ?? draft.idea
  const outcomes = data.outcomes[examined]
  const validAction = exploringAgain ? examined >= 0 && (examined !== 4 || Boolean(examinedIdea.trim())) : draft.initial >= 0 && (draft.initial !== 4 || Boolean(draft.idea.trim()))
  return <div className="flow">
    <Back onClick={exit}>All dilemmas</Back>
    <div className="stepper" aria-label="Dilemma progress">{labels.map((label, index) => <div key={label} aria-current={index === step ? 'step' : undefined} className={index <= step ? 'step active' : 'step'}><span>{index < step ? <Check size={13}/> : index + 1}</span><small>{label}</small></div>)}</div>
    {step === 0 && <><Heading title={data.title} subtitle="Read the situation and consider the choices you could make."/><article className="panel scenario-story"><span className="value-icon" style={{ background: data.color }}><data.Icon size={26}/></span>{data.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<details><summary>See the possible actions</summary><ol type="A">{options.map(option => <li key={option}>{option}</li>)}</ol></details></article></>}
    {step === 1 && <><Heading title={data.title} subtitle="Choose an action to explore. You can rethink it as you go."/><div className="panel">{actionOptions(false)}<details><summary>Read the scenario again</summary>{data.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</details></div></>}
    {step === 2 && <><Heading title="Which Values Matter Here?" subtitle="Which values do you think are important in this situation?"/><div className="panel"><div className="value-checks">{valueIds.map(id => <label key={id}><input type="checkbox" checked={draft.selected.includes(id)} onChange={e => update({ selected: e.target.checked ? [...draft.selected, id] : draft.selected.filter(item => item !== id) })}/><Badge id={id} small/></label>)}</div>{field('Why do these values matter to you here? (Optional)', 'why')}</div></>}
    {step === 3 && <><Heading title="When Values Pull in Different Directions" subtitle="Two values can both matter and lead you to ask different questions."/><div className="tension"><div style={{ background: values[data.tension[0]].color }}><Badge id={data.tension[0]} small/><p>{values[data.tension[0]].definition}</p><p>{data.tensionQuestions[0]}</p></div><Scale aria-hidden="true"/><div style={{ background: values[data.tension[1]].color }}><Badge id={data.tension[1]} small/><p>{values[data.tension[1]].definition}</p><p>{data.tensionQuestions[1]}</p></div></div><div className="panel">{field('How might these values lead you to think about the situation differently?', 'tension')}</div></>}
    {step === 4 && outcomes && <><Heading title="What Might Happen Next?" subtitle={choiceText(scenario, examined, examinedIdea)}/><div className="outcome-grid"><article className="outcome benefit"><h3><ThumbsUp size={20}/>Possible benefits</h3><p>{outcomes[0]}</p></article><article className="outcome concern"><h3><AlertTriangle size={20}/>Possible concerns</h3><p>{outcomes[1]}</p></article></div><article className="outcome perspective"><h3><MessageCircle size={20}/>Another person’s perspective</h3><p>{outcomes[2]}</p><strong>{outcomes[3]}</strong></article><p className="note">{data.reminder}</p><button className="secondary" onClick={() => { go(1, { choosingAgain: true, exploredChoice: examined, exploredIdea: examinedIdea }) }}>Explore Another Option</button></>}
    {step === 5 && <><Heading title="Think About Your Decision"/><div className="panel"><p className="note">Your first idea was “{choiceText(scenario, draft.initial, draft.idea)}”</p>{actionOptions(true)}{field('What matters most in your decision?', 'decision')}</div></>}
    {step === 6 && <><Heading title="What Mattered Most to You?" subtitle="Different situations can bring different values to the front. Think about which values mattered most in this decision."/><div className="panel">{ranking.length ? <><p className="muted">Most important in this situation</p><OrderList ids={ranking} onChange={order => { setCompare(false); update({ ranking: order, ranked: false }) }}/><p className="muted">Less important in this situation</p></> : <p>Your Values Board is empty. You can add values later and keep reflecting on this dilemma now.</p>}</div>
      {compare && <div className="panel"><div className="compare">{[['Before This Dilemma', draft.before], ['In This Dilemma', ranking]].map(([title, order]) => <div key={title as string}><h3>{title as string}</h3>{(order as ValueId[]).length ? <ol>{(order as ValueId[]).map(id => <li key={id}><Badge id={id} small/></li>)}</ol> : <p>No values saved yet.</p>}</div>)}</div>{field('Did anything change? What made you think differently?', 'changed')}{ranking.length > 0 && <button className="secondary" onClick={() => updateOrder(ranking)}>Apply This Order to My Values Board</button>}</div>}</>}
    {step === 7 && <><Heading title="What Did You Learn About Your Values?" subtitle="Save what you noticed. You can revisit it in your guide."/><div className="panel">{field('What was difficult about this decision?', 'difficult')}{field('Did you notice two values that were hard to balance?', 'balance')}{field('Has this experience changed how you think about any of your values?', 'learning')}
      <fieldset className="options"><legend>How are you feeling about your values now?</legend>{stances.map(stance => <label className="option" key={stance}><input type="radio" name="stance" checked={draft.stance === stance} onChange={() => update({ stance })}/>{stance}</label>)}</fieldset>
      {(draft.stance === stances[0] || draft.stance === stances[1]) && <div className="revision"><label className="field"><span>Which value would you like to revisit?</span><select value={revisionId} onChange={e => selectRevision(e.target.value as ValueId | '')}><option value="">Choose a value</option>{board.map(entry => <option key={entry.id} value={entry.id}>{values[entry.id].name}</option>)}</select></label>
        {current && <div className="compare"><div><h3>Current wording</h3><p>{current.definition}</p><p>{current.guideline}</p></div><div><h3>Your revision</h3><Field label="Personal definition" value={definition} onChange={definition => revisionDraft && update({ revisionDraft: { ...revisionDraft, definition } })} limit={240}/><Field label="AI-use guideline" value={guideline} onChange={guideline => revisionDraft && update({ revisionDraft: { ...revisionDraft, guideline } })} limit={240}/></div></div>}</div>}</div></>}
    <div className="flow-footer">
      {step > 0 && <Back onClick={() => { go(exploringAgain ? 4 : step - 1, { choosingAgain: false }) }}/>}
      {step === 0 && <Next onClick={() => go(1)}>Continue</Next>}
      {step === 1 && <Next disabled={!validAction} onClick={() => go(exploringAgain ? 4 : 2, exploringAgain ? { choosingAgain: false } : { choice: draft.initial, finalIdea: draft.idea, exploredChoice: undefined, exploredIdea: undefined })}>Explore My Choice</Next>}
      {step === 2 && <Next onClick={() => go(3)}>Continue</Next>}
      {step === 3 && <Next onClick={() => go(4)}>Continue</Next>}
      {step === 4 && <Next onClick={() => go(5)}>Think About My Decision</Next>}
      {step === 5 && <Next disabled={draft.choice < 0 || (draft.choice === 4 && !draft.finalIdea.trim())} onClick={() => go(6)}>Continue to My Values</Next>}
      {step === 6 && <><button className="secondary" onClick={() => go(7, { ranked: false, ranking: [] })}>I’m Still Thinking</button>{compare ? <Next onClick={() => go(7)}>Continue to Reflection</Next> : <Next disabled={!ranking.length} onClick={() => { update({ ranking, ranked: true }); setCompare(true) }}>Save This Ranking</Next>}</>}
      {step === 7 && <><button className="secondary" onClick={exit}>Come Back Later</button><button className={current ? 'secondary' : 'primary'} onClick={() => finish({ stance: draft.stance || stances[2] })}>{draft.stance === stances[3] ? 'Save Reflection' : 'Keep My Guideline'}</button>{current && (draft.stance === stances[0] || draft.stance === stances[1]) && <Next disabled={!definition.trim() || !guideline.trim()} onClick={() => finish({}, { ...current, definition: definition.trim(), guideline: guideline.trim(), updated: new Date().toISOString(), sample: false })}>Save My Changes</Next>}</>}
    </div>
  </div>
}
