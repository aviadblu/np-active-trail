c:\np-server\bin\nssm.exe install next-play-activetrail-server "C:\Program Files\nodejs\node" server\app.js
TIMEOUT 1
c:\np-server\bin\nssm.exe set next-play-activetrail-server AppDirectory c:\np-server
TIMEOUT 1
c:\np-server\bin\nssm.exe restart next-play-activetrail-server
exit

