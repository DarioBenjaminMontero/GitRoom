import { useEffect, useState } from 'react'
import './Calendario.css'

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function obtenerDias(fecha) {
  const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
  inicio.setDate(1 - ((inicio.getDay() + 6) % 7))

  return Array.from({ length: 42 }, (_, indice) =>
    new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + indice),
  )
}

export default function Calendario() {
  const [mes, setMes] = useState(new Date())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const dias = obtenerDias(mes)
  const formatoFecha = new Intl.DateTimeFormat('es', { dateStyle: 'full' })
  const nombreMes = new Intl.DateTimeFormat('es', {
    month: 'long',
    year: 'numeric',
  }).format(mes)

  useEffect(() => {
    if (!diaSeleccionado) return

    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') setDiaSeleccionado(null)
    }

    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [diaSeleccionado])

  const cambiarMes = (cantidad) => {
    setMes(new Date(mes.getFullYear(), mes.getMonth() + cantidad, 1))
  }

  return (
    <main className="calendario-pagina">
      <section className="calendario-contenedor" aria-label="Calendario">
        <header className="calendario-encabezado">
          <div>
            <p className="calendario-etiqueta">ORGANIZACIÓN</p>
            <h1>Calendario</h1>
          </div>
          <div className="calendario-controles">
            <button type="button" onClick={() => cambiarMes(-1)} aria-label="Mes anterior">‹</button>
            <button type="button" onClick={() => setMes(new Date())}>Hoy</button>
            <button type="button" onClick={() => cambiarMes(1)} aria-label="Mes siguiente">›</button>
          </div>
        </header>

        <h2 className="calendario-mes">{nombreMes}</h2>
        <div className="calendario-cuadricula">
          {diasSemana.map((dia) => <div className="calendario-dia-semana" key={dia}>{dia}</div>)}
          {dias.map((dia) => {
            const esHoy = dia.toDateString() === new Date().toDateString()
            const clase = [
              'calendario-dia',
              dia.getMonth() !== mes.getMonth() && 'fuera-de-mes',
              esHoy && 'es-hoy',
            ].filter(Boolean).join(' ')

            return (
              <button
                type="button"
                className={clase}
                key={dia.toISOString()}
                onClick={() => setDiaSeleccionado(dia)}
                aria-label={`Ver información del ${formatoFecha.format(dia)}`}
                aria-current={esHoy ? 'date' : undefined}
              >
                {dia.getDate()}
              </button>
            )
          })}
        </div>
      </section>

      {diaSeleccionado && (
        <div
          className="calendario-modal-overlay"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) setDiaSeleccionado(null)
          }}
        >
          <section
            className="calendario-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendario-modal-titulo"
          >
            <button
              type="button"
              className="calendario-modal-cerrar"
              onClick={() => setDiaSeleccionado(null)}
              aria-label="Cerrar ventana"
            >
              ×
            </button>
            <p className="calendario-etiqueta">DETALLE DEL DÍA</p>
            <h2 id="calendario-modal-titulo">{formatoFecha.format(diaSeleccionado)}</h2>
            <p className="calendario-sin-informacion">Todavía no hay información para este día.</p>
          </section>
        </div>
      )}
    </main>
  )
}
