import React from 'react';
import _ from 'lodash';

import Result from 'app/components/Result';
import SearchUtil from 'app/utils/search_util';
import debounce from 'app/utils/debounce';

const App = React.createClass({
  getInitialState() {
    return {
      search: '',
      numTotalResults: 0,
      results: [],
      aggResults: {},
      filters: {},
      properties: [],
      enabledProperties: [
        'tran_NamL',
        'tran_Id',
        'tran_Amt1',
      ]
    };
  },

  componentWillMount() {
    this._debouncedSearch = debounce(this._search, 200);

    SearchUtil.getProperties()
      .then(properties => this.setState({ properties }));
  },

  _search() {
    this.setState({ search: this._searchField.value });

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
      this._debouncedSearch();
    }

    if (this.state.properties) {
      for (const property of this.state.enabledProperties) {
        if (this.state.properties.indexOf(property) === -1) {
          throw new Error(`Enabled Property ${property} is not valid! Valid: ` +
                          `${this.state.properties.join(' ')}`);
        }
      }
    }
  },

  _addField(e) {
    const value = e.target.value;

    if (this.state.properties.indexOf(value) === -1) {
      return;
    }

    this.setState({
      enabledProperties: _.union(this.state.enabledProperties, [value]),
    });
  },

  render() {
    return (
      <div>
        <input onKeyUp={this._debouncedSearch} ref={(el) => this._searchField = el} />
        <select onChange={this._addField}>
          <option key={-1} value={null}>add field</option>
          {this.state.properties.map(
            (property, i) => <option key={i} value={property}>{property}</option>
          )}
        </select>

        <div>
          results: {this.state.numTotalResults} / {
            this.state.aggResults &&
              this.state.aggResults.contributions &&
                <span>total contributions: {Math.round(this.state.aggResults.contributions.sum)}</span>
                }

                {this.state.results.map(result =>
                  <Result
                    result={result}
                    filters={this.state.filters}
                    enabledProperties={this.state.enabledProperties}
                    handleAddFilter={this._addFilter}
                    handleRemoveFilter={this._removeFilter}
                  />
                )}
        </div>
      </div>
    );
  }
});

module.exports = App;
