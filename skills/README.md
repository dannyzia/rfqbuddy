# Engineering Skills System

## Purpose

This directory contains **generic engineering skills** that apply to any software project, regardless of technology stack or domain. These skills define mandatory procedures for safe, effective code modification.

## What Are Skills?

Skills are **procedural guardrails** that AI coding agents must follow when performing different types of work. They prevent common mistakes and ensure consistent, production-ready code quality.

## Universal Application

These skills work across:
- Any programming language (Python, TypeScript, Go, Rust, etc.)
- Any framework (React, Vue, Django, Rails, etc.)
- Any project size (startup MVP to enterprise system)
- Any AI model (Claude, GPT-4, Gemini, Minimax, Kimi, GLM, etc.)

## The Five Skills

### 1. **plan_before_code**
**When:** New features, major changes, multi-file modifications  
**Purpose:** Force structured thinking before execution  
**Prevents:** Scope creep, architectural violations, incomplete implementations

### 2. **root_cause_debugging**
**When:** Bug fixes, error investigation, regression analysis  
**Purpose:** Fix causes, not symptoms  
**Prevents:** Speculative fixes, introduced bugs, masked problems

### 3. **surgical_execution**
**When:** Implementing approved plans, targeted fixes, small enhancements  
**Purpose:** Minimal, precise changes only  
**Prevents:** Refactoring drift, unrelated changes, scope expansion

### 4. **architecture_respect**
**When:** Backend/shared module changes, adding new layers, cross-cutting concerns  
**Purpose:** Protect established architectural patterns  
**Prevents:** Layer violations, circular dependencies, pattern chaos

### 5. **high_risk_change_guard**
**When:** Auth, payments, security, data integrity, migrations  
**Purpose:** Maximum deliberation on critical code  
**Prevents:** Data corruption, security holes, catastrophic bugs

## How Skills Combine

Skills can work together. Common combinations:

```
Bug fix in auth system:
  → root_cause_debugging + surgical_execution + high_risk_change_guard

New feature across multiple files:
  → plan_before_code + architecture_respect

Database migration:
  → plan_before_code + high_risk_change_guard

Small enhancement to existing service:
  → surgical_execution + architecture_respect
```

## Skill Selection Rules

AI agents **must**:
1. Identify which skills apply before starting work
2. State the selected skills explicitly
3. Follow all constraints from selected skills
4. Stop and ask if skill requirements conflict

AI agents **must not**:
- Skip skill selection
- Invent new skills or workflows
- Proceed if no skill fits (ask instead)
- Violate skill constraints silently

## Integration with Project Rules

These skills work alongside project-specific rules:

```
Generic Skills (this folder)
     ↓
     Applied to
     ↓
Project-Specific Rules (e.g., rfq-buddy-rules.md)
     ↓
     Results in
     ↓
Safe, Consistent Code Changes
```

## For AI Coding Agents

When you start working on any codebase:

1. **Read** the project's main rules file (e.g., `rules.md`, `rfq-buddy-rules.md`)
2. **Understand** which skills apply to your current task
3. **State** your selected skills before proceeding
4. **Follow** all skill procedures and constraints
5. **Document** your adherence in commit messages or responses

## For Human Developers

When reviewing AI-generated code:

1. Check that appropriate skills were selected
2. Verify skill procedures were followed
3. Flag violations explicitly
4. Update project rules if patterns emerge

## Customization

While these skills are generic:
- Project-specific rules may add **constraints** (e.g., "no migrations without rollback")
- Project-specific rules may define **high-risk domains** (e.g., "bidding logic is high-risk")
- Project-specific rules may add **verification steps** (e.g., "run `npm test` after changes")

The core skill **procedures** remain universal.

## Enforcement

Skills can be enforced through:
- Pre-commit hooks (check for skill declaration in commits)
- PR templates (require skill selection in description)
- CI checks (validate diff size, affected files match stated skill)
- Code review checklists (reviewer confirms skill adherence)

## Version History

- **v1.0** (2026-02-16): Initial generic skills extraction from RFQ Buddy project
- Skills proven effective in production TypeScript/Node.js/SvelteKit project
- Applicable to any modern software engineering context

## Contributing

If you discover a new generic engineering pattern that should be a skill:
1. Verify it applies across multiple projects/languages
2. Write a clear skill definition following the existing format
3. Document when it should be used and what it prevents
4. Test it with multiple AI models for clarity

---

**Remember:** Skills are procedures, not suggestions. Following them is mandatory for safe code evolution.
