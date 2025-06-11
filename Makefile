
default: build run

run:
	@node index.js

build:
	@npx tsc

watch:
	@npc tsc --watch


live: 
	@browser-sync start --proxy "http://localhost:8000" --files "public/**/*.css"

