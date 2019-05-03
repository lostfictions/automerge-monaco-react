automerge & monaco: is this the worst idea

just a little experiment. performance is probably hilariously terrible because
of automerge's lack of a true string-wise crdt.

TODO
- override/replace monaco's undo handling with our own
- network test
- cursor/presence indicator


GENERAL MONACO THINGS THAT ARE BADLY DOCUMENTED
- how do you actually override something like an undo handler?
  - kludge: maybe figure out how to clobber the shortcut by hacking event
    priority
  - possibly better: override the service with a dummy in a way that doesn't
    explode (see https://github.com/react-monaco-editor/react-monaco-editor/pull/192)
- how do you override something like keybindings (or make handlers
  preventDefault), ctrl+d bookmarks which makes it kinda hard to use for
  multi-select
