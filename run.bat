@echo off
start cmd /k "cd /d frontend && npm start"
start cmd /k "cd /d backend && python -m uvicorn app.main:app --reload"