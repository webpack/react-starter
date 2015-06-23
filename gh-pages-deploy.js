require('shelljs/global');

if (!which('git')) {
    echo('Sorry, this script requires git to be available on the command line');
    exit(1);
}

exec('git stash');
var commitDate = new Date().toString().replace(/\s/g,'_').replace(/\W/g, '');
cp('-f', 'lib/staticSite.html', 'build/public/index.html');
exec('git branch gh-pages');
exec('git checkout gh-pages');
cp('-rf', './build/public/*', '.');
exec('git add .');
exec('git commit -m "Automated commit on' + commitDate+ '"');
