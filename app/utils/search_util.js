import $ from 'jquery';

const SearchUtil = {
  search(query) {
    return $.get({
      url: 'http://127.0.0.1:9200/netfile/_search?q=' + query
    });
  }
};

module.exports = SearchUtil;
