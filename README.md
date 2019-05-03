automerge & monaco: is this the worst idea

just a little experiment. performance is ~~probably~~ confirmed hilariously
terrible because of automerge's lack of a true string-wise crdt. (EDIT: and also
general comedically unscalable design, it is basically a toy, this was not a
good use of my time)

TODO
- cursor/presence indicators
- ~~override/replace monaco's undo handling with our own~~ done but janky
- repurpose automerge's "commit message" faculties to stash metadata like cursor
  position for undo
