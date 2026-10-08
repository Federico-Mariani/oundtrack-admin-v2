// @ts-check
import boundaries from 'eslint-plugin-boundaries';

/**
 * Clean Architecture boundaries, enforced with eslint-plugin-boundaries.
 *
 * Every file under `src/` is classified as exactly one element type (see
 * `elements` below). Element patterns match FOLDERS: the plugin walks up from
 * the file and uses the deepest folder matching a descriptor, so
 * `features/<feature>/application/state` wins over `features/<feature>/application`.
 * Files living directly in a feature root (`index.ts`, `<feature>.providers.ts`)
 * are further distinguished with file categories (`boundaries/files`).
 *
 * The `boundaries/dependencies` rule allows only the dependencies listed in
 * `policies`; anything else is an error.
 *
 * Feature elements capture the feature name from the path
 * (`src/app/features/<feature>/...`), so the same policies apply to every
 * current and future feature without per-feature configuration.
 *
 * External packages (@angular, @ngrx, rxjs, ...) are restricted per layer in
 * `restricted-imports.mjs`; this file deals with local dependencies only.
 */

const FEATURE_ROOT = 'src/app/features/*';

/** Element types used by the policies below. */
const TYPES = {
  app: 'app',
  core: 'core',
  shared: 'shared',
  sharedPure: 'shared-pure',
  environments: 'environments',
  /** Files directly under `features/<feature>/`: public API (index.ts) and providers. */
  featureRoot: 'feature-root',
  featureDomain: 'feature-domain',
  featureApplication: 'feature-application',
  featureApplicationState: 'feature-application-state',
  featureFacade: 'feature-facade',
  featureInfrastructure: 'feature-infrastructure',
  featurePresentation: 'feature-presentation',
  featureTesting: 'feature-testing',
};

/** File categories (orthogonal to element types). */
const FILES = {
  test: 'test',
  publicApi: 'public-api',
  providers: 'providers',
};

const FEATURE_TYPES = [
  TYPES.featureRoot,
  TYPES.featureDomain,
  TYPES.featureApplication,
  TYPES.featureApplicationState,
  TYPES.featureFacade,
  TYPES.featureInfrastructure,
  TYPES.featurePresentation,
  TYPES.featureTesting,
];

/** Everything inside a feature except its root files (public API / providers). */
const FEATURE_INTERNAL_TYPES = FEATURE_TYPES.filter((type) => type !== TYPES.featureRoot);

/** Element classification by folder (see the header comment for the matching rules). */
const elements = [
  feature(TYPES.featureDomain, 'domain'),
  feature(TYPES.featureFacade, 'application/state/facades'),
  feature(TYPES.featureApplicationState, 'application/state'),
  feature(TYPES.featureApplication, 'application'),
  feature(TYPES.featureInfrastructure, 'infrastructure'),
  feature(TYPES.featurePresentation, 'presentation'),
  feature(TYPES.featureTesting, 'testing'),
  feature(TYPES.featureRoot),
  folder(TYPES.sharedPure, ['src/app/shared/types', 'src/app/shared/state/request']),
  folder(TYPES.shared, 'src/app/shared'),
  folder(TYPES.core, 'src/app/core'),
  folder(TYPES.environments, 'src/environments'),
  folder(TYPES.app, ['src', 'src/app']),
];

const files = [
  { category: FILES.test, pattern: '**/*.spec.ts' },
  { category: FILES.publicApi, pattern: `${FEATURE_ROOT}/index.ts` },
  { category: FILES.providers, pattern: `${FEATURE_ROOT}/*.providers.ts` },
];

/** The only cross-feature entry point: `features/<feature>/index.ts`. */
const featurePublicApi = {
  element: { type: TYPES.featureRoot },
  file: { categories: FILES.publicApi },
};

/** The feature composition root (<feature>.providers.ts): wiring only, never a dependency target. */
const featureProviders = {
  element: { type: TYPES.featureRoot },
  file: { categories: FILES.providers },
};

/** The public API (index.ts) of a feature OTHER than the importer's. */
const otherFeaturePublicApi = {
  element: {
    type: TYPES.featureRoot,
    captured: { feature: '!{{ from.element.captured.feature }}' },
  },
  file: { categories: FILES.publicApi },
};

/**
 * The public API (index.ts) of the importer's OWN feature. A file inside a
 * feature must never reach its own bounded context through `@features/<feature>`:
 * `@features/<feature>` is the entry point for consumers OUTSIDE the feature.
 * Same-feature dependencies use relative imports.
 */
const sameFeaturePublicApi = {
  element: {
    type: TYPES.featureRoot,
    captured: { feature: '{{ from.element.captured.feature }}' },
  },
  file: { categories: FILES.publicApi },
};

/**
 * Every feature file except the public API entry point: the layer folders plus
 * the providers file. (Files without categories are described with
 * `categories: null`, so this is expressed positively rather than with `noneOf`.)
 */
const featureInternals = [element(...FEATURE_INTERNAL_TYPES), featureProviders];

/** Feature internals that belong to a feature other than the importer's. */
const otherFeatureInternals = [
  {
    element: {
      type: FEATURE_INTERNAL_TYPES,
      captured: { feature: '!{{ from.element.captured.feature }}' },
    },
  },
  {
    element: {
      type: TYPES.featureRoot,
      captured: { feature: '!{{ from.element.captured.feature }}' },
    },
    file: { categories: FILES.providers },
  },
];

/**
 * Dependency policies. Evaluated in order, the last matching policy wins, so
 * the explicit `disallow` policies with human-readable messages are listed
 * last and override the generic allow lists.
 */
const policies = [
  // ---------------------------------------------------------------- shared / core / app
  { from: element(TYPES.sharedPure), allow: { to: element(TYPES.sharedPure) } },
  { from: element(TYPES.shared), allow: { to: element(TYPES.shared, TYPES.sharedPure) } },
  { from: element(TYPES.environments), allow: { to: element(TYPES.environments) } },
  {
    from: element(TYPES.core),
    allow: {
      to: [
        element(TYPES.core, TYPES.shared, TYPES.sharedPure, TYPES.environments),
        featurePublicApi,
      ],
    },
  },
  {
    from: element(TYPES.app),
    allow: {
      to: [
        element(TYPES.app, TYPES.core, TYPES.shared, TYPES.sharedPure, TYPES.environments),
        featurePublicApi,
      ],
    },
  },

  // ---------------------------------------------------------------- feature layers
  {
    from: element(TYPES.featureDomain),
    allow: { to: [sameFeature(TYPES.featureDomain), element(TYPES.sharedPure)] },
  },
  {
    from: element(TYPES.featureApplication),
    allow: {
      to: [
        sameFeature(TYPES.featureDomain, TYPES.featureApplication),
        element(TYPES.shared, TYPES.sharedPure),
      ],
    },
  },
  {
    from: element(TYPES.featureApplicationState),
    allow: {
      to: [
        sameFeature(TYPES.featureDomain, TYPES.featureApplication, TYPES.featureApplicationState),
        element(TYPES.shared, TYPES.sharedPure),
        // NOTE: a feature's own public API (index.ts) is intentionally NOT allowed here.
        // Feature state is local by default: state managers must not couple to each
        // other through another feature's public API (see the explicit disallow below).
      ],
    },
  },
  {
    from: element(TYPES.featureFacade),
    allow: {
      to: [
        sameFeature(
          TYPES.featureDomain,
          TYPES.featureApplication,
          TYPES.featureApplicationState,
          TYPES.featureFacade,
        ),
        element(TYPES.shared, TYPES.sharedPure),
      ],
    },
  },
  {
    from: element(TYPES.featureInfrastructure),
    allow: {
      to: [
        sameFeature(TYPES.featureDomain, TYPES.featureApplication, TYPES.featureInfrastructure),
        element(TYPES.shared, TYPES.sharedPure, TYPES.core, TYPES.environments),
      ],
    },
  },
  {
    from: element(TYPES.featurePresentation),
    allow: {
      to: [
        sameFeature(
          TYPES.featureDomain,
          TYPES.featureApplication,
          TYPES.featureFacade,
          TYPES.featurePresentation,
        ),
        element(TYPES.shared, TYPES.sharedPure, TYPES.core),
        featurePublicApi,
      ],
    },
  },

  // ---------------------------------------------------------------- feature root files
  // `<feature>.providers.ts` is the composition root: it binds ports to
  // infrastructure and registers the NgRx feature. As a composition root it may
  // also bind an application port to a presentation adapter (e.g. a feedback
  // port implemented by a presentation service that owns i18n), so it is the one
  // place allowed to reference presentation. `index.ts` is the public API and
  // may re-export anything from its own feature.
  {
    from: { element: element(TYPES.featureRoot).element, file: { categories: FILES.providers } },
    allow: {
      to: [
        sameFeature(
          TYPES.featureDomain,
          TYPES.featureApplication,
          TYPES.featureApplicationState,
          TYPES.featureFacade,
          TYPES.featureInfrastructure,
          TYPES.featurePresentation,
        ),
        element(TYPES.shared, TYPES.sharedPure, TYPES.core, TYPES.environments),
        featurePublicApi,
      ],
    },
  },
  {
    from: { element: element(TYPES.featureRoot).element, file: { categories: FILES.publicApi } },
    allow: { to: sameFeature(...FEATURE_TYPES) },
  },
  {
    from: element(TYPES.featureTesting),
    allow: {
      to: [
        sameFeature(...FEATURE_INTERNAL_TYPES),
        element(TYPES.shared, TYPES.sharedPure, TYPES.core, TYPES.environments),
        featurePublicApi,
      ],
    },
  },

  // ---------------------------------------------------------------- explicit violations (win over the allow lists above)
  {
    from: element(TYPES.core, TYPES.app),
    disallow: { to: featureInternals },
    message:
      "'{{ from.type }}' cannot depend on feature internals ('{{ to.type }}'). Import from the feature public API '@features/{{ to.captured.feature }}' instead.",
  },
  {
    from: element(TYPES.shared, TYPES.sharedPure),
    disallow: { to: element(...FEATURE_TYPES, TYPES.core, TYPES.app, TYPES.environments) },
    message:
      "Shared code must stay feature-agnostic: '{{ from.type }}' cannot import '{{ to.type }}'. Move the concept to shared or depend on an abstraction.",
  },
  {
    from: element(TYPES.featureDomain),
    disallow: {
      to: element(
        TYPES.featureApplication,
        TYPES.featureApplicationState,
        TYPES.featureFacade,
        TYPES.featureInfrastructure,
        TYPES.featurePresentation,
        TYPES.featureRoot,
        TYPES.featureTesting,
        TYPES.shared,
        TYPES.core,
        TYPES.app,
        TYPES.environments,
      ),
    },
    message:
      "Domain must stay framework-agnostic and must not know outer layers: it cannot import '{{ to.type }}'. Depend only on the feature domain and pure shared primitives.",
  },
  {
    from: element(TYPES.featureApplication),
    disallow: {
      to: [
        element(
          TYPES.featureApplicationState,
          TYPES.featureFacade,
          TYPES.featureInfrastructure,
          TYPES.featurePresentation,
          TYPES.featureTesting,
        ),
        featureProviders,
      ],
    },
    message:
      "Application contracts (ports/tokens) cannot import '{{ to.type }}'. They depend on the domain only; implementations are bound in the feature providers.",
  },
  {
    from: element(TYPES.featureApplicationState, TYPES.featureFacade),
    disallow: {
      to: [
        element(TYPES.featureInfrastructure, TYPES.featurePresentation, TYPES.featureTesting),
        featureProviders,
      ],
    },
    message:
      "Application state cannot import '{{ to.type }}'. Effects must depend on application ports (InjectionToken + interface), never on infrastructure implementations or presentation.",
  },
  {
    from: element(TYPES.featureInfrastructure),
    disallow: {
      to: [
        element(
          TYPES.featureApplicationState,
          TYPES.featureFacade,
          TYPES.featurePresentation,
          TYPES.featureTesting,
        ),
        featureProviders,
      ],
    },
    message:
      "Infrastructure cannot import '{{ to.type }}'. Implement domain repositories and application ports only; it must not know NgRx state, facades or presentation.",
  },
  {
    from: element(TYPES.featurePresentation),
    disallow: {
      to: [
        element(TYPES.featureApplicationState, TYPES.featureInfrastructure, TYPES.featureTesting),
        featureProviders,
      ],
    },
    message:
      "Presentation cannot import '{{ to.type }}'. Use the feature Facade (application/state/facades) as the only entry to application state.",
  },
  // Feature state is local by default: a feature's reducers/effects/actions/facades
  // must not depend on ANOTHER feature's state manager, even through its public API.
  // Presentation and composition roots may still consume `@features/<feature>`.
  {
    from: element(TYPES.featureApplicationState, TYPES.featureFacade),
    disallow: { to: otherFeaturePublicApi },
    message:
      "Feature state is local by default: '{{ from.type }}' of feature '{{ from.captured.feature }}' cannot depend on another feature's public API ('@features/{{ to.captured.feature }}'). State managers must not couple to each other; collaborate through an application port, a shared domain-neutral contract, or composition at the app/providers boundary.",
  },
  // After the layer rules so that a cross-feature violation gets this message, whatever the layer.
  {
    from: element(...FEATURE_TYPES),
    disallow: { to: otherFeatureInternals },
    message:
      "Cross-feature deep import is forbidden: feature '{{ from.captured.feature }}' cannot import internals of feature '{{ to.captured.feature }}'. Import from its public API '@features/{{ to.captured.feature }}' instead.",
  },

  // ---------------------------------------------------------------- spec files (last: tests are exempt from layer rules)
  // Tests may wire real implementations together, but stay inside their
  // feature (or consume other features through their public API).
  {
    from: { file: { categories: FILES.test } },
    allow: {
      to: [
        sameFeature(...FEATURE_TYPES),
        element(TYPES.app, TYPES.shared, TYPES.sharedPure, TYPES.core, TYPES.environments),
        featurePublicApi,
      ],
    },
  },

  // ---------------------------------------------------------------- self-import through the public API (last: wins over every allow above, specs included)
  // Internal feature imports must stay internal: a file inside `features/<feature>/**`
  // must not import its own bounded context through `@features/<same-feature>`.
  // `@features/<feature>` (index.ts) is the entry point for consumers OUTSIDE the
  // feature; same-feature dependencies use relative imports. Generic for every
  // current and future feature (no per-feature hardcoding). Cross-feature public
  // API imports stay allowed because they target another feature's public API.
  {
    from: element(...FEATURE_TYPES),
    disallow: { to: sameFeaturePublicApi },
    message:
      "Self-import through the public API is forbidden: feature '{{ from.captured.feature }}' must not import its own public API ('@features/{{ to.captured.feature }}'). Use relative imports inside the feature; '@features/<feature>' is the entry point for consumers outside the bounded context.",
  },
];

/**
 * Flat-config block that applies the architecture boundaries to `src/`.
 * Parser options (TypeScript) are configured by the caller.
 */
export const architectureBoundaries = {
  name: 'project/architecture-boundaries',
  files: ['src/**/*.ts'],
  plugins: { boundaries },
  settings: {
    'boundaries/elements': elements,
    'boundaries/files': files,
    // The `@spartan-ng/helm/*` UI kit is vendored under `libs/` and resolved
    // there via tsconfig path aliases. It is third-party code (like anything in
    // node_modules), not part of our architecture, so the plugin must treat it
    // as external and never classify it as an unknown local element.
    'boundaries/ignore': ['libs/**'],
    'boundaries/dependency-nodes': ['import', 'dynamic-import', 'export'],
    'import/resolver': { typescript: { project: './tsconfig.json' } },
  },
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message:
          "Architecture violation: '{{ from.type }}' is not allowed to import '{{ to.type }}'. See .junie/rules/architecture.md for the dependency rule.",
        policies,
      },
    ],
    // Every file in src/ must belong to a known architectural element.
    'boundaries/no-unknown-files': 'error',
    'boundaries/no-unknown-dependencies': 'error',
  },
};

// ------------------------------------------------------------------ helpers

/** Folder descriptor for a feature sub-tree; captures the feature name. */
function feature(type, subFolder) {
  const pattern = subFolder ? `${FEATURE_ROOT}/${subFolder}` : FEATURE_ROOT;
  return { type, pattern, partialMatch: false, capture: ['feature'] };
}

/** Folder descriptor outside features. */
function folder(type, pattern) {
  return { type, pattern, partialMatch: false };
}

/** Entity selector matching any of the given element types. */
function element(...types) {
  return { element: { type: types } };
}

/** Entity selector matching the given types only inside the importer's feature. */
function sameFeature(...types) {
  return {
    element: { type: types, captured: { feature: '{{ from.element.captured.feature }}' } },
  };
}
