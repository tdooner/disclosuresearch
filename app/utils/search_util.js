import $ from 'jquery';

const SearchUtil = {
  search(query) {
    return $.post({
      url: 'http://127.0.0.1:9200/netfile/_search',
      contentType: 'application/json',
      data: JSON.stringify({
        query: {
          match: { '_all': query }
        },
        highlight: {
          fields: {
            '*': {}
          },
          // http://stackoverflow.com/a/34348030/910723
          require_field_match: false,
        }
      })
    });
  }
};

module.exports = SearchUtil;
