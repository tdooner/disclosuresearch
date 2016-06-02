import $ from 'jquery';

const SearchUtil = {
  aggregateByFiler({ query, filters }) {
    const words = query.split(' ');
    const lastWord = words.pop();

    const queryFilters = Object.keys(filters).reduce((a, i) => a.concat({ match_phrase: { [i]: filters[i] } }), []);
    console.log(queryFilters);

    if (lastWord.length) {
      queryFilters.push({ prefix: { '_all': lastWord } })
    }

    if (words.length) {
      queryFilters.push({ match_phrase: { '_all': words.join(' ') } });
    }

    return $.post({
      url: ELASTICSEARCH_BASE + '/netfile/_search',
      contentType: 'application/json',
      data: JSON.stringify({
        query: {
          bool: {
            filter: queryFilters,
          },
        },
        sort: [
          { tran_Amt1: { order: 'desc' } },
        ],
        highlight: {
          fields: {
            '*': {}
          },
          // http://stackoverflow.com/a/34348030/910723
          require_field_match: false,
        },
        aggs: {
          contributions: {
            stats: {
              field: 'tran_Amt1'
            }
          },
        }
      })
    });
  },

  search(query) {
    return $.post({
      url: ELASTICSEARCH_BASE + '/netfile/_search',
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
