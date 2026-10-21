@echo off
title Server Web SIPUS-LIT SMABA
echo Menjalankan Server Web Lokal SMAN 1 Batu...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
