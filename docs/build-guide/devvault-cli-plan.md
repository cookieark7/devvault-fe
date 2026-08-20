# DevVault CLI — Agent Build Plan
> Feed each prompt block sequentially to the agent. Each prompt is self-contained and builds on the previous output. Do not skip steps.

---

## Context (feed this with EVERY prompt)

```
Project: DevVault
Stack: Node.js (ESM), Commander.js, Chalk, Axios
Purpose: CLI that lets developers save code snippets, bookmarks, prompts, and shell commands into the DevVault dashboard from their terminal.
Base API URL: process.env.DEVVAULT_API_URL (e.g. https://api.devvault.io)
Auth: Bearer token stored in ~/.devvault/config.json after login
All files use ESM (import/export, "type": "module" in package.json)
Entry point: bin/dv.js (the user types `dv` in terminal)
```

---

## PROMPT 1 — Project scaffold + package.json

```
Create the full Node.js CLI project scaffold for DevVault CLI. 

Requirements:
- Project name: devvault-cli
- Entry point: bin/dv.js  (binary name: "dv")
- ESM modules (type: "module")
- Dependencies: commander@12, chalk@5, axios@1, conf@12, ora@8, fuse.js@7
- devDependencies: none needed
- Directory structure:
    bin/dv.js
    src/
      commands/
        save.js
        search.js
        history.js
        auth.js
      lib/
        api.js        ← all HTTP calls to DevVault API
        config.js     ← read/write ~/.devvault/config.json
        detector.js   ← classify what type a piece of content is
        tracker.js    ← zsh hook data: read/write ~/.devvault/zsh-history.json
      hooks/
        install.js    ← writes the zsh hook block into ~/.zshrc
    shell/
      devvault.zsh   ← the actual zsh hook script
    package.json

Output: every file created with correct content. package.json must have the bin field. bin/dv.js must have the #!/usr/bin/env node shebang and be chmod +x.
```

---

## PROMPT 2 — config.js + api.js (foundation layer)

```
Build src/lib/config.js and src/lib/api.js for DevVault CLI.

CONFIG.JS requirements:
- Use the `conf` npm package (Conf class) to store config at ~/.devvault/config.json
- Exported functions:
    getToken()              → returns stored bearer token or null
    setToken(token)         → saves token
    getApiUrl()             → returns DEVVAULT_API_URL env var or stored url or 'https://api.devvault.io'
    setApiUrl(url)          → saves custom api url
    getConfig()             → returns full config object
    clearConfig()           → wipes all stored config (logout)
    isAuthenticated()       → returns boolean (token exists)

API.JS requirements:
- Built on axios with a configured instance
- Base URL from config.getApiUrl()
- Auth header: Authorization: Bearer <token> injected automatically via interceptor
- On 401 response: print "Session expired. Run: dv auth login" and process.exit(1)
- On network error: print "Cannot reach DevVault API. Check your connection." and process.exit(1)
- Exported functions (all async, all throw on failure):
    api.saveItem(payload)           → POST /items
    api.searchItems(query, filters) → GET /items/search?q=...&type=...
    api.getHistory(limit)           → GET /items?limit=N&sort=createdAt
    api.deleteItem(id)              → DELETE /items/:id
    api.bulkSave(items[])           → POST /items/bulk
    api.getMe()                     → GET /auth/me

payload shape for saveItem/bulkSave:
{
  type: 'cmd' | 'snippet' | 'bookmark' | 'prompt',
  content: string,        // the actual text
  title: string,          // optional human label
  tags: string[],         // optional
  source: 'cli' | 'zsh-hook' | 'manual',
  metadata: {}            // optional extra data
}
```

---

## PROMPT 3 — detector.js (auto-classify content type)

```
Build src/lib/detector.js for DevVault CLI.

This module auto-detects what type a piece of text is so the user doesn't always have to specify --type manually.

Exported function: detectType(text) → returns 'cmd' | 'snippet' | 'bookmark' | 'prompt'

Detection logic (check in this order):

1. BOOKMARK — if text matches a URL pattern (starts with http/https, or is a bare domain with a TLD):
   - Regex: /^https?:\/\//i or /^[a-z0-9-]+\.[a-z]{2,}(\/|$)/i
   - Return 'bookmark'

2. CMD — if text looks like a shell command:
   - Starts with known shell prefixes: git, npm, npx, yarn, pnpm, docker, kubectl, brew, apt, pip, python, node, curl, wget, ssh, rsync, ls, cd, mkdir, rm, cp, mv, cat, grep, awk, sed, find, chmod, chown, sudo, systemctl, service, export, echo, source, kill, ps, top, which, whereis, alias
   - OR starts with ./ or ~/
   - OR contains a pipe character | or redirection > or >>
   - OR matches: /^[a-z][a-z0-9_-]+ / (lowercase word followed by space = likely a CLI tool)
   - Return 'cmd'

3. PROMPT — if text looks like an AI prompt:
   - Length > 50 characters AND
   - Starts with common prompt words: "write", "create", "generate", "explain", "summarize", "list", "give me", "help me", "act as", "you are", "translate", "convert", "build", "design", "what is", "how do", "why does"
   - OR contains "the following" or "given that" or "as a" or "your task"
   - Return 'prompt'

4. SNIPPET — everything else that is multi-line OR contains code indicators:
   - Contains newlines, OR
   - Contains { } [ ] ( ) characters, OR  
   - Contains =>, function, const, let, var, import, export, class, def, if (, for (, while (
   - Return 'snippet'

5. DEFAULT — return 'snippet'

Also export: TYPE_LABELS = { cmd: '⌘ Command', snippet: '{ } Snippet', bookmark: '🔖 Bookmark', prompt: '✦ Prompt' }
Also export: TYPE_COLORS = { cmd: 'cyan', snippet: 'magenta', bookmark: 'blue', prompt: 'yellow' }

Write unit-style test cases as comments at the bottom of the file showing what each input returns.
```

---

## PROMPT 4 — tracker.js (ZSH hook data layer)

```
Build src/lib/tracker.js for DevVault CLI.

This module manages the local ZSH command tracking file at ~/.devvault/zsh-history.json.

The ZSH hook writes raw command data here. This module reads it, analyses it, and identifies commands worth saving to DevVault.

DATA SHAPE — each entry in zsh-history.json:
{
  id: string,           // 6-char hex id
  cmd: string,          // the command text
  cwd: string,          // directory it ran in
  exitCode: number,     // 0 = success
  duration: number,     // milliseconds
  timestamp: string,    // ISO 8601
  savedToVault: boolean // false until user saves it
}

EXPORTED FUNCTIONS:

appendCommand(entry)
  - Appends one command to ~/.devvault/zsh-history.json
  - Creates file if it doesn't exist
  - Keeps max 2000 entries (trim oldest)
  - Ignores commands that are: empty, less than 3 chars, in the ignore list
  - IGNORE LIST: cd, ls, ll, la, pwd, clear, exit, history, dv (the CLI itself), and any command starting with "dv "

getHistory(limit = 50)
  - Returns last N entries, newest first
  - Filters out savedToVault = true entries unless --all flag

getFrequent(minCount = 3, days = 30)
  - Returns commands run at least minCount times in the last N days
  - Groups by cmd text (exact match)
  - Returns array of: { cmd, count, lastUsed, exitCodes[], avgDuration }
  - Sorted by count descending

getRepeated(windowMinutes = 60, minCount = 2)  
  - Returns commands run minCount+ times within windowMinutes of each other
  - These are "I'm doing this a lot right now" signals
  - Useful for prompting the user: "You've run this 5 times today, want to save it?"

markSaved(id)
  - Sets savedToVault = true for a given entry id
  - Bulk version: markSavedBulk(ids[])

clearHistory()
  - Wipes the local zsh-history.json

getStats()
  - Returns: { total, saved, unsaved, topCommands: [{cmd, count}], mostActiveHour }
```

---

## PROMPT 5 — shell/devvault.zsh (the ZSH hook)

```
Build shell/devvault.zsh — the ZSH hook script for DevVault CLI.

This script is sourced in ~/.zshrc. It silently captures terminal commands and logs them via the CLI.

Requirements:

1. GUARD against double-loading:
   [[ -n "$DEVVAULT_HOOK_LOADED" ]] && return
   export DEVVAULT_HOOK_LOADED=1

2. IGNORE LIST — never track these:
   - Commands starting with: dv, cd, ls, ll, la, clear, pwd, exit, history, man
   - Empty commands
   - Commands less than 3 characters

3. _devvault_preexec function:
   - Receives $1 = the command string
   - Checks against ignore list — if ignored, set _dv_cmd="" and return
   - Sets _dv_cmd="$1"
   - Sets _dv_start=$(( EPOCHREALTIME * 1000 )) (milliseconds)
   - Sets _dv_cwd="$PWD"

4. _devvault_precmd function:
   - First line: local exit_code=$? (capture immediately before anything else)
   - If _dv_cmd is empty, return early
   - Calculate duration: $(( EPOCHREALTIME * 1000 - _dv_start ))
   - Call: dv _hook "$_dv_cmd" --exit-code "$exit_code" --duration "$duration" --cwd "$_dv_cwd" &>/dev/null &
   - The & at the end runs it in background — MUST not block the prompt
   - Reset _dv_cmd="" after

5. Register hooks safely using add-zsh-hook:
   autoload -Uz add-zsh-hook
   add-zsh-hook preexec _devvault_preexec
   add-zsh-hook precmd _devvault_precmd

6. SMART PROMPT FEATURE:
   - In _devvault_precmd, after logging the command, check if it's been run 5+ times today
   - If yes, print a subtle notice: "\n\033[2m[DevVault] 'git pull' × 5 today — run \`dv save --from-history\` to vault it\033[0m"
   - This check should be async too (non-blocking)
   - Use a separate function _devvault_check_repeat for this

7. At the bottom, add a function: devvault_hook_status
   - Prints whether the hook is loaded and active
   - User can call it to verify the hook is working

Include full comments explaining what each section does.
Include installation instructions as comments at the top.
```

---

## PROMPT 6 — src/hooks/install.js (hook installer)

```
Build src/hooks/install.js for DevVault CLI.

This module handles installing and uninstalling the ZSH hook into the user's ~/.zshrc.

EXPORTED FUNCTIONS:

installHook(options = {})
  - options.zshrcPath defaults to ~/.zshrc
  - options.hookScriptPath = path to shell/devvault.zsh (relative to the npm package)
  - Reads current ~/.zshrc content
  - Checks if hook is already installed (look for the marker: # devvault-hook-start)
  - If already installed: print "Hook already installed." and return
  - Appends this block to ~/.zshrc:
      
      # devvault-hook-start (do not remove this line)
      source "/absolute/path/to/shell/devvault.zsh"
      # devvault-hook-end (do not remove this line)
      
  - Print success message with instructions to run: source ~/.zshrc

isHookInstalled(zshrcPath)
  - Returns boolean — checks if the marker exists in ~/.zshrc

uninstallHook(options = {})
  - Removes the entire block between # devvault-hook-start and # devvault-hook-end
  - Print confirmation

getHookScriptPath()
  - Returns the absolute path to shell/devvault.zsh
  - Uses import.meta.url to find the package root (ESM-compatible, no __dirname)
  - Works correctly whether installed globally (npm install -g) or locally
```

---

## PROMPT 7 — src/commands/auth.js

```
Build src/commands/auth.js for DevVault CLI.

Register these subcommands on a Commander program object exported from this file.

COMMANDS:

dv auth login
  - Prompts for API URL (default: https://api.devvault.io) using readline
  - Prompts for email
  - Prompts for password (input hidden — use readline with input muted via process.stdin raw mode)
  - Calls POST /auth/login with { email, password }
  - On success: saves token and api url via config.js, prints "✔ Logged in as <email>"
  - On failure: prints error message, exit code 1
  - Show a spinner (ora) while the request is in flight

dv auth logout
  - Calls config.clearConfig()
  - Prints "✔ Logged out"

dv auth status
  - If not authenticated: "Not logged in. Run: dv auth login"
  - If authenticated: calls api.getMe(), prints:
      Logged in as: <name> (<email>)
      API:          <url>
      Token:        <first 8 chars>...

dv auth token <token>
  - Manually set a token (for API key auth, CI environments)
  - Saves token, prints confirmation

All commands: check isAuthenticated() where required and print a helpful message if not.
Use chalk for colored output throughout.
Export a function: registerAuthCommands(program) that attaches all commands to the Commander program.
```

---

## PROMPT 8 — src/commands/save.js (the core save command)

```
Build src/commands/save.js for DevVault CLI. This is the most important command.

COMMANDS:

dv save [content]
  - content can be passed inline: dv save "git push origin main"
  - or piped: echo "git push" | dv save
  - or if neither, open a multi-line editor (use readline, close on Ctrl+D or blank line)
  - Auto-detect type using detector.detectType(content)
  - Show detected type to user: "Detected: ⌘ Command — is this correct? [Y/n]"
  - Options:
      --type <type>     force type (cmd|snippet|bookmark|prompt)
      --title <title>   set title (if omitted, auto-generate from first 50 chars)
      --tag <tag>       add a tag (can be used multiple times: --tag node --tag docker)
      --yes, -y         skip all confirmation prompts
      --silent          no output (good for scripting)
  - Show spinner while saving
  - On success: print "✔ Saved as <type>: <title>" with the vault item ID
  - On failure: print error

dv save --from-history [n]
  - Show the last N unsaved ZSH history commands (default 20) in an interactive numbered list
  - Format each line: [index] exit_code  duration  command
  - Prompt: "Enter numbers to save (comma-separated, or 'all'): "
  - For each selected command: save to vault with type auto-detected
  - Show progress: saving 3/5...
  - Summary at end: "✔ Saved 3 commands to DevVault"

dv save --frequent
  - Calls tracker.getFrequent()
  - Shows commands run 3+ times in last 30 days that haven't been saved yet
  - Interactive selection (same numbered list pattern as --from-history)
  - Batch saves selected items

dv save --repeated
  - Calls tracker.getRepeated()  
  - Shows "commands you're running repeatedly right now"
  - Same selection + batch save pattern

dv save --clip
  - Reads from clipboard: execSync('pbpaste') on mac, xclip/xsel on linux
  - Detects type, confirms, saves
  - Works cross-platform (detect OS via process.platform)

Export: registerSaveCommands(program)
```

---

## PROMPT 9 — src/commands/search.js + history.js

```
Build src/commands/search.js and src/commands/history.js for DevVault CLI.

SEARCH COMMAND — dv search <query>
  - Calls api.searchItems(query, filters)
  - Options:
      --type <type>     filter by type
      --tag <tag>       filter by tag
      --limit <n>       max results (default 20)
      --copy <id>       after showing results, copy item N to clipboard
  - Output format (table-like, using chalk for colors):
      TYPE        TITLE                           TAGS          DATE
      ⌘ cmd       git push origin main            git,deploy    2d ago
      { } snippet  React useEffect cleanup pattern  react        5d ago
  - If no results: "No results for '<query>'"
  - After showing results, prompt: "Enter # to copy to clipboard, or press Enter to exit"
  - Copying: use pbcopy on mac, xclip on linux

dv search --local <query>
  - Fuzzy searches the local zsh-history.json using fuse.js
  - No API call needed — purely local
  - Useful when offline

HISTORY COMMAND — dv history
  - Shows recent items saved to DevVault (calls api.getHistory)
  - Options:
      --limit <n>       how many to show (default 20)
      --type <type>     filter by type
      --unsaved         show local ZSH history that hasn't been saved yet
  - Same table format as search output
  - After display, prompt for copy action same as search

dv history --stats
  - Show local tracking stats from tracker.getStats()
  - Format:
      Local ZSH tracking stats
      ─────────────────────────
      Total tracked:    1,204 commands
      Saved to vault:   47
      Unsaved:          1,157
      Most used:        git status (142×), npm run dev (89×), docker ps (67×)
      Most active hour: 10:00 – 11:00

Export: registerSearchCommands(program), registerHistoryCommands(program)
```

---

## PROMPT 10 — src/commands internal hook command

```
Build the internal dv _hook command in src/commands/hook.js.

This command is called exclusively by the ZSH hook script (shell/devvault.zsh).
It should never appear in dv --help output (mark it as hidden in Commander).

COMMAND: dv _hook <cmd...>
  Options:
    --exit-code <n>   (required) exit code of the command
    --duration <ms>   (required) duration in milliseconds
    --cwd <path>      (required) working directory

Behavior:
  1. Join the <cmd...> variadic args back into a string
  2. Call tracker.appendCommand({ cmd, exitCode, duration, cwd, timestamp: new Date().toISOString() })
  3. Check if this command was just run 5+ times today (call tracker.getRepeated)
  4. If it was, and if the user has not been notified about this command recently:
     - Write a notice file to ~/.devvault/notices/<escaped-cmd>.notice with current timestamp
     - Print (to stderr, not stdout) the nudge message:
       \n\x1b[2m[DevVault] '<cmd>' × N today — `dv save --repeated` to vault it\x1b[0m
  5. Check if the notice was already shown in the last 4 hours — if yes, skip the nudge (don't spam)
  6. Exit 0 always — this command must NEVER crash or print errors (it runs in background)

The entire command must be wrapped in a top-level try/catch that swallows all errors.
Silence is the contract — the ZSH hook background process must not pollute the terminal.

Export: registerHookCommand(program)
```

---

## PROMPT 11 — bin/dv.js (the entry point, wires everything together)

```
Build bin/dv.js — the CLI entry point for DevVault.

Requirements:
  - Shebang: #!/usr/bin/env node
  - Import and register all command modules:
      registerAuthCommands
      registerSaveCommands
      registerSearchCommands
      registerHistoryCommands
      registerHookCommand
  - Top-level program setup:
      name: 'dv'
      description: 'DevVault — your developer knowledge vault'
      version: read from package.json dynamically (use createRequire for ESM)
  - Global options:
      --json      output raw JSON (for scripting)
      --silent    suppress all non-error output
  - Add a custom help footer:
      "Docs: https://devvault.io/cli"
      "To enable shell tracking: dv hook install"
  - Add these top-level commands directly in bin/dv.js:
  
    dv hook install
      - Calls installHook() from src/hooks/install.js
      - Prints instructions

    dv hook uninstall  
      - Calls uninstallHook()

    dv hook status
      - Calls isHookInstalled(), prints status
      - Also prints: local history count, last tracked command

    dv open
      - Opens https://app.devvault.io in the browser
      - Use: import { exec } from 'child_process', then:
        open on mac (process.platform === 'darwin')
        xdg-open on linux
        start on win32
      
  - If no command given, show help
  - process.argv parsing at the bottom: program.parse(process.argv)
```

---

## PROMPT 12 — README.md + install instructions

```
Write README.md for the DevVault CLI npm package.

Include:

1. One-line description
2. Installation:
   npm install -g devvault-cli
   
3. Quick start (5 lines max):
   dv auth login
   dv save "git push origin main"
   dv save --from-history
   dv search "docker"
   dv hook install   # enables auto-tracking

4. Full command reference — one section per command group (auth, save, search, history, hook)
   Use tables: Command | Description | Example

5. ZSH hook section:
   - What it does
   - How to install
   - How to verify it's working (devvault_hook_status)
   - How to uninstall
   - Note about performance (runs in background, never blocks prompt)

6. Saving commands — all 5 ways:
   | Method | Command | When to use |
   |--------|---------|-------------|
   | Inline | dv save "git push" | One command, right now |
   | Pipe | history \| tail -1 \| dv save | From another command's output |
   | From history | dv save --from-history | Browse and pick from recent history |
   | Frequent | dv save --frequent | Commands you run often (3+ times in 30d) |
   | Auto-nudge | ZSH hook + dv save --repeated | Automatic prompts when you repeat commands |
   | Clipboard | dv save --clip | Save whatever's in your clipboard |

7. Environment variables:
   DEVVAULT_API_URL   Override API endpoint
   DEVVAULT_TOKEN     Token for CI/headless environments (skip login)

8. How it works (architecture diagram in ASCII):
   Your terminal → ZSH hook → ~/.devvault/zsh-history.json
                                        ↓
   dv save --frequent / --from-history / --repeated
                                        ↓
                           DevVault API → Dashboard

Write clean, developer-focused markdown. No fluff.
```

---

## PROMPT 13 — Final wiring + error handling pass

```
Do a final pass over the entire DevVault CLI codebase and:

1. GLOBAL ERROR HANDLING in bin/dv.js:
   - Add process.on('uncaughtException') that prints a clean error (not a stack trace) and exits 1
   - Add process.on('unhandledRejection') same
   - Only show stack traces if DEVVAULT_DEBUG=1 env var is set

2. AUTH GUARD utility in src/lib/config.js:
   - Export: requireAuth() — if not authenticated, print "Not logged in. Run: dv auth login" and exit 1
   - Apply requireAuth() at the start of: save, search, history commands (NOT auth and NOT _hook)

3. TOKEN FROM ENVIRONMENT in api.js:
   - Before reading from config, check process.env.DEVVAULT_TOKEN
   - This allows CI pipelines to use the CLI without running dv auth login

4. STDIN PIPE DETECTION in save.js:
   - process.stdin.isTTY is false when data is being piped in
   - If !process.stdin.isTTY, read from stdin automatically without prompting
   - Example: echo "npm install" | dv save  should work with zero interaction

5. --json FLAG in search.js and history.js:
   - If program.opts().json is true, output raw JSON instead of the pretty table
   - Makes the CLI composable with jq and other tools

6. CROSS-PLATFORM clipboard in save.js (--clip) and search.js (copy action):
   - darwin: pbpaste / pbcopy
   - linux: xsel --clipboard --output / xsel --clipboard --input (fallback: xclip)
   - win32: powershell Get-Clipboard / Set-Clipboard
   - Wrap in try/catch — if clipboard tool not found, print helpful install instructions

7. Verify all files have correct ESM imports (no require(), no __dirname without fileURLToPath fix)

8. Add a --version flag that reads version from package.json using createRequire.

Produce the corrected versions of any files that needed changes.
```

---

## Build Order Summary

| Step | Prompt | Output files | Depends on |
|------|--------|-------------|------------|
| 1 | Scaffold | All directories + package.json | — |
| 2 | Foundation | src/lib/config.js, src/lib/api.js | 1 |
| 3 | Detector | src/lib/detector.js | 1 |
| 4 | Tracker | src/lib/tracker.js | 1 |
| 5 | ZSH hook | shell/devvault.zsh | — |
| 6 | Hook installer | src/hooks/install.js | 5 |
| 7 | Auth command | src/commands/auth.js | 2 |
| 8 | Save command | src/commands/save.js | 2, 3, 4 |
| 9 | Search + history | src/commands/search.js, history.js | 2, 4 |
| 10 | Hook command | src/commands/hook.js | 4 |
| 11 | Entry point | bin/dv.js | 7–10 |
| 12 | README | README.md | all |
| 13 | Final pass | corrections to any file | all |

---

## Notes for the agent

- Never use `require()` — this is a pure ESM project (`"type": "module"` in package.json)
- Never use `__dirname` or `__filename` directly — use `fileURLToPath(import.meta.url)` + `dirname()`
- All user-facing strings use `chalk` for color — errors in red, success in green, info in cyan/gray
- The `_hook` command (Prompt 10) is the highest-stakes piece — it must NEVER crash or print to stdout
- The ZSH hook (Prompt 5) must use `add-zsh-hook` not raw function definitions — this is what makes it safe to install alongside Starship, Oh My Zsh, etc.
- When piping data in, always check `process.stdin.isTTY` before reading interactively
- All API calls should be wrapped with an `ora` spinner that's stopped before printing output
