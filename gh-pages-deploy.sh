git stash
commitDate=`date +%Y-%m-%d:%H:%M:%S`
cp lib/staticSite.html build/public/index.html;
git branch gh-pages;
git checkout gh-pages;
cp -r build/public/* .
git add .;
git commit -m "Automated commit on ${commitDate}";
