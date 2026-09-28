import { describe, expect, test } from 'bun:test';

import { lintFindings } from './lint.fixtures';

// Biome turns on the React and Tailwind rules only for a manifest that lists
// their libraries.
const MANIFEST = JSON.stringify({
  name: 'fixture',
  dependencies: {
    react: '19.2.0',
    tailwindcss: '4.2.0',
  },
});

const WEB_PRESETS = [
  'base',
  'react',
  'react-dom',
  'tailwind',
];

const component = (markup: string): string =>
  `export function Panel(): React.ReactElement {\n  return (\n    ${markup}\n  );\n}\n`;

const ROOM_HOOK = `import { useEffect, useEffectEvent } from 'react';

const track = (label: string): void => {
  globalThis.dispatchEvent(new Event(label));
};

export function useRoom(label: string): void {
  const onOpen = useEffectEvent((): void => {
    track(label);
  });

  useEffect(() => {
    onOpen();
  }, []);
}
`;

describe('framework presets', () => {
  test.each([
    {
      condition: 'a component is a class',
      source:
        "import { Component } from 'react';\n\nexport class Panel extends Component {\n  public render(): null {\n    return null;\n  }\n}\n",
      rule: 'useReactFunctionComponents',
    },
    {
      condition: 'a ref is a string',
      source: component("<div ref='box' />"),
      rule: 'noReactStringRefs',
    },
    {
      condition: 'an element with an interactive role cannot take focus',
      source: component("<div role='button' />"),
      rule: 'useFocusableInteractive',
    },
    {
      condition: 'an ARIA attribute is written in camelCase',
      source: component("<input ariaLabel='Email' />"),
      rule: 'noUnknownAttribute',
    },
    {
      condition: 'an id is typed by hand',
      source: component("<input id='email' />"),
      rule: 'useUniqueElementIds',
    },
    {
      condition: 'raw HTML is injected beside children',
      source: component(
        "<div dangerouslySetInnerHTML={{ __html: '' }}>text</div>",
      ),
      rule: 'noDangerouslySetInnerHtmlWithChildren',
    },
    {
      condition: 'a class carries an arbitrary value',
      source: component("<div className='p-[13px]' />"),
      rule: 'noTailwindArbitraryValue',
    },
  ])('should report $rule when $condition', ({ rule, source }) => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        'src/panel.tsx': source,
      },
      presets: WEB_PRESETS,
    };

    // Act
    const { rules } = lintFindings(project);

    // Assert
    expect(rules).toContain(rule);
  });

  test.each([
    {
      condition: 'a cascade layer has no name',
      files: {
        'src/styles.css': '@layer {\n  a {\n    color: red;\n  }\n}\n',
      },
      presets: [
        'base',
        'css',
      ],
      rule: 'useNamedLayer',
    },
    {
      condition: 'a list item takes a click handler',
      files: {
        'src/panel.tsx': component('<li onClick={() => undefined}>item</li>'),
      },
      presets: [
        'base',
        'react',
      ],
      rule: 'noNoninteractiveElementInteractions',
    },
    {
      condition: 'a component file is in PascalCase',
      files: {
        'src/Panel.tsx': component('<div />'),
      },
      presets: [
        'base',
        'react',
      ],
      rule: 'useFilenamingConvention',
    },
  ])(
    'should report $rule when $condition and a repository extends $presets',
    ({ files, presets, rule }) => {
      // Arrange
      const project = {
        files: {
          'package.json': MANIFEST,
          ...files,
        },
        presets,
      };

      // Act
      const { rules } = lintFindings(project);

      // Assert
      expect(rules).toContain(rule);
    },
  );

  test.each([
    {
      condition: 'a cascade layer has no name',
      files: {
        'src/styles.css': '@layer {\n  a {\n    color: red;\n  }\n}\n',
      },
      rule: 'useNamedLayer',
    },
    {
      condition: 'a list item takes a click handler',
      files: {
        'src/panel.tsx': component('<li onClick={() => undefined}>item</li>'),
      },
      rule: 'noNoninteractiveElementInteractions',
    },
  ])(
    'should not report $rule when $condition and a repository extends only base',
    ({ files, rule }) => {
      // Arrange
      const project = {
        files: {
          'package.json': MANIFEST,
          ...files,
        },
        presets: [
          'base',
        ],
      };

      // Act
      const { rules } = lintFindings(project);

      // Assert
      expect(rules).not.toContain(rule);
    },
  );

  test('should report no arbitrary value when a repository extends only base', () => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        'src/panel.tsx': component("<div className='p-[13px]' />"),
      },
      presets: [
        'base',
      ],
    };

    // Act
    const { rules } = lintFindings(project);

    // Assert
    expect(rules).not.toContain('noTailwindArbitraryValue');
  });

  test.each([
    {
      condition: 'a context is read with useContext',
      files: {
        'src/panel.tsx':
          "import { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nexport function Panel(): string {\n  return useContext(ThemeContext);\n}\n",
      },
      message: 'Read a context with use(Context)',
    },
    {
      condition: 'a context is provided through Context.Provider',
      files: {
        'src/panel.tsx':
          "import { createContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nexport function Panel(): React.ReactElement {\n  return <ThemeContext.Provider value='dark' />;\n}\n",
      },
      message: 'Render the context itself as its provider',
    },
    {
      condition: 'a component takes defaultProps',
      files: {
        'src/panel.tsx': `${component('<div />')}\nPanel.defaultProps = {};\n`,
      },
      message: 'Give a prop its default in the parameter',
    },
    {
      condition: 'a ref is made with createRef',
      files: {
        'src/panel.ts':
          "import { createRef } from 'react';\n\nexport const panelRef = createRef<HTMLDivElement>();\n",
      },
      message: 'Hold a ref with useRef or a ref callback',
    },
    {
      condition: 'an id is random',
      files: {
        'src/panel.tsx': component('<input id={crypto.randomUUID()} />'),
      },
      message: 'Take an id from useId',
    },
    {
      condition: 'an email field declares no autocomplete',
      files: {
        'src/panel.tsx': component("<input aria-label='Email' type='email' />"),
      },
      message: "A field for the user's own data declares its purpose",
    },
    {
      condition: 'a spec finds an element by its test id',
      files: {
        'src/__tests__/panel.spec.tsx':
          "import { screen } from '@testing-library/react';\n\nexport const panel = (): HTMLElement => screen.getByTestId('panel');\n",
      },
      message: 'Find an element as a person does',
    },
    {
      condition: 'a spec finds an element by a selector',
      files: {
        'src/__tests__/panel.spec.tsx':
          "export const panel = (container: HTMLElement): Element | null =>\n  container.querySelector('.panel');\n",
      },
      message: 'Find an element as a person does',
    },
    {
      condition: 'a height is h-screen',
      files: {
        'src/panel.tsx': component("<main className='min-h-screen' />"),
      },
      message: 'Size to the dynamic viewport with h-dvh',
    },
    {
      condition: 'a variant map narrows with a max-* breakpoint',
      files: {
        'src/panel.variants.ts':
          "import { cva } from 'class-variance-authority';\n\nexport const panelVariants = cva('flex max-md:hidden');\n",
      },
      message: 'Widen from the small screen',
    },
  ])('should report a plugin finding when $condition', ({ files, message }) => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        ...files,
      },
      presets: WEB_PRESETS,
    };

    // Act
    const { plugins } = lintFindings(project);

    // Assert
    expect(plugins.some((finding) => finding.startsWith(message))).toBe(true);
  });

  test.each([
    {
      condition: 'a field declares its autocomplete',
      files: {
        'src/panel.tsx': component(
          "<input aria-label='Email' autoComplete='email' type='email' />",
        ),
      },
    },
    {
      condition:
        'classes use the dynamic viewport and widen from the small screen',
      files: {
        'src/panel.tsx': component(
          "<main className='h-dvh max-w-md md:flex' />",
        ),
      },
    },
    {
      condition: 'a spec finds an element by its role',
      files: {
        'src/__tests__/panel.spec.tsx':
          "import { screen } from '@testing-library/react';\n\nexport const panel = (): HTMLElement => screen.getByRole('region');\n",
      },
    },
  ])('should report no plugin finding when $condition', ({ files }) => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        ...files,
      },
      presets: WEB_PRESETS,
    };

    // Act
    const { plugins } = lintFindings(project);

    // Assert
    expect(plugins).toStrictEqual([]);
  });

  test('should report no missing dependency when an effect calls an effect event', () => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        'src/room.hooks.ts': ROOM_HOOK,
      },
      presets: WEB_PRESETS,
    };

    // Act
    const { rules } = lintFindings(project);

    // Assert
    expect(rules).not.toContain('useExhaustiveDependencies');
  });

  test('should report a missing dependency when an effect calls a plain function', () => {
    // Arrange
    const project = {
      files: {
        'package.json': MANIFEST,
        'src/room.hooks.ts': ROOM_HOOK.replace(
          'useEffectEvent((): void => {',
          '((): void => {',
        ).replace(', useEffectEvent', ''),
      },
      presets: WEB_PRESETS,
    };

    // Act
    const { rules } = lintFindings(project);

    // Assert
    expect(rules).toContain('useExhaustiveDependencies');
  });
});
