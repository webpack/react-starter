require('shelljs/global');

exec('git stash');
cp('-f', 'lib/static-build-assets/staticSite.html', 'build/public/index.html');
exec('git branch gh-pages');
exec('git checkout gh-pages');
cp('-rf', './build/public/*', '.');
