import { useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import { values } from './content'
import type { ValueId } from './content'
import { reorder } from './state'

export function Heading({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return <div className="page-heading"><div><h1 tabIndex={-1}>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{children}</div>
}
export function Back({ onClick, children = 'Back' }: { onClick: () => void; children?: ReactNode }) {
  return <button className="back" onClick={onClick}><ArrowLeft size={17}/>{children}</button>
}
export function Next({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return <button className="primary" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={17}/></button>
}
export function Badge({ id, small = false }: { id: ValueId; small?: boolean }) {
  const { Icon, name, color } = values[id]
  return <span className={small ? 'tag' : 'value-icon'} style={{ backgroundColor: color }}><Icon size={small ? 15 : 25} aria-hidden="true"/>{small && name}</span>
}
export function Field({ label, value, onChange, placeholder, limit = 1200 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; limit?: number }) {
  return <label className="field"><span>{label}</span><textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={limit}/></label>
}
export function OrderList({ ids, onChange, detail }: { ids: ValueId[]; onChange: (ids: ValueId[]) => void; detail?: (id: ValueId) => ReactNode }) {
  const drag = useRef<ValueId | null>(null)
  return <ol className="order-list">{ids.map((id, index) => <li key={id} onDragOver={e => e.preventDefault()} onDrop={e => {
    e.preventDefault()
    if (drag.current) onChange(reorder(ids, ids.indexOf(drag.current), index))
    drag.current = null
  }}>
    <div className="order-main"><span className="grip" draggable onDragStart={e => { drag.current = id; e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move' }} onDragEnd={() => { drag.current = null }}><GripVertical size={19}/></span><span className="rank">{index + 1}</span><Badge id={id} small/>
      <div className="move"><button className="icon-button" aria-label={`Move ${values[id].name} up`} disabled={index === 0} onClick={() => onChange(reorder(ids, index, index - 1))}><ArrowUp size={17}/></button><button className="icon-button" aria-label={`Move ${values[id].name} down`} disabled={index === ids.length - 1} onClick={() => onChange(reorder(ids, index, index + 1))}><ArrowDown size={17}/></button></div>
    </div>{detail?.(id)}
  </li>)}</ol>
}
