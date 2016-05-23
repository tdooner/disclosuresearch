import React from 'react';

import SearchUtil from 'app/utils/search_util';

const App = React.createClass({
  getInitialState() {
    return {
      search: '',
      numTotalResults: 0,
      results: [],
      aggResults: {},
      filters: {},
    };
  },

  _search() {
    this.setState({ search: this._searchField.value });

    /*
    SearchUtil
      .search(e.target.value)
      .then(results => {
        this.setState({
          results: results.hits.hits
        });
      });
      */
    SearchUtil.aggregateByFiler({
      query: this._searchField.value,
      filters: this.state.filters,
    }).then(results => {
        this.setState({
          numTotalResults: results.hits.total,
          results: results.hits.hits,
          aggResults: results.aggregations,
        })
      });
  },

  _addFilter(key, value) {
    const newState = Object.assign({}, this.state.filters);
    newState[key] = value;
    this.setState({ filters: newState, results: [] });
  },

  _removeFilter(key) {
    const newState = Object.assign({}, this.state.filters);
    delete newState[key];
    this.setState({ filters: newState, results: [] });
  },

  componentDidUpdate(nextProps, nextState) {
    if (Object.keys(this.state.filters).length != Object.keys(nextState.filters).length) {
      this._search();
    }
  },

  _renderResult(result) {
    return (
      <div>
        <ul>{Object.keys(result._source).map((key) => {
          const highlight = result.highlight[key];
          const value = result._source[key];

          if (this.state.filters[key]) {
            return <li onClick={this._removeFilter.bind(this, key)}><em><b>{key}</b>: {value}</em></li>;
          } else if (highlight) {
            return <li onClick={this._addFilter.bind(this, key, value)}><b>{key}</b>:
              <span dangerouslySetInnerHTML={{ __html: highlight}} /></li>;
          } else {
            return <li onClick={this._addFilter.bind(this, key, value)}><b>{key}</b>: {value}</li>;
          }
        })}
        </ul>
      </div>
    );
  },

  render() {
    return (
      <div>
        <input onKeyUp={this._search} ref={(el) => this._searchField = el} />
        <div>
          results: {this.state.numTotalResults} / {
            this.state.aggResults &&
              this.state.aggResults.contributions &&
                <span>total contributions: {Math.round(this.state.aggResults.contributions.sum)}</span>
                }

          {this.state.results.map(this._renderResult)}
        </div>
      </div>
    );
  }
});

module.exports = App;
