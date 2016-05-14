import React from 'react';

import SearchUtil from 'app/utils/search_util';

const App = React.createClass({
  getInitialState() {
    return { search: '' };
  },

  _search(e) {
    this.setState({ search: e.target.value });

    SearchUtil
      .search(e.target.value)
      .then(results => {
        this.setState({
          results: results.hits.hits
        });
      });
  },

  _renderResult(result) {
    return (
      <div>
        {
          Object.keys(result._source).map(
            key => <span><b>{key}</b>: {result._source[key]}</span>
          )
        }
      </div>
    );
  },

  render() {
    return (
      <div>
        <input onKeyUp={this._search} />
        <div>
          results: {this.state.results.map(this._renderResult)}
        </div>
      </div>
    );
  }
});

module.exports = App;
