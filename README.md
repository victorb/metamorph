# metamorph
> An experiment in letting GPT-4 edit a program by itself. What program? The program that lets GPT-4 edit itself.

https://user-images.githubusercontent.com/459764/227037443-f42db412-b933-4430-929a-d63a26f7929b.mp4

## TL;DR

- The program uses OpenAI GPT to suggest and implement improvements
- After each edit, the program restarts and begins from the beginning
- `supervisor.js` runs the actual program and rollbacks changes that breaks the program. Most of the time at least.
- Is it useful? No. Was it fun to build? Mostly. What sucks? It takes long time for GPT-4 to reply.

## Approaches

I tried many approaches, but ultimately the one implemented here "won" in terms of speed and the correctness of the generated changes. Some other approaches I tried:

- A Clojure program connected to a REPL. This allowed for smaller changes, but the training set seemed to not work as well with Clojure
- A Rust program where the entire program (src/main.rs) was replaced at once. GPT struggled with this, as the program was much larger and more verbose compared to JavaScript and Clojure
- A JavaScript program in one file where the response from the "edit AI" replaced the entire file. This approach was very slow, as GPT had to type out the whole file every time. It also easily broke the file. However, GPT performed better with JavaScript than Rust and Clojure, which is not surprising.
- A program that generates git patch files. This was the "cleanest" approach, but git apply is picky, and GPT doesn't seem very good at generating actually correct patches. It does great with the diffs, but the rest was often wrong (hunk counting, context lines, etc.).

And finally, the approach that won:

-     Modularize the JavaScript program as much as possible, with one function per file, and have the "edit AI" return a JSON array with objects containing the filename and new contents. This works well, albeit a bit slow. Not as slow as generating a full file, but still somewhat slow. The dataset also seems to contain a bunch of JavaScript, as it doesn't generate invalid JavaScript that often (compared to Clojure, Rust, or what I "generate" with my liquid and meaty CPU).

Initially, I allowed the AI to edit the supervisor process as well, which is responsible for restarting the self-editing process from the beginning after each change and persisting those changes. However, this quickly led to GPT somehow ruining itself, so I had to make GPT avoid changing it. Did it listen? Most of the times, yeah but sometimes not...

## How it works

- Start the entire process by running `node src/supervisor.js`, this starts a program that will restart the actual editing process after each change
- `src/app.js` gets run by `src/supervisor.js`, while keeping track of the exit status. `src/app.js` does the following:
  - Create a new short and concise proposal for change based on existing code base
  - Expands on the proposal to concrete steps on how to implement.
  - Take said expanded steps and return wanted changes, parsing them as JSON
  - Take each wanted change and overwrite files on disk
  - This is one "edit" iteration, with the "cost" of two OpenAI Chat API calls, one for the proposal and one for taking that proposal and turning it into changes
- Then there is bunch of logic in `supervisor.js` to rollback or unstage changes depending on how/when `app.js` fails.
- For example, if `app.js` takes less than 10 seconds to run, we assume that the previous edit somehow broke it, so we rollback one commit.

## Test runs of self-editing evolution

The program/GPT seems to be mostly interested in improving the program by trying to "benchmark", "analyze" and "optimize" the code further. Most probably it's because of the initial prompts I've written, or maybe because the JavaScript ecosystem just likes to care about those things rather than actually adding neat features. I don't know.

It seems to focus on the self-improvement itself, which I think makes sense given the initial prompts I setup. 

It bothers me a bit that it seems to be so focused on improving the style of the code rather than the actual implementation, but I guess there is not much you can ask from a language model that gets free reign at editing JavaScript programs. It learned from existing JavaScript projects, so it makes somewhat sense.

# License

MIT 2023 - Victor Bjelkholm