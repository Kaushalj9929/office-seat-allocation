# Documentation Reorganization Guide

## New Folder Structure

```
docs/
├── README.md                           # Main docs index
├── product/
│   ├── README.md
│   └── OFFICE_SEAT_ALLOCATION_PRD.md
├── architecture/
│   ├── README.md
│   ├── ARCHITECTURE_DECISION_RECORDS.md
│   ├── TECHNICAL_IMPLEMENTATION_DOCUMENT.md
│   └── TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md
├── implementation/
│   ├── README.md
│   ├── phase-1/
│   │   ├── README.md
│   │   ├── PHASE_1_IMPLEMENTATION_PLAN.md
│   │   ├── BACKEND_PHASE_1_DETAILED_PLAN.md
│   │   └── FRONTEND_PHASE_1_DETAILED_PLAN.md
│   └── phase-2/
│       ├── README.md
│       ├── PHASE_2_IMPLEMENTATION_PLAN.md
│       ├── BACKEND_PHASE_2_DETAILED_PLAN.md
│       └── FRONTEND_PHASE_2_DETAILED_PLAN.md
├── development/
│   ├── README.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   ├── TESTING_STRATEGY.md
│   └── API_DOCUMENTATION.md
└── operations/
    ├── README.md
    └── DEPLOYMENT_GUIDE.md
```

## File Movement Instructions

### Step 1: Create Folder Structure
```bash
mkdir -p docs/product
mkdir -p docs/architecture
mkdir -p docs/implementation/phase-1
mkdir -p docs/implementation/phase-2
mkdir -p docs/development
mkdir -p docs/operations
```

### Step 2: Move Files to Appropriate Folders

**Product Folder:**
```bash
mv docs/OFFICE_SEAT_ALLOCATION_PRD.md docs/product/
```

**Architecture Folder:**
```bash
mv docs/ARCHITECTURE_DECISION_RECORDS.md docs/architecture/
mv docs/TECHNICAL_IMPLEMENTATION_DOCUMENT.md docs/architecture/
mv docs/TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md docs/architecture/
```

**Implementation Phase 1 Folder:**
```bash
mv docs/PHASE_1_IMPLEMENTATION_PLAN.md docs/implementation/phase-1/
mv docs/BACKEND_PHASE_1_DETAILED_PLAN.md docs/implementation/phase-1/
mv docs/FRONTEND_PHASE_1_DETAILED_PLAN.md docs/implementation/phase-1/
```

**Implementation Phase 2 Folder:**
```bash
mv docs/PHASE_2_IMPLEMENTATION_PLAN.md docs/implementation/phase-2/
mv docs/BACKEND_PHASE_2_DETAILED_PLAN.md docs/implementation/phase-2/
mv docs/FRONTEND_PHASE_2_DETAILED_PLAN.md docs/implementation/phase-2/
```

**Development Folder:**
```bash
mv docs/DEVELOPMENT_GUIDELINES.md docs/development/
mv docs/TESTING_STRATEGY.md docs/development/
mv docs/API_DOCUMENTATION.md docs/development/
```

**Operations Folder:**
```bash
mv docs/DEPLOYMENT_GUIDE.md docs/operations/
```

### Step 3: Create README Files for Each Folder

**docs/product/README.md:**
```markdown
# Product Documentation

Product requirements and specifications.

## Contents
- OFFICE_SEAT_ALLOCATION_PRD.md - Complete Product Requirements Document
```

**docs/architecture/README.md:**
```markdown
# Architecture Documentation

System architecture, design decisions, and technical specifications.

## Contents
- ARCHITECTURE_DECISION_RECORDS.md - Key architectural decisions
- TECHNICAL_IMPLEMENTATION_DOCUMENT.md - Detailed tech specifications
- TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md - Simplified overview
```

**docs/implementation/README.md:**
```markdown
# Implementation Plans

Phase-specific implementation details and task breakdowns.

## Contents
- phase-1/ - MVP implementation (Weeks 1-4)
- phase-2/ - Enhancement implementation (Weeks 5-8)
```

**docs/implementation/phase-1/README.md:**
```markdown
# Phase 1 Implementation (Weeks 1-4)

MVP implementation with core functionality.

## Contents
- PHASE_1_IMPLEMENTATION_PLAN.md - Overall Phase 1 plan
- BACKEND_PHASE_1_DETAILED_PLAN.md - Backend specifications
- FRONTEND_PHASE_1_DETAILED_PLAN.md - Frontend specifications
```

**docs/implementation/phase-2/README.md:**
```markdown
# Phase 2 Implementation (Weeks 5-8)

Enhancement and optimization implementation.

## Contents
- PHASE_2_IMPLEMENTATION_PLAN.md - Overall Phase 2 plan
- BACKEND_PHASE_2_DETAILED_PLAN.md - Backend specifications
- FRONTEND_PHASE_2_DETAILED_PLAN.md - Frontend specifications
```

**docs/development/README.md:**
```markdown
# Development Documentation

Development standards, testing strategies, and API reference.

## Contents
- DEVELOPMENT_GUIDELINES.md - Coding standards and best practices
- TESTING_STRATEGY.md - Testing approach and strategies
- API_DOCUMENTATION.md - Complete API reference
```

**docs/operations/README.md:**
```markdown
# Operations Documentation

Deployment, monitoring, and operational procedures.

## Contents
- DEPLOYMENT_GUIDE.md - Local, staging, and production deployment
```

### Step 4: Update Main docs/README.md

```markdown
# Documentation Index

Complete documentation for Office Workspace Seat Allocation System.

## Quick Navigation

### [Product](./product/)
- Product requirements and specifications
- User personas and use cases
- Success criteria

### [Architecture](./architecture/)
- Architectural decisions
- Technology stack
- System design

### [Implementation](./implementation/)
- **[Phase 1](./implementation/phase-1/)** - MVP (Weeks 1-4)
- **[Phase 2](./implementation/phase-2/)** - Enhancement (Weeks 5-8)

### [Development](./development/)
- Coding standards and guidelines
- Testing strategies
- API documentation

### [Operations](./operations/)
- Deployment procedures
- Monitoring and maintenance
- Troubleshooting

## Documentation by Role

**New Developers:**
1. [README.md](../README.md) - Project overview
2. [Development Guidelines](./development/DEVELOPMENT_GUIDELINES.md)
3. [Phase 1 Plan](./implementation/phase-1/)

**Backend Developers:**
1. [Backend Phase 1](./implementation/phase-1/BACKEND_PHASE_1_DETAILED_PLAN.md)
2. [Backend Phase 2](./implementation/phase-2/BACKEND_PHASE_2_DETAILED_PLAN.md)
3. [API Documentation](./development/API_DOCUMENTATION.md)

**Frontend Developers:**
1. [Frontend Phase 1](./implementation/phase-1/FRONTEND_PHASE_1_DETAILED_PLAN.md)
2. [Frontend Phase 2](./implementation/phase-2/FRONTEND_PHASE_2_DETAILED_PLAN.md)
3. [API Documentation](./development/API_DOCUMENTATION.md)

**DevOps/Operations:**
1. [Deployment Guide](./operations/DEPLOYMENT_GUIDE.md)
2. [Architecture Overview](./architecture/TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md)

**Project Managers:**
1. [Product Requirements](./product/OFFICE_SEAT_ALLOCATION_PRD.md)
2. [Phase 1 Plan](./implementation/phase-1/PHASE_1_IMPLEMENTATION_PLAN.md)
3. [Phase 2 Plan](./implementation/phase-2/PHASE_2_IMPLEMENTATION_PLAN.md)

**Architects:**
1. [Architecture Decisions](./architecture/ARCHITECTURE_DECISION_RECORDS.md)
2. [Technical Specifications](./architecture/TECHNICAL_IMPLEMENTATION_DOCUMENT.md)

## File Organization Summary

| Folder | Purpose | Files |
|--------|---------|-------|
| product/ | Requirements | 1 |
| architecture/ | Design & Tech | 3 |
| implementation/phase-1/ | Phase 1 Tasks | 3 |
| implementation/phase-2/ | Phase 2 Tasks | 3 |
| development/ | Standards & API | 3 |
| operations/ | Deployment | 1 |

**Total: 14 documentation files organized in 6 categories**
```

## Verification Checklist

After reorganization:
- [ ] All 14 markdown files are in correct folders
- [ ] Each folder has a README.md
- [ ] Main docs/README.md updated with new structure
- [ ] All cross-references updated (if any)
- [ ] Git .gitignore updated if needed
- [ ] No duplicate files remain in docs/ root

## Quick Commands

```bash
# Verify structure
tree docs/

# Check file count
find docs -name "*.md" | wc -l

# List all files
find docs -name "*.md" -type f
```

---

**Note**: This guide provides the exact steps to reorganize documentation into a logical folder structure. Execute the commands in order to properly organize all files.
