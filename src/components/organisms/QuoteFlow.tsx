'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { Button } from '@/components/atoms/Button'
import { ChoiceOption } from '@/components/atoms/ChoiceOption'
import { TextField } from '@/components/atoms/TextField'
import { FileDropZone } from '@/components/molecules/FileDropZone'
import { QuoteResult } from '@/components/molecules/QuoteResult'
import { QuoteReview } from '@/components/molecules/QuoteReview'
import { QuoteStep } from '@/components/molecules/QuoteStep'
import { SuburbCombobox } from '@/components/molecules/SuburbCombobox'
import { quoteFlow, services, type ServiceSlug } from '@/lib/content'
import {
  PROJECT_TYPES,
  TIMEFRAMES,
  emptyAnswers,
  stepSchemas,
  submitQuote,
  validateAttachments,
  type QuoteAnswers,
  type QuoteSubmitResult,
} from '@/lib/quote'

gsap.registerPlugin(useGSAP)

export type StepId =
  | 'projectType'
  | 'services'
  | 'suburb'
  | 'timeframe'
  | 'message'
  | 'attachments'
  | 'contactDetails'

export const STEP_ORDER: readonly StepId[] = [
  'projectType',
  'services',
  'suburb',
  'timeframe',
  'message',
  'attachments',
  'contactDetails',
]

const FIRST_STEP = STEP_ORDER[0]!
const LAST_STEP = STEP_ORDER[STEP_ORDER.length - 1]!

/** Steps the visitor may leave untouched. */
const OPTIONAL_STEPS: ReadonlySet<StepId> = new Set(['message', 'attachments'])

const DRAFT_KEY = 'ob_quote_draft'
const AUTO_ADVANCE_MS = 280

type Screen =
  | { kind: 'intro' }
  | { kind: 'step'; id: StepId }
  | { kind: 'review' }
  | { kind: 'result' }

type State = {
  screen: Screen
  /** 1 = moving forward, -1 = moving back. Drives the swap direction. */
  direction: 1 | -1
  answers: QuoteAnswers
  files: File[]
  errors: Partial<Record<string, string>>
  submitting: boolean
  result: QuoteSubmitResult | null
  /** Set when the visitor jumped to a step from the review screen. */
  returnToReview: boolean
}

type Action =
  | { type: 'hydrate'; answers: Partial<QuoteAnswers> }
  | { type: 'seed'; service: ServiceSlug }
  | { type: 'set'; field: keyof QuoteAnswers; value: QuoteAnswers[keyof QuoteAnswers] }
  | { type: 'toggle-service'; slug: ServiceSlug }
  | { type: 'set-files'; files: File[] }
  | { type: 'errors'; errors: Partial<Record<string, string>> }
  | { type: 'go'; screen: Screen; direction: 1 | -1; returnToReview?: boolean }
  | { type: 'submit-start' }
  | { type: 'submit-done'; result: QuoteSubmitResult }
  | { type: 'retry' }

const initialState: State = {
  screen: { kind: 'intro' },
  direction: 1,
  answers: emptyAnswers,
  files: [],
  errors: {},
  submitting: false,
  result: null,
  returnToReview: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, answers: { ...state.answers, ...action.answers } }
    case 'seed':
      return state.answers.services.includes(action.service)
        ? state
        : { ...state, answers: { ...state.answers, services: [...state.answers.services, action.service] } }
    case 'set':
      return {
        ...state,
        answers: { ...state.answers, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      }
    case 'toggle-service': {
      const has = state.answers.services.includes(action.slug)
      return {
        ...state,
        answers: {
          ...state.answers,
          services: has
            ? state.answers.services.filter((s) => s !== action.slug)
            : [...state.answers.services, action.slug],
        },
        errors: { ...state.errors, services: undefined },
      }
    }
    case 'set-files':
      return { ...state, files: action.files, errors: { ...state.errors, attachments: undefined } }
    case 'errors':
      return { ...state, errors: action.errors }
    case 'go':
      return {
        ...state,
        screen: action.screen,
        direction: action.direction,
        errors: {},
        returnToReview: action.returnToReview ?? state.returnToReview,
      }
    case 'submit-start':
      return { ...state, submitting: true }
    case 'submit-done':
      return { ...state, submitting: false, result: action.result, screen: { kind: 'result' }, direction: 1 }
    case 'retry':
      return { ...state, result: null, screen: { kind: 'review' }, direction: -1 }
    default:
      return state
  }
}

/** Only the plain answers are persisted — `File` objects cannot be. */
function readDraft(): Partial<QuoteAnswers> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Partial<QuoteAnswers>) : null
  } catch {
    return null
  }
}

function screenKey(screen: Screen): string {
  return screen.kind === 'step' ? `step:${screen.id}` : screen.kind
}

type Props = {
  seedService?: ServiceSlug
  onClose: () => void
  /** Lets the modal shell render the progress rail and counter. */
  onProgress: (progress: { current: number; total: number } | null) => void
  /** Labels the dialog — the shell owns `aria-labelledby`. */
  headingId: string
}

export function QuoteFlow({ seedService, onClose, onProgress, headingId }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const scope = useRef<HTMLDivElement>(null)
  const autoAdvance = useRef<ReturnType<typeof setTimeout> | null>(null)
  const key = screenKey(state.screen)

  /* -- draft persistence ------------------------------------------------- */

  useEffect(() => {
    const draft = readDraft()
    if (draft) dispatch({ type: 'hydrate', answers: draft })
    if (seedService) dispatch({ type: 'seed', service: seedService })
    // Seeding runs once per mount; the modal unmounts when closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state.answers))
    } catch {
      /* private mode — the flow still works, it just will not resume */
    }
  }, [state.answers])

  /* -- progress reported up to the shell --------------------------------- */

  useEffect(() => {
    if (state.screen.kind !== 'step') {
      onProgress(null)
      return
    }
    onProgress({
      current: STEP_ORDER.indexOf(state.screen.id) + 1,
      total: STEP_ORDER.length,
    })
  }, [state.screen, onProgress])

  /* -- step swap (quoteStepSwap) ----------------------------------------- */

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // `opacity`, never `autoAlpha`: autoAlpha sets visibility:hidden for
        // the from-state, and useGSAP runs as a layout effect — the focus
        // effect below would then fire against a subtree that cannot take
        // focus, leaving the caret on <body> and Enter doing nothing.
        gsap.fromTo(
          '[data-quote-screen]',
          { opacity: 0, y: state.direction * 32 },
          { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform' },
        )
      })
      return () => mm.revert()
    },
    { scope, dependencies: [key] },
  )

  /* -- focus management --------------------------------------------------- */

  useEffect(() => {
    if (autoAdvance.current) clearTimeout(autoAdvance.current)
  }, [key])

  useEffect(() => {
    const root = scope.current
    if (!root) return
    // Choice steps deliberately land focus on the screen container rather
    // than the first option, so Enter continues instead of picking A.
    const target =
      root.querySelector<HTMLElement>('[data-autofocus]') ??
      root.querySelector<HTMLElement>('[data-quote-field] input, [data-quote-field] textarea') ??
      root.querySelector<HTMLElement>('[data-quote-focus]')
    target?.focus({ preventScroll: true })
  }, [key])

  useEffect(() => () => {
    if (autoAdvance.current) clearTimeout(autoAdvance.current)
  }, [])

  /* -- navigation --------------------------------------------------------- */

  const goTo = useCallback((screen: Screen, direction: 1 | -1, returnToReview?: boolean) => {
    dispatch({ type: 'go', screen, direction, returnToReview })
  }, [])

  const validateStep = useCallback(
    (id: StepId): Partial<Record<string, string>> => {
      if (id === 'attachments') {
        const err = validateAttachments(state.files)
        return err ? { attachments: quoteFlow.errors[toErrorKey(err)] } : {}
      }
      const result = stepSchemas[id].safeParse(state.answers)
      if (result.success) return {}
      const flat: Partial<Record<string, string>> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? id)
        flat[field] ??= issue.message
      }
      return flat
    },
    [state.answers, state.files],
  )

  const advance = useCallback(
    (fromId?: StepId) => {
      if (fromId) {
        const errors = validateStep(fromId)
        if (Object.keys(errors).length > 0) {
          dispatch({ type: 'errors', errors })
          const firstField = Object.keys(errors)[0]
          requestAnimationFrame(() => {
            scope.current
              ?.querySelector<HTMLElement>(`[data-field="${firstField}"]`)
              ?.focus()
          })
          return
        }
      }

      if (state.returnToReview) {
        goTo({ kind: 'review' }, 1, false)
        return
      }

      if (state.screen.kind === 'intro') {
        goTo({ kind: 'step', id: FIRST_STEP }, 1)
        return
      }
      if (state.screen.kind === 'step') {
        const next = STEP_ORDER[STEP_ORDER.indexOf(state.screen.id) + 1]
        goTo(next ? { kind: 'step', id: next } : { kind: 'review' }, 1)
      }
    },
    [goTo, state.returnToReview, state.screen, validateStep],
  )

  const goBack = useCallback(() => {
    // Jumped here from the review via "Edit" — Back belongs there too.
    if (state.returnToReview && state.screen.kind === 'step') {
      goTo({ kind: 'review' }, 1, false)
      return
    }
    if (state.screen.kind === 'review') {
      goTo({ kind: 'step', id: LAST_STEP }, -1)
      return
    }
    if (state.screen.kind !== 'step') return
    const index = STEP_ORDER.indexOf(state.screen.id)
    const previous = STEP_ORDER[index - 1]
    goTo(index === 0 || !previous ? { kind: 'intro' } : { kind: 'step', id: previous }, -1)
  }, [goTo, state.returnToReview, state.screen])

  const submit = useCallback(async () => {
    dispatch({ type: 'submit-start' })
    const result = await submitQuote(state.answers, state.files)
    if (result.status === 'sent') {
      try {
        sessionStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
    }
    dispatch({ type: 'submit-done', result })
  }, [state.answers, state.files])

  /* -- single-choice selection + auto-advance ----------------------------- */

  // The timer must call the *current* `advance`, not the one captured when
  // the option was clicked — that older closure still sees the answer as
  // unset and would flag the step as invalid the moment you pick a value.
  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  }, [advance])

  const queueAdvance = useCallback((id: StepId) => {
    if (autoAdvance.current) clearTimeout(autoAdvance.current)
    autoAdvance.current = setTimeout(() => advanceRef.current(id), AUTO_ADVANCE_MS)
  }, [])

  const selectProjectType = useCallback(
    (value: (typeof PROJECT_TYPES)[number]) => {
      dispatch({ type: 'set', field: 'projectType', value })
      queueAdvance('projectType')
    },
    [queueAdvance],
  )

  const selectTimeframe = useCallback(
    (value: (typeof TIMEFRAMES)[number]) => {
      dispatch({ type: 'set', field: 'timeframe', value })
      queueAdvance('timeframe')
    },
    [queueAdvance],
  )

  /** "Skip this" discards whatever is in the optional step and moves on. */
  const skipCurrent = useCallback(() => {
    if (state.screen.kind !== 'step') return
    if (state.screen.id === 'message') dispatch({ type: 'set', field: 'message', value: '' })
    if (state.screen.id === 'attachments') dispatch({ type: 'set-files', files: [] })
    advance()
  }, [advance, state.screen])

  /* -- keyboard model ----------------------------------------------------- */


  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      const tag = target.tagName
      const isTextarea = tag === 'TEXTAREA'
      const isTextEntry = tag === 'INPUT' || isTextarea

      if (event.key === 'Enter') {
        // In the message box Enter is a newline; Cmd/Ctrl + Enter continues.
        if (isTextarea && !(event.metaKey || event.ctrlKey)) return

        const role = target.getAttribute('role')
        // A focused single-choice option: let the native click select it,
        // which auto-advances. Ordinary buttons and links act normally too.
        if (role === 'radio' || target.tagName === 'A') return
        if (target.tagName === 'BUTTON' && role !== 'checkbox') return

        event.preventDefault()
        if (state.screen.kind === 'intro') advance()
        else if (state.screen.kind === 'step') advance(state.screen.id)
        return
      }

      if (isTextEntry || event.metaKey || event.ctrlKey || event.altKey) return
      if (state.screen.kind !== 'step') return

      const letter = event.key.toUpperCase()
      if (letter.length !== 1 || letter < 'A' || letter > 'J') return

      const index = letter.charCodeAt(0) - 65
      if (state.screen.id === 'projectType') {
        const value = PROJECT_TYPES[index]
        if (!value) return
        event.preventDefault()
        selectProjectType(value)
      } else if (state.screen.id === 'timeframe') {
        const value = TIMEFRAMES[index]
        if (!value) return
        event.preventDefault()
        selectTimeframe(value)
      } else if (state.screen.id === 'services') {
        const service = services[index]
        if (!service) return
        event.preventDefault()
        dispatch({ type: 'toggle-service', slug: service.slug })
      }
    },
    [advance, selectProjectType, selectTimeframe, state.screen],
  )

  /* -- render ------------------------------------------------------------- */

  const nextLabel = state.returnToReview ? quoteFlow.buttons.backToReview : quoteFlow.buttons.next

  return (
    <div
      ref={scope}
      className="flex min-h-0 flex-1 flex-col"
      onKeyDown={onKeyDown}
      data-testid="quote-flow"
    >
      {state.screen.kind === 'intro' ? (
        <div data-quote-screen className="flex min-h-0 flex-1 flex-col justify-center px-6 py-10 md:px-12">
          {/* No eyebrow here — the modal header already reads "Request a quote". */}
          <h2
            id={headingId}
            className="text-[var(--text-h2)] leading-[1.15] text-[var(--color-ob-green)]"
          >
            {quoteFlow.intro.headline}
          </h2>
          <p className="mt-4 max-w-prose text-[var(--text-lead)] text-[var(--color-ob-ink-soft)]">
            {quoteFlow.intro.lead}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button
              type="button"
              size="lg"
              onClick={() => advance()}
              data-autofocus
              data-testid="quote-step-next"
            >
              {quoteFlow.intro.start}
              <ArrowRight aria-hidden="true" size={16} />
            </Button>
            <span className="text-[0.78rem] text-[var(--color-ob-ink-soft)]">
              {quoteFlow.intro.hint}
            </span>
          </div>
        </div>
      ) : null}

      {state.screen.kind === 'step' ? (
        <QuoteStep
          key={key}
          headingId={headingId}
          stepId={state.screen.id}
          question={quoteFlow.steps[state.screen.id].question}
          helper={quoteFlow.steps[state.screen.id].helper}
          hint={hintFor(state.screen.id)}
          optional={OPTIONAL_STEPS.has(state.screen.id)}
          nextLabel={nextLabel}
          onBack={goBack}
          onNext={() => advance(state.screen.kind === 'step' ? state.screen.id : undefined)}
          onSkip={OPTIONAL_STEPS.has(state.screen.id) ? skipCurrent : undefined}
        >
          {renderField(state.screen.id)}
        </QuoteStep>
      ) : null}

      {state.screen.kind === 'review' ? (
        <QuoteReview
          key={key}
          headingId={headingId}
          answers={state.answers}
          fileCount={state.files.length}
          submitting={state.submitting}
          onEdit={(id) => goTo({ kind: 'step', id }, -1, true)}
          onBack={goBack}
          onSubmit={submit}
        />
      ) : null}

      {state.screen.kind === 'result' && state.result ? (
        <QuoteResult
          key={key}
          headingId={headingId}
          result={state.result}
          answers={state.answers}
          hasFiles={state.files.length > 0}
          onRetry={() => dispatch({ type: 'retry' })}
          onClose={onClose}
        />
      ) : null}
    </div>
  )

  function hintFor(id: StepId): string {
    if (id === 'message') return quoteFlow.hints.textarea
    if (id === 'services') return quoteFlow.hints.multi
    return quoteFlow.hints.enter
  }

  function renderField(id: StepId) {
    switch (id) {
      case 'projectType':
        return (
          <div role="radiogroup" aria-labelledby={headingId} className="flex flex-col gap-2.5">
            {PROJECT_TYPES.map((value, index) => (
              <ChoiceOption
                key={value}
                role="radio"
                index={index}
                label={quoteFlow.projectTypeLabels[value]}
                selected={state.answers.projectType === value}
                onSelect={() => selectProjectType(value)}
                data-testid={`quote-choice-${value}`}
              />
            ))}
            {state.errors.projectType ? (
              <p className="ob-field-error" data-testid="quote-error-projectType">
                {state.errors.projectType}
              </p>
            ) : null}
          </div>
        )

      case 'services':
        return (
          <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2.5">
            {services.map((service, index) => (
              <ChoiceOption
                key={service.slug}
                role="checkbox"
                index={index}
                label={service.name}
                selected={state.answers.services.includes(service.slug)}
                onSelect={() => dispatch({ type: 'toggle-service', slug: service.slug })}
                data-testid={`quote-choice-${service.slug}`}
              />
            ))}
            {state.errors.services ? (
              <p className="ob-field-error" data-testid="quote-error-services">
                {state.errors.services}
              </p>
            ) : null}
          </div>
        )

      case 'suburb':
        return (
          <SuburbCombobox
            label={quoteFlow.steps.suburb.label}
            placeholder={quoteFlow.steps.suburb.placeholder}
            value={state.answers.suburb}
            error={state.errors.suburb}
            onChange={(value) => dispatch({ type: 'set', field: 'suburb', value })}
          />
        )

      case 'timeframe':
        return (
          <div role="radiogroup" aria-labelledby={headingId} className="flex flex-col gap-2.5">
            {TIMEFRAMES.map((value, index) => (
              <ChoiceOption
                key={value}
                role="radio"
                index={index}
                label={quoteFlow.timeframeLabels[value]}
                selected={state.answers.timeframe === value}
                onSelect={() => selectTimeframe(value)}
                data-testid={`quote-choice-${value}`}
              />
            ))}
            {state.errors.timeframe ? (
              <p className="ob-field-error" data-testid="quote-error-timeframe">
                {state.errors.timeframe}
              </p>
            ) : null}
          </div>
        )

      case 'message':
        return (
          <TextField
            multiline
            label={quoteFlow.steps.message.label}
            hideLabel
            placeholder={quoteFlow.steps.message.placeholder}
            value={state.answers.message}
            error={state.errors.message}
            data-field="message"
            data-autofocus
            testId="quote-field-message"
            onChange={(e) => dispatch({ type: 'set', field: 'message', value: e.target.value })}
          />
        )

      case 'attachments':
        return (
          <FileDropZone
            files={state.files}
            error={state.errors.attachments}
            onChange={(files) => dispatch({ type: 'set-files', files })}
          />
        )

      case 'contactDetails':
        return (
          <div className="flex flex-col gap-6">
            <TextField
              label={quoteFlow.steps.contactDetails.fullNameLabel}
              placeholder={quoteFlow.steps.contactDetails.fullNamePlaceholder}
              value={state.answers.fullName}
              error={state.errors.fullName}
              autoComplete="name"
              data-field="fullName"
              data-autofocus
              testId="quote-field-fullName"
              onChange={(e) => dispatch({ type: 'set', field: 'fullName', value: e.target.value })}
            />
            <TextField
              type="email"
              inputMode="email"
              label={quoteFlow.steps.contactDetails.emailLabel}
              placeholder={quoteFlow.steps.contactDetails.emailPlaceholder}
              value={state.answers.email}
              error={state.errors.email}
              autoComplete="email"
              data-field="email"
              testId="quote-field-email"
              onChange={(e) => dispatch({ type: 'set', field: 'email', value: e.target.value })}
            />
            <TextField
              type="tel"
              inputMode="tel"
              label={quoteFlow.steps.contactDetails.phoneLabel}
              note={quoteFlow.steps.contactDetails.phoneOptional}
              placeholder={quoteFlow.steps.contactDetails.phonePlaceholder}
              value={state.answers.phone}
              error={state.errors.phone}
              autoComplete="tel"
              data-field="phone"
              testId="quote-field-phone"
              onChange={(e) => dispatch({ type: 'set', field: 'phone', value: e.target.value })}
            />
          </div>
        )
    }
  }
}

function toErrorKey(err: 'too-many' | 'too-large' | 'wrong-type'): keyof typeof quoteFlow.errors {
  return err === 'too-many' ? 'tooMany' : err === 'too-large' ? 'tooLarge' : 'wrongType'
}
