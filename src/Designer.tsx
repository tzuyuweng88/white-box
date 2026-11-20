import { useRef, useState } from 'react'
import { Download, FileText, Printer, Save, Sparkles, Star, Sprout, Monitor, Smartphone, PanelsTopLeft } from 'lucide-react'
import { values } from './content'
import type { Design, Entry } from './state'
import { Back, Heading, OrderList } from './ui'

const formats = [{ id: 'poster', label: 'Printable poster', Icon: PanelsTopLeft }, { id: 'desktop', label: 'Desktop wallpaper', Icon: Monitor }, { id: 'phone', label: 'Phone wallpaper', Icon: Smartphone }] as const
const backgrounds = [{ color: '#fff3ce', name: 'Butter' }, { color: '#ede3f8', name: 'Lavender' }, { color: '#e3eedb', name: 'Sage' }, { color: '#deedf8', name: 'Sky' }, { color: '#fae3dc', name: 'Peach' }, { color: '#ffffff', name: 'White' }]
const stickers = { None: null, Sparkles, Star, Sprout }
const fonts: Record<string, string> = { Editorial: 'Georgia, serif', Simple: 'Arial, sans-serif', Typewriter: 'monospace' }

async function wallpaper(png: string, format: Design['format'], background: string) {
  if (format === 'poster') return png
  const canvas = document.createElement('canvas')
  const [width, height] = format === 'desktop' ? [1920, 1080] : [1080, 2280]
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not create a canvas')
  const image = new Image()
  image.src = png
  await image.decode()
  const scale = Math.min(width / image.width, height / image.height)
  const scaledWidth = image.width * scale
  const scaledHeight = image.height * scale
  context.fillStyle = background
  context.fillRect(0, 0, width, height)
  context.drawImage(image, (width - scaledWidth) / 2, (height - scaledHeight) / 2, scaledWidth, scaledHeight)
  return canvas.toDataURL('image/png')
}

export function Designer({ board, initial, save, back, edit, notice }: { board: Entry[]; initial: Design; save: (design: Design) => void; back: () => void; edit: (entry: Entry) => void; notice: (message: string) => void }) {
  const [design, setDesign] = useState(initial)
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const update = (patch: Partial<Design>) => setDesign(current => ({ ...current, ...patch }))
  const order = [...design.order.filter(id => board.some(entry => entry.id === id)), ...board.map(entry => entry.id).filter(id => !design.order.includes(id))]
  const Sticker = stickers[design.sticker as keyof typeof stickers]
  const exportFile = async (kind: 'png' | 'pdf') => {
    if (!ref.current || busy) return
    setBusy(true)
    try {
      const { toPng } = await import('html-to-image')
      const node = ref.current
      const preview = await toPng(node, { pixelRatio: 3, skipFonts: true, style: { margin: '0', boxShadow: 'none' } })
      const png = await wallpaper(preview, design.format, design.background)
      if (kind === 'png') {
        const blob = await (await fetch(png)).blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'my-ai-values-guide.png'
        document.body.append(link)
        link.click()
        link.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 10000)
      } else {
        const { jsPDF } = await import('jspdf')
        const landscape = design.format === 'desktop'
        const pdf = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', format: 'a4' })
        const { width, height } = pdf.getImageProperties(png)
        const pageWidth = pdf.internal.pageSize.getWidth(), pageHeight = pdf.internal.pageSize.getHeight()
        const scale = Math.min((pageWidth - 20) / width, (pageHeight - 20) / height)
        pdf.addImage(png, 'PNG', (pageWidth - width * scale) / 2, (pageHeight - height * scale) / 2, width * scale, height * scale, undefined, 'FAST')
        pdf.save('my-ai-values-guide.pdf')
      }
      notice(kind === 'png' ? 'Your guide image is ready.' : 'Your guide PDF is ready.')
    } catch {
      notice('The download could not be created. You can try again or print your guide.')
    } finally {
      setBusy(false)
    }
  }
  return <><Back onClick={back}>My AI Values Guide</Back><Heading title="Make Your Guide Your Own" subtitle="Choose how your guide looks. You can change it anytime."/>
    <div className="designer">
      <aside className="panel tools-panel" aria-label="Guide design tools">
        <fieldset><legend>Format</legend><div className="format-options">{formats.map(({ id, label, Icon }) => <button key={id} className="secondary" aria-pressed={design.format === id} onClick={() => update({ format: id })}><Icon size={17}/>{label}</button>)}</div></fieldset>
        <fieldset><legend>Background color</legend><div className="swatches">{backgrounds.map(({ color, name }) => <button key={color} className="swatch" aria-label={name} title={name} style={{ background: color }} aria-pressed={design.background === color} onClick={() => update({ background: color })}/>)}</div></fieldset>
        <label className="field"><span>Color theme</span><select value={design.theme} onChange={e => update({ theme: e.target.value })}><option>Pastel</option><option>Paper</option><option>Ink</option></select></label>
        <label className="field"><span>Font style</span><select value={design.font} onChange={e => update({ font: e.target.value })}>{Object.keys(fonts).map(font => <option key={font}>{font}</option>)}</select></label>
        <label className="field"><span>Stickers</span><select value={design.sticker} onChange={e => update({ sticker: e.target.value })}>{Object.keys(stickers).map(sticker => <option key={sticker}>{sticker}</option>)}</select></label>
        <label className="field"><span>Layout arrangement</span><select value={design.arrangement} onChange={e => update({ arrangement: e.target.value as Design['arrangement'] })}><option value="stack">Stacked cards</option><option value="grid">Two-column cards</option></select></label>
        <label className="toggle"><input type="checkbox" checked={design.icons} onChange={e => update({ icons: e.target.checked })}/>Show value icons</label>
        <details><summary>Rearrange or edit values</summary><OrderList ids={order} onChange={order => update({ order })} detail={id => <button className="text-button" onClick={() => { save(design); const entry = board.find(item => item.id === id); if (entry) edit(entry) }}>Edit {values[id].name}</button>}/></details>
        <button className="primary" onClick={() => save(design)}><Save size={17}/>Save My Design</button>
      </aside>
      <section className="preview-panel"><div className="preview-heading"><h2>Live preview</h2><span>{formats.find(format => format.id === design.format)?.label}</span></div>
        <div className="preview-scroll"><div className={`poster ${design.format} theme-${design.theme.toLowerCase()}`} ref={ref} style={{ background: design.background, fontFamily: fonts[design.font] }}>
          <header>{Sticker && <Sticker size={30} aria-hidden="true"/>}<h2>My AI Values Guide</h2><p>Sarah · Grade 10</p></header>
          <div className={`poster-values ${design.arrangement}`}>{order.map(id => {
            const entry = board.find(item => item.id === id)!
            const { Icon, name, color } = values[id]
            return <article className="poster-value" key={id} style={{ borderColor: design.theme === 'Ink' ? '#30263a' : color, background: design.theme === 'Pastel' ? color : '#fffdf9' }}><h3>{design.icons && <Icon size={18} aria-hidden="true"/>}<span>{name}</span></h3><p>{entry.definition}</p><p><strong>How I use AI</strong> {entry.guideline}</p></article>
          })}{!order.length && <p>Add values to your board to include them here.</p>}</div>
        </div></div>
        <div className="export-buttons"><button className="secondary" disabled={busy || !order.length} onClick={() => void exportFile('png')}><Download size={17}/>Download Image</button><button className="secondary" disabled={busy || !order.length} onClick={() => void exportFile('pdf')}><FileText size={17}/>Download PDF</button><button className="secondary" disabled={busy || !order.length} onClick={() => window.print()}><Printer size={17}/>Print My Guide</button></div>
      </section>
    </div>
  </>
}
