window.__ModuleLoader__.load({
  id: '@local/sidebar-panellist-scroll',
  factory() {
    // The sidebar's global panel list (`sidebar.panellist`) is declared `flex: none`
    // by its own stylesheet, so it always occupies its full content height and every
    // row it grows takes vertical space away from the workspace/session region below
    // it. Capping its height and letting it scroll inside gives that space back.
    //
    // Class names are CSS-module hashes (`hHd-Xa_panelList`): the hash prefix changes
    // on every rebuild, the trailing local name does not, hence the attribute-substring
    // selectors. `_sidebarCol` is the layout package's sidebar column and is the only
    // package in the profile that uses that local name, so it scopes the rule to this
    // one column -- `_panelList` also exists inside the plugin-market page, which must
    // keep its own full-height list. The shell renders this list as a `nav` element,
    // so the tag also narrows the match.
    const SELECTOR = '[class*="_sidebarCol"] nav[class*="_panelList"]';
    const CSS = [
      SELECTOR + ' {',
      '  max-height: 240px;',
      '  min-height: 0;',
      '  overflow-y: auto;',
      '  overflow-x: hidden;',
      '  overscroll-behavior: contain;',
      '  scrollbar-width: thin;',
      '  scrollbar-color: var(--dsh-scrollbar-thumb, rgba(127,127,127,0.35)) transparent;',
      '}',
      SELECTOR + '::-webkit-scrollbar {',
      '  width: 6px;',
      '}',
      SELECTOR + '::-webkit-scrollbar-track {',
      '  background: transparent;',
      '}',
      SELECTOR + '::-webkit-scrollbar-thumb {',
      '  background: var(--dsh-scrollbar-thumb, rgba(127,127,127,0.35));',
      '  border-radius: 3px;',
      '}',
      SELECTOR + '::-webkit-scrollbar-thumb:hover {',
      '  background: var(--dsh-scrollbar-thumb-hover, rgba(127,127,127,0.6));',
      '}',
    ].join('\n');

    return {
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.dshSidebarPanellistScroll = '';
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => {
            style.remove();
          };
        });
      },
    };
  },
});