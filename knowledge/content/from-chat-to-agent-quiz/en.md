---
type: quiz
code: 3574
title: "Quiz: From chat to agent"
summary: >-
  Twelve questions on the first steps with OpenCode, each answer with its
  reason. The questions come from the pool of the module and are in the format
  of its exam.
level: 1
duration: 24
topics: [ai-agents]
relations:
  checks: [from-chat-to-agent]
modules: [aai]
areas: [ai]
questions: [fca-001, fca-002, fca-003, fca-004, fca-005, fca-006, fca-007, fca-008, fca-009, fca-010, fca-011, fca-012]
status: published
updated: 2026-11-25
---

## What turns a language model in OpenCode into an agent? {#fca-001}

- [ ] A larger model that solves even hard tasks without help.
  > Even a small model such as gemma-4-e2b works as an agent in OpenCode. Its size decides how well it does, not whether it is an agent.
- [x] The model may call tools and sees their results before it answers, as often as needed.
  > Correct: the loop of tool call and result is the difference. The model writes down which tool it wants to call and decides after every result whether it is done.
- [ ] A memory that keeps every earlier session in the folder.
  > A new session starts empty. What the agent knows about the folder is in AGENTS.md, not in a memory of earlier sessions.
- [ ] Fixed rules by which OpenCode answers without asking the model.
  > OpenCode never answers by itself. Every answer comes from the language model; OpenCode sends the request and carries out the tool calls.

## ChatGPT can search the web and run Python. What can the agent in OpenCode do that ChatGPT in the browser cannot? {#fca-002}

- [ ] Search the web for current information and name its source.
  > Both can do that. The difference is not the web but where the agent works.
- [ ] Write its answers in several languages, such as German and English.
  > That comes from the language model, not from the agent. A chat can do it just as well.
- [x] Work with the files on your laptop and run your own programs, such as typst.
  > Correct: ChatGPT works in its own environment in the cloud. The agent works where your files and programs are, with nothing to upload or download.
- [ ] Keep working without a language model when there is no connection.
  > Nothing works without a language model. Without the internet, only a model on your own laptop helps, such as gemma-4-e2b in LM Studio.

## The model decides to create the file offers.md with the tool write. Who actually creates the file? {#fca-003}

- [x] OpenCode, which reads the tool call the model wrote and carries it out.
  > Correct: a language model only produces text. It writes down which tool it wants to call with which inputs; OpenCode carries out the call and reports the result back.
- [ ] The language model itself, because it has access to the laptop's disk.
  > The model has access to nothing. With gpt-6-luna it even runs on a computer at OpenAI, far away from your disk.
- [ ] The provider of the model, OpenAI or LM Studio, which computes the answer.
  > The provider only computes the text of the answer. It does not run tools; it only knows their descriptions from the request.
- [ ] Nobody, until you copy the model's suggestion and save it yourself.
  > That is how a chat works. In the agent Build, write is allowed, and the file is in the folder afterwards without anything from you.

## You put a file AGENTS.md with a description of the farm shop into the folder lindenhof. What does it do? {#fca-004}

- [ ] The agent reads it as soon as you mention it in a message.
  > That would not need the file. OpenCode reads it by itself, without you mentioning it.
- [ ] It becomes a new tool that the model calls when needed.
  > Tools come from OpenCode or from tool servers. AGENTS.md is text, not a tool.
- [ ] It is a note for people that the model never gets to see.
  > On the contrary: in a new session the agent answers as the farm shop's helper although you said nothing about the shop. It knows that from AGENTS.md.
- [x] OpenCode puts its content in front of everything you write, in every session of this folder.
  > Correct: the file is part of the system prompt that OpenCode sends with every request. That way the agent knows in every session what the folder is for.

## You load gemma-4-e2b in LM Studio with a context window of 8,192 tokens and send only "hi" in OpenCode. Instead of an answer you get the error: request (10581 tokens) exceeds the available context size (8192 tokens). Why is the request so large? {#fca-005}

- [ ] A token is one character, and OpenCode pads short messages.
  > A token is a piece of a word of about four characters, and nothing is padded. The "hi" itself is a single token.
- [x] Every request carries OpenCode's system prompt with the AGENTS.md and the descriptions of all tools.
  > Correct: in our test that was about 25,000 characters of system prompt and 18,000 characters for 14 tools, together more than ten thousand tokens before the "hi".
- [ ] LM Studio adds every earlier session of the folder.
  > LM Studio only gets what OpenCode sends, and a new session starts empty. Earlier sessions are not part of it.
- [ ] The model file of 4.4 GB is counted with every request.
  > The model file is the model itself, not text in its context. The context window only counts the text of the request and the answer.

## With a context of 8,192 tokens, gemma-4-e2b in OpenCode answers even "hi" only with an error, because the request has 10,581 tokens. What helps? {#fca-006}

- [ ] Type /compact so that OpenCode summarizes the session.
  > There is nothing to summarize: the system prompt and the tools alone do not fit, and /compact does not summarize them.
- [ ] Send a shorter message, such as just "h".
  > The "hi" is a single token out of more than ten thousand. A shorter message changes almost nothing about the size of the request.
- [ ] Delete AGENTS.md so that the system prompt gets shorter.
  > The farm shop's AGENTS.md has only a few hundred characters. What is missing is almost 2,400 tokens, about 10,000 characters.
- [x] Load the model again in LM Studio with a larger context length, such as 32,768.
  > Correct: then the request fits, and there is room for the conversation and the files the agent reads. In return the model needs more memory.

## gemma-4-e2b is asked to write a flyer as a Typst file and compile it. typst compile reports error: expected expression in the first line, and the model rewrites the file again and again without success. What is the most likely reason? {#fca-007}

- [ ] Typst is not installed on the laptop, so every attempt to compile fails.
  > The error message comes from Typst itself, so the program runs. Without Typst the message would say that the command is unknown.
- [x] It writes Markdown, in which # marks a heading, while in Typst # starts a command.
  > Correct: the model has seen Markdown countless times and Typst rarely. Typst expects = for headings, and the small model does not see that from the error message. In the end, gemma-4-e2b blamed the compiler.
- [ ] The agent lacks the tool shell, so it cannot run typst compile at all.
  > Then there would be no message from Typst at all. The model called typst compile and got the error message.
- [ ] The context window of the small model is too small for a whole flyer file.
  > A flyer has a few hundred characters. If the context were too small, the error would come from LM Studio, not from Typst.

## After gemma-4-e2b has failed at the Typst flyer, you switch to gpt-6-luna in the same session and only write "Fix the error." Why is that enough? {#fca-008}

- [ ] gpt-6-luna knows the file flyer.typ from its training.
  > The file was only just created in your folder. No model can know it from its training.
- [ ] OpenCode explains the error to the new model in a message of its own.
  > OpenCode writes no explanations. It only marks the switch of the model and sends the session on as before.
- [x] The whole session goes along with every request, including the small model's attempts and Typst's error messages.
  > Correct: the model remembers nothing, but OpenCode sends everything along. So gpt-6-luna sees what went wrong, reads the file, edits it and compiles it, in our test in about 15 seconds.
- [ ] Switching the model starts a new session in which gpt-6-luna reads every file again.
  > The switch stays in the same session, and that is the point: in a new session gpt-6-luna would not know which error is meant.

## What does the command /compact do in a long session? {#fca-009}

- [ ] It deletes the oldest messages until the session fits into the context window again.
  > Nothing is dropped without replacement. A summary takes the place of the history.
- [x] The model summarizes the session, and the work goes on with that summary.
  > Correct: that makes room, but details that are not in the summary are gone. Every request gets shorter and cheaper afterwards. Shortly before the limit of the context window, OpenCode does it by itself.
- [ ] It packs the history without loss like a ZIP file, so that nothing is lost.
  > The model reads text, not packed data. The summary is shorter because it leaves out details.
- [ ] It switches to a smaller model that needs fewer tokens for the same session.
  > The model stays the same. A smaller model would not need fewer tokens for the same text either.

## You asked the agent to delete offers.md, and it did. Then you type /undo. What happens? {#fca-010}

- [ ] Your message disappears from the session, but the file stays deleted.
  > /undo also takes back the changes to the folder that the agent made for this message.
- [ ] The model writes offers.md again from what it remembers of the file.
  > The model has no part in it. The file comes back from a snapshot, character for character as before.
- [ ] OpenCode fetches the file from the recycle bin of Windows or macOS.
  > A command of the agent usually deletes past the recycle bin. OpenCode therefore relies on its own snapshot.
- [x] Your message disappears, and offers.md is back from a snapshot of the folder.
  > Correct: OpenCode keeps a snapshot of the folder before every change, and /undo takes back the message and the changes together. That makes it easier to let an agent try things.

## You want to try the same request for the flyer again with another model without losing the session so far. Which command fits? {#fca-011}

- [x] /fork, which starts a new session from an earlier message.
  > Correct: the new session has the history up to that message, and the old one stays as it is. Then you choose the other model there.
- [ ] /undo, which takes back the last message.
  > That would lose the attempt so far, together with the files the agent changed for it.
- [ ] /new, which starts a new session.
  > The new session starts empty. You would have to repeat everything up to the request for the flyer.
- [ ] /export, which saves the session as a file.
  > /export saves the session for reading later, but it starts nothing new.

## You work in the folder lindenhof once with gpt-6-luna and once with gemma-4-e2b in LM Studio. What leaves your laptop? {#fca-012}

- [ ] With gpt-6-luna only the messages you type, never the content of files.
  > What the agent reads with read is a result in the session and goes to OpenAI with every further request.
- [ ] With gemma-4-e2b the requests go to Google, because the model comes from Google.
  > Google built the model, but it runs in LM Studio on your laptop. The requests go to 127.0.0.1, which is your own computer.
- [x] With gpt-6-luna every request with the system prompt, the messages and everything the agent has read; with gemma-4-e2b nothing.
  > Correct: the larger model computes at OpenAI, so the whole request has to go there. The small one computes on your laptop, which makes it slower and more error-prone.
- [ ] Nothing in either case, because OpenCode runs on the laptop.
  > OpenCode does run locally, but it sends the requests to the model's provider, and gpt-6-luna runs at OpenAI.
