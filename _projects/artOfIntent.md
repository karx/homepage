---
title: Art of Intent
categories: [Project]
status: Active
type: Game
layout: projecto
excerpt: A daily word puzzle where you win by crafting the perfect AI prompt — not by guessing the word.
visit_link: https://art-of-intent.netlify.app
contribute_link: https://github.com/karx/art-of-intent
header:
  overlay_color: black
tags: [JavaScript, Firebase, Gemini, AI, Game]
---

A daily word puzzle for prompt engineers and puzzle enthusiasts. The twist: you don't type the word — you describe it to an AI and see if your intent lands.

## The problem

Most AI demos show you the output. Art of Intent makes the *craft* of prompting the game itself. Can you get the AI to produce a target word using fewer tokens than everyone else? Can you do it without using the forbidden words?

## What I built

A single-page web app — deliberately vanilla JS, no framework. You're given a target word and a blacklist. Write a prompt. The AI (Gemini) tries to produce the word. Your score is a function of token efficiency and attempt count.

Daily words are server-generated and stored in Firestore — tamper-proof, same puzzle for everyone each day. A leaderboard surfaces the most efficient solvers.

The backend is a Firebase Cloud Function that wraps the Gemini API. The function owns the prompt construction and scoring — the client never sees the target word directly.

Currently migrating to a BYOM (Bring Your Own Model) architecture: users can route prompts through their own OpenAI, Anthropic, or Gemini key via a provider-agnostic gateway function.

## What was hard

Scoring fairly. Token count alone doesn't capture quality — a one-token lucky guess and a precisely crafted five-token prompt feel different. The scoring formula weights efficiency against attempt count and has gone through several iterations based on playtesting.

The daily word generation also needs curation: some words are too easy (single-word synonyms), some are impossible (highly technical, no common paraphrases). Building a vibe-check pipeline for word quality was more work than the game logic.

## Status

Live at [art-of-intent.netlify.app →](https://art-of-intent.netlify.app)
