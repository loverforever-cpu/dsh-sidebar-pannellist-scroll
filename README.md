# dsh-sidebar-panellist-scroll

A tiny DeepSeek Harness (DSH) Web UI plugin that caps the sidebar's global panel
list at a fixed height and scrolls it inside, giving the reclaimed vertical space
back to the workspace and session list.

## The problem

The sidebar's global panel list (`sidebar.panellist` — the column of entries such
as *Plugins*, *Tasks*, *Skills*, *Memory*, *SSH*, and the *More* menu) is declared
`flex: none` by the shell's own stylesheet:

```css
.panelList { flex-direction: column; flex: none; gap: 2px; margin-bottom: 8px; display: flex }
```

`flex: none` means it never shrinks: it always occupies its full content height.
The region that holds workspaces and sessions is `flex: 1; overflow: hidden`, so
it only ever gets what is left over. Every panel entry a plugin adds therefore
takes height directly away from the session list — with a rich set of installed
plugins, the sidebar runs out of room for conversations long before it runs out of
pixels.

## What this plugin does

It injects one stylesheet into `<head>` on startup and nothing else:

```css
[class*="_sidebarCol"] nav[class*="_panelList"] {
  max-height: 240px;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--dsh-scrollbar-thumb, rgba(127,127,127,0.35)) transparent;
}
```

The panel list becomes a fixed-height block with its own scrollbar, so it can grow
to any number of entries without pushing the session list down. Scrollbar colours
reuse the sidebar's own theme tokens, so light and dark themes both work without
extra configuration.

## Changing the height

Edit `max-height: 240px;` in `client.js`. Roughly five entries fit at 240px with
the default row height and gap; the shell's own breakpoint raises the gap to 12px
on tall layouts, so the visible count varies a little. No restart of the plugin is
needed beyond reloading the page.

## Install

The bundle is designed for `plugin_manager` in DSH, which writes the profile
dependency and reconciles the loader layer for you:

1. Clone this repository somewhere permanent.
2. Point `plugin_manager` `install_bundle` at the cloned directory (absolute path).
3. Reload the Web UI page.

Installing by hand means adding a `link:` dependency in the profile's
`package.json` plus the bundle row in the loader patch; letting `plugin_manager`
do it avoids writing those files directly.

Remove it with `plugin_manager` `remove_bundle`.

## Why the class names look like that

DSH's Web UI ships CSS-module class names such as `hHd-Xa_panelList`. The hash
prefix is regenerated on every rebuild, while the trailing local name (`panelList`,
`sidebarCol`) is stable. The selectors match on the stable half via attribute
substrings instead of pinning a hash.

The `_sidebarCol` prefix matters: `_panelList` also exists inside the
plugin-market page, which keeps its own full-height list. Scoping to the sidebar
column (the layout package is the only package in a profile using that local name)
leaves it alone. The `nav` tag further narrows the match, since the shell renders
this list as a `<nav>` element.

If a future DSH release renames those local names, this plugin stops applying —
silently, and without breaking anything, because it only adds a stylesheet.

## Compatibility

Developed and verified against DSH `0.2.2-rc.1` (Web UI). It reads no DOM state, registers
no slot, and holds no state of its own: it adds a `<style>` element in `apply` via
`ctx.effect` and removes it on disposal.

This is a workaround for a layout decision that arguably belongs upstream — a
collapsible or scrollable panel list in the shell itself. If DSH ships one, this
plugin becomes unnecessary.

## 中文说明

DSH Web UI 的侧边栏里，装着全局面板入口的那一列（插件、任务看板、技能中心、记忆系统、
SSH……一直到「更多」）在样式里写着 `flex: none`，意思是它永远按内容高度占位、绝不收缩；
而下面装工作区和会话的区域是 `flex: 1; overflow: hidden`，只能吃剩下的。所以你装的插件
越多，会话列表被挤得越狠。

这个插件只做一件事：给那一列加一个高度上限（默认 240px）和内部滚动，省下来的高度全部
还给会话列表。滚动条颜色沿用侧边栏自己的主题变量，深浅色都适配。

想改高度就改 `client.js` 里的 `max-height: 240px`，改完刷新页面即可。

安装走 DSH 的 `plugin_manager`，把克隆下来的目录作为 `install_bundle` 的目标即可，
它会替你处理 profile 依赖和 loader 层，不用手写那两个文件。

## License

MIT. See [LICENSE](LICENSE).