# metamorph

> Experiment in letting GPT-4 editing a program by itself. What program? Well, the program that lets GPT-4 edit itself.

Many approaches were tried, but ultimately what you see implemented here is what "won" in terms of speed and correctness of generates changes. Some other approaches I tried:

- A Clojure program that is connected to a REPL. Benefit that changes can be small, but training set seems to not be very good with Clojure
- A Rust program where the idea was that the entire program (`src/main.rs`) gets replaced at once. GPT seemed to struggle with that as well, as the program was much bigger/longer and verbose compared to what I managed to write in JavaScript and Clojure 
- A JavaScript program in one file where the response from the "edit AI" replaces the entire file. This approach was very slow as GPT would have to type out whole file every time. Also it broke the file easily. But it seemed to do better with JavaScript than Rust and Clojure, which isn't that surprising.
- A program that generates git patch files. I think this was the "cleanest" approach but `git apply` is picky and GPT doesn't seem very good at generating actually correct patches. It does great with the diffs, but the rest was often wrong (hunk counting, context lines and so on).

And finally, the approach that won:

- Modularize the JavaScript program as much as possible, one function per file basically, and have the "edit AI" return a JSON array with objects with filename + new contents. This seems to work fine, albeit still a bit slow. Not as slow as generating a full file, but none-the-less. The dataset also seems to contain a bunch of JavaScript, as it doesn't generate invalid JavaScript that often (compared to Clojure/Rust/Me).

At the beginning I let it edit the `supervisor` process as well, a process that is responsible for restarting the self-editing process from the beginning after each change + persisting changes. It quickly led to GPT somehow ruining itself, so I had to make GPT avoid changing it.

## How it works

- Start the entire process by running `node src/supervisor.js`, this starts a program that will restart the actual editing process after each change
- `src/app.js` gets run by `src/supervisor.js`, while keeping track of the exit status. `src/app.js` does the following:
  - Create a new proposal for change based on existing code base
  - Take said proposal and return wanted changes, parsing them as JSON
  - Take each wanted change and overwrite files on disk
  - This is one "edit" iteration, with the "cost" of two OpenAI Chat API calls, one for the proposal and one for taking that proposal and turning it into changes
- Then there is bunch of logic in `supervisor.js` to rollback or unstage changes depending on how/when `app.js` fails.
- For example, if `app.js` takes less than 10 seconds to run, we assume that the previous edit somehow broke it, so we rollback one commit.

## Test runs of self-editing evolution

The program/GPT seems to be mostly interested in improving the program by trying to "benchmark", "analyze" and "optimize" the code further. Most probably it's because of the initial prompts I've written, or maybe because the JavaScript ecosystem just likes to care about those things rather than actually adding neat features. I don't know.

It seems to focus on the self-improvement itself, which I think makes sense given the initial prompts I setup. 

It bothers me a bit that it seems to be so focused on improving the style of the code rather than the actual implementation, but I guess there is not much you can ask from a language model that gets free reign at editing JavaScript programs. It learned from existing JavaScript projects, so it makes somewhat sense.

