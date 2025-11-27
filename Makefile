.PHONY: help install dev build lint format type-check dead-code quality clean db-generate db-migrate

help:
	@echo "Evolution API Development Commands"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start development server"
	@echo "  make build       - Build for production"
	@echo "  make lint        - Run ESLint with auto-fix"
	@echo "  make format      - Format code with Prettier"
	@echo "  make type-check  - Run TypeScript type checking"
	@echo "  make dead-code   - Check for dead code"
	@echo "  make quality     - Run all quality checks"
	@echo "  make db-generate - Generate Prisma client"
	@echo "  make db-migrate  - Run database migrations"

install:
	pnpm install

dev:
	pnpm run dev:server

build:
	pnpm run db:generate && pnpm run build

lint:
	pnpm run lint

format:
	pnpm run format

type-check:
	pnpm run db:generate && pnpm run type-check

dead-code:
	pnpm run db:generate && pnpm run lint:dead-code

quality:
	pnpm run quality

db-generate:
	pnpm run db:generate

db-migrate:
	pnpm run db:migrate:dev

clean:
	rm -rf dist node_modules/.cache
