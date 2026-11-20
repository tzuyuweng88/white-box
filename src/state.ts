import type { ValueId } from './content'

export type Entry = { id: ValueId; definition: string; guideline: string; reflection: string; updated: string; sample?: boolean }
export type Design = { format: 'poster' | 'desktop' | 'phone'; theme: string; background: string; font: string; icons: boolean; sticker: string; arrangement: 'stack' | 'grid'; order: ValueId[] }
export type Attempt = {
  id: string; scenario: string; step: number; initial: number; exploredChoice?: number; exploredIdea?: string; choosingAgain?: boolean; choice: number; idea: string; finalIdea: string;
  selected: ValueId[]; before: ValueId[]; ranking: ValueId[]; ranked: boolean;
  why: string; tension: string; decision: string; changed: string; difficult: string; balance: string; learning: string;
  stance: string; revisionDraft?: { id: ValueId; definition: string; guideline: string }; reflectionDeleted?: boolean; revision?: { before: Entry; after: Entry }; completed?: string;
}
export type State = { board: Entry[]; explored: ValueId[]; history: Attempt[]; drafts: Record<string, Attempt>; design: Design; settings: { larger: boolean; motion: boolean; contrast: boolean } }
export const defaultDesign: Design = { format: 'poster', theme: 'Pastel', background: '#fff3ce', font: 'Editorial', icons: true, sticker: 'Sparkles', arrangement: 'stack', order: [] }
export const storageKey = 'white-box-learning-v1'
export function demo(): State {
  return {
    board: [{ id: 'respect', definition: 'Making room for other people’s ideas and choices.', guideline: 'I will ask before changing someone else’s work with AI.', reflection: '', updated: '', sample: true }],
    explored: ['respect'], history: [], drafts: {}, design: defaultDesign,
    settings: { larger: false, motion: false, contrast: false },
  }
}
export function load(): State {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) return JSON.parse(stored)
  } catch { /* A fresh demo remains available. */ }
  return demo()
}
export function attempt(scenario: string, before: ValueId[]): Attempt {
  return { id: crypto.randomUUID(), scenario, step: 0, initial: -1, choice: -1, idea: '', finalIdea: '', selected: [], before, ranking: before, ranked: false, why: '', tension: '', decision: '', changed: '', difficult: '', balance: '', learning: '', stance: '' }
}
export function reorder<T>(items: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items
  const copy = [...items]
  copy.splice(to, 0, ...copy.splice(from, 1))
  return copy
}
