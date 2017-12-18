rmdir /S /Q ..\build
xcopy /e /v ..\server ..\build\server\
xcopy /e /v ..\client\dist ..\build\client\dist\
xcopy .\run.bat ..\build