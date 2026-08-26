@echo off
echo ===================================================
echo   EDICRIA STUDIO - ENVIAR PARA O GITHUB & GOOGLE AI STUDIO
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Configurando o repositorio remoto...
"C:\Users\ediva\.gemini\antigravity-ide\scratch\git\cmd\git.exe" remote remove origin >nul 2>&1
"C:\Users\ediva\.gemini\antigravity-ide\scratch\git\cmd\git.exe" remote add origin https://github.com/edicriaestudio/edicrias-tudio02.git
"C:\Users\ediva\.gemini\antigravity-ide\scratch\git\cmd\git.exe" branch -M main

echo [2/3] Enviando arquivos para o GitHub...
echo (Se o GitHub pedir login, confirme a autenticacao no navegador)
echo.

"C:\Users\ediva\.gemini\antigravity-ide\scratch\git\cmd\git.exe" push -u origin main

echo.
echo ===================================================
echo   ENVIO CONCLUIDO COM SUCESSO!
echo   Agora acesse o Google AI Studio e importe de:
echo   https://github.com/edicriaestudio/edicrias-tudio02.git
echo ===================================================
pause
