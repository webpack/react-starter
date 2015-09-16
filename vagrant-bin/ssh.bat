@ECHO OFF

SETLOCAL EnableDelayedExpansion

REM // MUST SPECIFY ssh AS ssh.exe SO THAT THIS FILE CALLS THE ACTUAL ssh INSTEAD
REM // OF CALLING ITSELF RECURSIVELY FOREVER
set WHERE_SSH_CMD=where.exe ssh.exe

REM set WHERE_SSH_CMD=where.exe ForceSshExist.exe
REM set WHERE_SSH_CMD=where.exe ForceSshDoesNotExist.exe
REM echo WHERE_SSH_CMD: %WHERE_SSH_CMD%

FOR /F "tokens=* USEBACKQ" %%F IN (`!WHERE_SSH_CMD! 2^>NUL`) DO (
    SET SSH_PATH=%%F
)

REM ECHO SSH_PATH: "!SSH_PATH!"

IF "!SSH_PATH!" EQU "" (

    set WHERE_GIT_CMD=where.exe git
    
    REM set WHERE_GIT_CMD=where.exe ForceGitExist
    REM set WHERE_GIT_CMD=where.exe ForceGitDoesNotExist
    REM echo WHERE_GIT_CMD: !WHERE_GIT_CMD!
    
    FOR /F "tokens=* USEBACKQ" %%F IN (`!WHERE_GIT_CMD! 2^>NUL`) DO (
        SET GIT_PATH=%%F
    )
    
    IF NOT EXIST "!GIT_PATH!" (
        ECHO !WHERE_GIT_CMD!
        ECHO git installation not found. cannot use its bundled ssh executable
        EXIT /B
    )
    
    REM echo GIT_PATH: !GIT_PATH!
    
    set REL_BIN_DIR=!GIT_PATH!\..\..\bin
    
    REM echo REL_BIN_DIR: !REL_BIN_DIR!
    
    pushd !REL_BIN_DIR!
    
    set ABS_BIN_DIR=!CD!
    
    popd
    
    REM echo ABS_BIN_DIR: !ABS_BIN_DIR!
    
    SET PATH=!ABS_BIN_DIR!;!PATH!
    
    REM echo SET PATH AS: !PATH!

)

@ECHO ON

@ssh.exe %*