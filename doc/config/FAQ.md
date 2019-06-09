---
title: FAQ
lang: en-US
---

## How can I pass some environment variables to the next steps in a task?

Every step is executed in its own shell (run steps) or custom command (for clone, workspace and cache steps) so you cannot just `export MYVARIABLE` and have it defined in the next steps.

If you really need to pass variables populated by a run step in a following step you can just put a shell export command in a file and then "source" that file in the following step or use some shell specific options (like using `BASH_ENV` when using bash).

I.E. if you're using a shell like bash/zsh etc...

In step N:

```bash
echo "export MYVARIABLE=value" > /tmp/variables
```

In step N+i:

```bash
source /tmp/variables
```