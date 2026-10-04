import { useState } from 'react'
import faqImage from './assets/paideia faq.png'
import './frequently-asked-questions.css'

const questions = [
  {
    question: '¿Qué niveles educativos ofrece Paideia?',
    answer: 'Acompañamos a nuestros estudiantes desde Nido, Inicial, Primaria y Secundaria, con una propuesta pensada para cada etapa de su crecimiento.',
  },
  {
    question: '¿Cómo puedo iniciar el proceso de matrícula?',
    answer: 'Puedes escribirnos o visitar cualquiera de nuestras sedes. Nuestro equipo de admisión te orientará sobre vacantes, documentos y los siguientes pasos.',
  },
  {
    question: '¿En qué sedes puedo encontrar Paideia?',
    answer: 'Contamos con una sede en Trujillo y dos sedes en La Esperanza: Manuel Cedeño y 22 de Febrero.',
  },
  {
    question: '¿Cómo acompañan el aprendizaje de cada estudiante?',
    answer: 'Trabajamos con seguimiento cercano, comunicación continua con las familias y experiencias que respetan los ritmos, intereses y fortalezas de cada estudiante.',
  },
  {
    question: '¿Puedo visitar una sede antes de matricularme?',
    answer: 'Sí. Puedes coordinar una visita para conocer nuestros espacios, resolver tus dudas y descubrir la experiencia Paideia junto a tu familia.',
  },
]

export default function FrequentlyAskedQuestions() {
  const [openQuestions, setOpenQuestions] = useState(new Set([0]))

  const toggleQuestion = (index) => {
    setOpenQuestions((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return <section className="faq-section" id="preguntas-frecuentes" aria-labelledby="faq-heading">
    <div className="faq-decor" aria-hidden="true">
      <span className="faq-quarter" />
      <span className="faq-dots" />
      <span className="faq-ring" />
      <span className="faq-half" />
      <span className="faq-corner" />
      <span className="faq-stars">✦</span>
    </div>
    <div className="faq-layout">
      <div className="faq-visual">
        <img src={faqImage} alt="Estudiantes de Paideia concentrados en una actividad académica" loading="lazy" decoding="async" />
        <div className="faq-visual-message"><span>Paideia responde</span><strong>Estamos para<br />acompañarte</strong></div>
      </div>
      <div className="faq-content">
        <p className="faq-kicker">Resolvemos tus dudas</p>
        <h2 id="faq-heading">Preguntas<br /><span>frecuentes</span></h2>
        <p className="faq-intro">Queremos que elijas con tranquilidad. Aquí encontrarás respuestas a las consultas más comunes de las familias.</p>
        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = openQuestions.has(index)
            const answerId = `faq-answer-${index}`
            return <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
              <button className="faq-question" type="button" onClick={() => toggleQuestion(index)} aria-expanded={isOpen} aria-controls={answerId}>
                <span className="faq-index">0{index + 1}</span>
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </button>
              <div className="faq-answer-wrap" id={answerId} aria-hidden={!isOpen}>
                <p className="faq-answer">{item.answer}</p>
              </div>
            </article>
          })}
        </div>
      </div>
    </div>
  </section>
}
