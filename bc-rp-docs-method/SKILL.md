---
name: bc-rp-docs-method
description: Documentation methodology for Black Clover RP Sandbox server based on Visual Paradigm (Requirements, Analysis, Design). Use this to structure every domain and ensure consistent SDLC standards.
---

# Black Clover RP Documentation Methodology

This skill ensures that every technical domain in the Black Clover RP project follows a rigorous architectural process inspired by Visual Paradigm.

## Core Structure

Every domain must be divided into three distinct phases:

### 1. Requirements (01_Requirements)
**Goal**: Define *what* the system must do from a user perspective.
- **User Stories**: `As a [role], I want to [action] so that [benefit].`
- **Use Cases**: Detailed step-by-step interactions between Actors and the System.
- **Functional Requirements**: Numbered list of mandatory features (e.g., REQ-001).

### 2. Analysis (02_Analysis)
**Goal**: Define *how* the system behaves internally.
- **Mermaid.js Mandatory**: Every diagram (Sequence, State, Activity, Class) must be created in a separate `.mmd` file within the `02_Analysis` folder.
- **Diagram Types**:
    - **Sequence Diagrams**: Flow of messages between objects/actors.
    - **State Diagrams**: For complex objects like Grimoires or Mana pools.
    - **Flowcharts**: Logic flows for spells or progression paths.
    - **Class Diagrams**: For data and system structures.
- **File Naming**: `[DiagramType]_[SystemName].mmd` (e.g., `Class_DatabaseSchema.mmd`).

### 3. Design (03_Design)
**Goal**: Technical blueprint for implementation in Sandbox (TypeScript/LUA/Data structures).
- **Data Schemas**: Structure of saved data (Player stats, Spell definitions).
- **API/Function Signatures**: Input/Output types for core systems.
- **Component Architecture**: How different Sandbox entities interact.

## Guidelines for the Tech Lead

- **Traceability**: Every Design element must map back to an Analysis flow, which must map back to a Requirement.
- **Brevity**: Use tables and Markdown lists instead of long paragraphs.
- **Sandbox Context**: Always keep Sandbox engine limitations and features in mind during the Design phase.

## Workflow
1. Initialize the domain folder structure.
2. Draft Requirements and get user validation.
3. Perform Analysis to detect logic gaps.
4. Finalize Technical Design for implementation.
