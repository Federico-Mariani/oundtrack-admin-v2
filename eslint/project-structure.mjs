// @ts-check

const SPEC_FILES = 'src/**/*.spec.ts';

/**
 * Creates a structure rule that rejects every matching file except the
 * explicitly allowed paths.
 *
 * @param {string} name
 * @param {string[]} files
 * @param {string[]} ignores
 * @param {string} message
 */
function forbidLocation(name, files, ignores, message) {
    return {
        name: `project/structure/${name}`,
        files,
        ignores,
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'Program',
                    message,
                },
            ],
        },
    };
}

/**
 * Enforces a filename convention inside a known architectural location.
 *
 * Spec files are excluded because their final suffix is always `.spec.ts`.
 *
 * @param {string} name
 * @param {string[]} files
 * @param {string[]} validFiles
 * @param {string} message
 */
function requireFileName(name, files, validFiles, message) {
    return forbidLocation(
        `filename/${name}`,
        files,
        [SPEC_FILES, ...validFiles],
        message,
    );
}

export const projectStructure = [
    // ---------------------------------------------------------------- app

    forbidLocation(
        'app-root',
        ['src/app/*/**/*.ts'],
        [
            'src/app/core/**',
            'src/app/shared/**',
            'src/app/features/**',
            'src/app/presentation/**',
        ],
        'Unknown top-level folder under src/app. Allowed: core/, shared/, presentation/, features/<feature>/.',
    ),

    // ---------------------------------------------------------------- feature

    forbidLocation(
        'feature-root-files',
        ['src/app/features/*/*.ts'],
        [
            'src/app/features/*/index.ts',
            'src/app/features/*/*.providers.ts',
        ],
        'A feature root may only contain index.ts and <feature>.providers.ts. Put implementation files in domain/, application/, infrastructure/, presentation/ or testing/.',
    ),

    forbidLocation(
        'feature-layers',
        ['src/app/features/*/*/**/*.ts'],
        [
            'src/app/features/*/domain/**',
            'src/app/features/*/application/**',
            'src/app/features/*/infrastructure/**',
            'src/app/features/*/presentation/**',
            'src/app/features/*/testing/**',
        ],
        'Unknown layer inside a feature. Allowed: domain/, application/, infrastructure/, presentation/, testing/.',
    ),

    // ---------------------------------------------------------------- application

    forbidLocation(
        'application-layer',
        ['src/app/features/*/application/*/**/*.ts'],
        [
            'src/app/features/*/application/ports/**',
            'src/app/features/*/application/tokens/**',
            'src/app/features/*/application/state/**',
        ],
        'Unknown folder inside application/. Allowed: ports/, tokens/, state/.',
    ),

    // ---------------------------------------------------------------- domain naming

    requireFileName(
        'domain-model',
        ['src/app/features/*/domain/models/**/*.ts'],
        ['src/app/features/*/domain/models/**/*.model.ts'],
        'Domain models must use the "*.model.ts" suffix.',
    ),

    requireFileName(
        'domain-error',
        ['src/app/features/*/domain/errors/**/*.ts'],
        ['src/app/features/*/domain/errors/**/*.error.ts'],
        'Domain errors must use the "*.error.ts" suffix.',
    ),

    // ---------------------------------------------------------------- application naming

    requireFileName(
        'application-port',
        ['src/app/features/*/application/ports/**/*.ts'],
        ['src/app/features/*/application/ports/**/*.port.ts'],
        'Application ports must use the "*.port.ts" suffix.',
    ),

    requireFileName(
        'application-token',
        ['src/app/features/*/application/tokens/**/*.ts'],
        ['src/app/features/*/application/tokens/**/*.token.ts'],
        'Injection tokens must use the "*.token.ts" suffix.',
    ),

    requireFileName(
        'ngrx-actions',
        ['src/app/features/*/application/state/actions/**/*.ts'],
        ['src/app/features/*/application/state/actions/**/*.actions.ts'],
        'NgRx action files must use the "*.actions.ts" suffix.',
    ),

    requireFileName(
        'ngrx-reducer',
        ['src/app/features/*/application/state/reducers/**/*.ts'],
        ['src/app/features/*/application/state/reducers/**/*.reducer.ts'],
        'NgRx reducer files must use the "*.reducer.ts" suffix.',
    ),

    requireFileName(
        'ngrx-effects',
        ['src/app/features/*/application/state/effects/**/*.ts'],
        ['src/app/features/*/application/state/effects/**/*.effects.ts'],
        'NgRx effect files must use the "*.effects.ts" suffix.',
    ),

    requireFileName(
        'ngrx-facade',
        ['src/app/features/*/application/state/facades/**/*.ts'],
        ['src/app/features/*/application/state/facades/**/*.facade.ts'],
        'Facade files must use the "*.facade.ts" suffix.',
    ),

    requireFileName(
        'ngrx-state-root',
        ['src/app/features/*/application/state/*.ts'],
        [
            'src/app/features/*/application/state/*.state.ts',
            'src/app/features/*/application/state/*.feature.ts',
            'src/app/features/*/application/state/*.reducer.ts',
        ],
        'Files directly under application/state/ must be "*.state.ts", "*.feature.ts" or "*.reducer.ts".',
    ),

    // ---------------------------------------------------------------- infrastructure naming

    requireFileName(
        'infrastructure-dto',
        ['src/app/features/*/infrastructure/api/**/*.ts'],
        ['src/app/features/*/infrastructure/api/**/*.dto.ts'],
        'API DTO files must use the "*.dto.ts" suffix.',
    ),

    requireFileName(
        'infrastructure-mapper',
        ['src/app/features/*/infrastructure/mappers/**/*.ts'],
        ['src/app/features/*/infrastructure/mappers/**/*.mapper.ts'],
        'Infrastructure mapper files must use the "*.mapper.ts" suffix.',
    ),

    requireFileName(
        'infrastructure-repository',
        ['src/app/features/*/infrastructure/repositories/**/*.ts'],
        ['src/app/features/*/infrastructure/repositories/**/*.repository.ts'],
        'Repository implementations must use the "*.repository.ts" suffix.',
    ),

    // ---------------------------------------------------------------- presentation naming

    requireFileName(
        'presentation-guard',
        ['src/app/features/*/presentation/routing/guards/**/*.ts'],
        ['src/app/features/*/presentation/routing/guards/**/*.guard.ts'],
        'Route guards must use the "*.guard.ts" suffix.',
    ),

    // ---------------------------------------------------------------- core naming

    requireFileName(
        'core-platform-adapter',
        ['src/app/core/*/platform/**/*.ts'],
        ['src/app/core/*/platform/**/*.adapter.ts'],
        'Platform adapters must use the "*.adapter.ts" suffix.',
    ),
];