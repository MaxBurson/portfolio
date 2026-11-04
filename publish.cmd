@echo off
rem Publishes your latest changes to https://maxburson.github.io/portfolio/
cd /d "%~dp0"
git add -A
git commit -m "Update site" || echo Nothing new to commit.
git push
echo.
echo Pushed. The live site updates in about a minute.
pause
