@echo off
title Push ke GitHub - jurnal-literasi
cd /d "%~dp0"
echo ========================================================
echo  PUSH PROJECT KE GITHUB (widyasweet83/jurnal-literasi)
echo ========================================================
echo.
echo Menghubungkan ke GitHub...
echo Jika jendela browser / pop-up login muncul, silakan klik 'Sign in with your browser'.
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  BERHASIL: Project sukses ter-push ke GitHub!
    echo  URL: https://github.com/widyasweet83/jurnal-literasi
    echo ========================================================
) else (
    echo ========================================================
    echo  GAGAL: Silakan periksa koneksi atau autentikasi GitHub.
    echo ========================================================
)
echo.
pause
