require('shelljs/global');

if (!which('git')) {
    echo('Sorry, this script requires git to be available on the command line');
    exit(1);
}

exec('git add .');
exec('git commit -m "Automated commit on' + commitDate+ '"');
