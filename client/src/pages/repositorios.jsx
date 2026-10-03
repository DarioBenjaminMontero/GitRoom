import { useState } from "react";
import "./repositorios.css";

// Datos de ejemplo: solo para la parte visual, después se reemplazan por la API
const materia = { nombre: "Clase x", profesor: "Tacho" };

// El tablón mezcla avisos automáticos (tarea / material publicado) con mensajes del profesor
const publicacionesEjemplo = [
  { id: 1, tipo: "tarea", titulo: "TP2 - Árboles binarios" },
  {
    id: 2,
    tipo: "mensaje",
    texto: "Ya está publicado el TP2. Recuerden hacer commits chicos y con mensajes claros, se va a evaluar el historial del repositorio.",
    comentarios: [
      { autor: "Agustín Castro", texto: "¿Se puede hacer en grupo?" },
      { autor: "Darío Montero", texto: "¿Hay que subir también los tests?" },
    ],
  },
  { id: 3, tipo: "material", titulo: "Apunte de recursividad" },
  {
    id: 4,
    tipo: "mensaje",
    texto: "El jueves no hay clase presencial. Aprovechen para avanzar con el TP y consultar dudas por acá.",
    comentarios: [],
  },
  {
    id: 5,
    tipo: "mensaje",
    texto: "Bienvenidos a Programación II. En la pestaña Tareas van a encontrar todo lo que hay que entregar, y en Repos suben sus archivos.",
    comentarios: [],
  },
];

// Las tareas sin bimestre se muestran arriba de todo, como en Classroom
const tareasEjemplo = [
  { id: 1, titulo: "Presentación personal", bimestre: null, entrega: "Sin fecha de entrega" },
  { id: 2, titulo: "TP2 - Árboles binarios", bimestre: "3er Bimestre", entrega: "10/10/2026" },
  { id: 3, titulo: "Apunte de recursividad", bimestre: "3er Bimestre", entrega: "Material" },
  { id: 4, titulo: "TP1 - Listas enlazadas", bimestre: "2do Bimestre", entrega: "12/08/2026" },
  { id: 5, titulo: "Ejercicios de pilas y colas", bimestre: "2do Bimestre", entrega: "20/07/2026" },
  { id: 6, titulo: "Repaso de Programación I", bimestre: "1er Bimestre", entrega: "15/04/2026" },
  { id: 7, titulo: "Instalación del entorno", bimestre: "1er Bimestre", entrega: "01/04/2026" },
];

const archivosEjemplo = [
  { id: 1, nombre: "ArbolBinario.java", tamaño: "4 KB", fecha: "hace 5 horas" },
  { id: 2, nombre: "Nodo.java", tamaño: "1 KB", fecha: "hace 5 horas" },
  { id: 3, nombre: "Main.java", tamaño: "2 KB", fecha: "hace 1 día" },
  { id: 4, nombre: "README.md", tamaño: "1 KB", fecha: "hace 3 días" },
];

const secciones = [
  { id: "tablon", nombre: "Tablón" },
  { id: "tareas", nombre: "Tareas" },
  { id: "repos", nombre: "Repos" },
];

function IconoTarea() {
  return (
    <svg className="icono-tarea" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="2" width="15" height="20" rx="2" />
      <path d="M7 7h7M7 11h7M7 15h4" />
      <path d="M20 9l-6 9-2 1 .5-2 6-9z" />
    </svg>
  );
}

/* ---------- Tablón ---------- */

function Tablon() {
  return (
    <div className="lista-pildoras">
      {publicacionesEjemplo.map((p) =>
        p.tipo === "mensaje" ? (
          <article key={p.id} className="mensaje">
            <div className="mensaje-cuerpo">
              <strong>{materia.profesor}</strong>
              <p>{p.texto}</p>
            </div>
            {p.comentarios.length > 0 && (
              <div className="mensaje-comentarios">
                <span>Comentarios de la clase:</span>
                {p.comentarios.map((c, i) => (
                  <p key={i}>
                    <strong>{c.autor}</strong> {c.texto}
                  </p>
                ))}
              </div>
            )}
          </article>
        ) : (
          <div key={p.id} className="pildora">
            <IconoTarea />
            <span>
              {materia.profesor} publicó {p.tipo === "tarea" ? "una tarea" : "nuevo material"}:{" "}
              <strong>{p.titulo}</strong>
            </span>
          </div>
        )
      )}
    </div>
  );
}

/* ---------- Tareas ---------- */

function Tareas() {
  const sinBimestre = tareasEjemplo.filter((t) => t.bimestre === null);
  const bimestres = [...new Set(tareasEjemplo.map((t) => t.bimestre).filter(Boolean))];

  const pildoraTarea = (t) => (
    <div key={t.id} className="pildora">
      <IconoTarea />
      <span className="pildora-titulo">{t.titulo}</span>
      <span className="pildora-detalle">{t.entrega}</span>
    </div>
  );

  return (
    <div className="lista-pildoras">
      {sinBimestre.map(pildoraTarea)}
      {bimestres.map((b) => (
        <div key={b} className="grupo-bimestre">
          <h3>{b}:</h3>
          {tareasEjemplo.filter((t) => t.bimestre === b).map(pildoraTarea)}
        </div>
      ))}
    </div>
  );
}

/* ---------- Repos (vista del alumno) ---------- */

function Repos() {
  return (
    <div className="repos-alumno">
      <div className="repos-cabecera">
        <h3>Archivos subidos</h3>
        <button className="boton-pildora">Subir archivo</button>
      </div>

      <ul className="lista-archivos">
        {archivosEjemplo.map((a) => (
          <li key={a.id}>
            <span className="archivo-nombre">{a.nombre}</span>
            <span className="archivo-detalle">
              {a.tamaño} · {a.fecha}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Página ---------- */

export default function Repositorios() {
  const [seccion, setSeccion] = useState("tablon");

  return (
    <section id="repositorios">
      <div className="materia-barra">
        <button className="menu-boton" aria-label="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h2>{materia.nombre}</h2>
      </div>

      <nav className="materia-tabs">
        {secciones.map((s) => (
          <button
            key={s.id}
            className={seccion === s.id ? "tab activo" : "tab"}
            onClick={() => setSeccion(s.id)}
          >
            {s.nombre}
          </button>
        ))}
      </nav>

      <div className="materia-contenido">
        {seccion === "tablon" && <Tablon />}
        {seccion === "tareas" && <Tareas />}
        {seccion === "repos" && <Repos />}
      </div>
    </section>
  );
}
