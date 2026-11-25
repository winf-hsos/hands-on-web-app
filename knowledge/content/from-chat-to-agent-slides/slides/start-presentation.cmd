@echo off
rem start-presentation.cmd: startet das Deck ueber einen lokalen Server.
rem Erzeugt von stagekit/tools/start_script.py; nicht von Hand aendern, neu erzeugen.
rem Der Server laeuft in dem Ordner, der Deck und stagekit enthaelt.
rem Fenster offen lassen, solange vorgetragen wird; Schliessen beendet den Server.
cd /d "%~dp0..\..\"
python -c "import http.server, webbrowser; server = http.server.ThreadingHTTPServer(('127.0.0.1', 8815), http.server.SimpleHTTPRequestHandler); webbrowser.open('http://127.0.0.1:8815/from-chat-to-agent-slides/slides/from-chat-to-agent.html'); server.serve_forever()"
