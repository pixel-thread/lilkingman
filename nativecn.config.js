/** @type {import('@nativecn/cli').Config} */
module.exports = {
  styling: 'nativewind',
  theme: {
    useExisting: false,
    existingThemePath: null,
    defaultTheme: 'light',
    useSystemTheme: true,
  },
  components: { outDir: './src/components/ui' },
};
