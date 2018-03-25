rmdir /S /Q ..\build\np-server
xcopy /e /v ..\server ..\build\np-server\server\
xcopy /e /v ..\client\dist ..\build\np-server\client\dist\
xcopy .\nssm.exe ..\build\np-server\bin\
xcopy .\insatll_service.bat ..\build\np-server\bin\
xcopy .\uninstall_service.bat ..\build\np-server\bin\
xcopy .\run.bat ..\build\np-server\bin\