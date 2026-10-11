// @ts-check

/**
 * Per-layer restrictions on external packages and on alias misuse, enforced
 * with the built-in `no-restricted-imports` rule.
 *
 * `architecture-boundaries.mjs` decides which *local* files may depend on each
 * other; this file decides which *frameworks* each layer may know about:
 *
 * - NgRx is an application-state detail: allowed only in
 *   `features/<feature>/application/state/**` and in composition roots.
 * - Domain and pure shared primitives are plain TypeScript.
 * - Presentation and infrastructure never touch NgRx directly.
 *
 * `no-restricted-imports` options are replaced (not merged) per config block,
 * so every block below is built from the same `projectWide` base.
 */

const FEATURE_ROOT = 'src/app/features/*';

const NGRX_IN_STATE_ONLY =
  'NgRx belongs to the application state layer (features/<feature>/application/state/**) and to composition roots (app.config.ts, <feature>.providers.ts).';

/** Restrictions that apply to every TypeScript file of the project. */
const projectWide = {
  paths: [
    {
      name: '@ngrx/store',
      importNames: ['createFeatureSelector'],
      message:
        'Use createFeature(): it already generates the feature selector and one selector per top-level state property.',
    },
  ],
  patterns: [
    {
      group: ['@ngrx/signals', '@ngrx/signals/*'],
      message:
        'NgRx SignalStore is not part of this architecture. Use the NgRx Global Store (createFeature / createActionGroup / createReducer / functional effects).',
    },
    {
      regex: '^@features/[^/]+/.+',
      message:
        "Deep feature imports are forbidden. Inside the same feature use relative imports; across features import only from '@features/<feature>'.",
    },
  ],
};

const ngrxForbidden = {
  group: ['@ngrx/*', '@ngrx/*/**'],
  message: NGRX_IN_STATE_ONLY,
};

const TRANSLOCO_GROUP = [
  '@jsverse/transloco',
  '@jsverse/transloco/**',
  '@jsverse/transloco-*',
  '@jsverse/transloco-*/**',
];

/**
 * Transloco is a presentation concern. Only presentation and the technical
 * i18n configuration (core/i18n) may know about it; the inner layers expose
 * semantic codes/data and let presentation translate them.
 */
const translocoForbidden = (layer) => ({
  group: TRANSLOCO_GROUP,
  message: `${layer} must not depend on Transloco: expose semantic codes/data and translate them in presentation (core/i18n owns the technical i18n configuration).`,
});

const frameworkFree = (layer) => [
  {
    group: ['@angular/*', '@angular/*/**'],
    message: `${layer} must stay framework-agnostic: it cannot import Angular. Use a domain/application abstraction instead.`,
  },
  {
    group: ['@ngrx/*', '@ngrx/*/**'],
    message: `${layer} must stay framework-agnostic: it cannot import NgRx.`,
  },
  {
    group: ['rxjs', 'rxjs/**'],
    message: `${layer} must stay framework-agnostic: it cannot import RxJS.`,
  },
  {
    group: ['@environments/**', '@app/**'],
    message: `${layer} cannot depend on environment configuration or application-wide infrastructure.`,
  },
  translocoForbidden(layer),
];

const featureInternalsForbidden = {
  group: ['@features/**'],
  message:
    'Shared and core code must not depend on features. Consume features only from composition roots or other features.',
};

/**
 * @param {string} name config block name
 * @param {string[]} files globs
 * @param {{ paths?: object[]; patterns?: object[] }} extra restrictions added to the project-wide base
 */
function restrict(name, files, extra = {}) {
  return {
    name: `project/restricted-imports/${name}`,
    files,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [...projectWide.paths, ...(extra.paths ?? [])],
          patterns: [...projectWide.patterns, ...(extra.patterns ?? [])],
        },
      ],
    },
  };
}

/**
 * Ordered flat-config blocks: later blocks override earlier ones for the same
 * file, so the generic "no NgRx anywhere" block comes first and the explicit
 * exceptions / stricter layers follow.
 */
export const restrictedImports = [
  restrict('default', ['src/**/*.ts'], { patterns: [ngrxForbidden] }),

  // Composition roots and application state may use NgRx.
  restrict('ngrx-allowed', [
    'src/app/app.config.ts',
    `${FEATURE_ROOT}/*.providers.ts`,
    `${FEATURE_ROOT}/application/state/**/*.ts`,
    `${FEATURE_ROOT}/testing/**/*.ts`,
  ]),

  restrict('domain', [`${FEATURE_ROOT}/domain/**/*.ts`], {
    patterns: [
      ...frameworkFree('Domain'),
      {
        group: ['jwt-decode'],
        message:
          'Domain cannot depend on token-format libraries. Decode tokens in infrastructure mappers.',
      },
    ],
  }),

  restrict('shared', ['src/app/shared/**/*.ts'], {
    patterns: [ngrxForbidden, featureInternalsForbidden],
  }),

  restrict(
    'shared-pure',
    ['src/app/shared/types/**/*.ts', 'src/app/shared/state/request/**/*.ts'],
    {
      patterns: [...frameworkFree('Pure shared code'), featureInternalsForbidden],
    },
  ),

  // Core may consume a feature public API (`@features/<feature>`); deep imports are
  // already rejected project-wide.
  restrict('core', ['src/app/core/**/*.ts'], { patterns: [ngrxForbidden] }),

  restrict('presentation', [`${FEATURE_ROOT}/presentation/**/*.ts`], {
    patterns: [
      {
        group: ['@ngrx/*', '@ngrx/*/**'],
        message:
          'Presentation cannot import NgRx directly. Inject the feature Facade (e.g. AuthFacade) and read Signals / call actions through it.',
      },
    ],
  }),

  restrict('infrastructure', [`${FEATURE_ROOT}/infrastructure/**/*.ts`], {
    patterns: [
      {
        group: ['@ngrx/*', '@ngrx/*/**'],
        message:
          'Infrastructure cannot import NgRx. Implement domain repositories / application ports; state lives in application/state.',
      },
      translocoForbidden('Infrastructure'),
    ],
  }),

  // Application (ports / tokens / state) stays translation-agnostic. This block
  // re-forbids NgRx for ports/tokens; the state-specific block below re-allows
  // NgRx while keeping Transloco forbidden.
  restrict('feature-application', [`${FEATURE_ROOT}/application/**/*.ts`], {
    patterns: [ngrxForbidden, translocoForbidden('Application (ports/tokens/state)')],
  }),
  restrict('feature-application-state', [`${FEATURE_ROOT}/application/state/**/*.ts`], {
    patterns: [translocoForbidden('Application state')],
  }),
];
