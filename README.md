# disclosure-search

## Install elasticsearch:
```bash
brew install elasticsearch
brew services start elasticsearch
/usr/local/Cellar/elasticsearch/2.3.2/libexec/bin/plugin install mobz/elasticsearch-head
```

## Install nodejs:
```bash
brew update && brew install node-build nodenv
nodenv install
npm install
```

## Run stuff:
npm run dev

# Needed functionality:
1. customizable form types
2. row hash key so that duplicate rows can be filtered out
  - perhaps some kind of cardinality metric
