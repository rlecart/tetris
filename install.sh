npm i
npm i mocha --saved-dev
#./node_modules/.bin/mocha
npm i nyc --save-dev
#./node_modules/.bin/nyc --include src --all -r text -r lcov ./node_modules/.bin/mocha
