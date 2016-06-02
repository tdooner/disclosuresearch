import React from 'react';
import _ from 'lodash';

const Result = React.createClass({
  propTypes: {
    result: React.PropTypes.object,
    filters: React.PropTypes.object,
    enabledProperties: React.PropTypes.array,
    handleRemoveFilter: React.PropTypes.func,
    handleAddFilter: React.PropTypes.func,
  },

  getInitialState() {
    return {
      revealed: false,
    };
  },

  render() {
    const {
      enabledProperties,
      handleAddFilter,
      handleRemoveFilter,
      filters,
      result,
    } = this.props;

    let renderProperties;

    if (this.state.revealed) {
      renderProperties = Object.keys(result._source);
    } else {
      renderProperties =
        _.union(enabledProperties, Object.keys(result.highlight || {}));
    }

    return (
      <div
        onMouseEnter={() => this.setState({ revealed: true })}
        onMouseLeave={() => this.setState({ revealed: false })}
      >
        <ul>
          {renderProperties.map(key => {
            const highlight = result.highlight && result.highlight[key];
            const value = result._source[key];

            if (filters[key]) {
              return <li onClick={() => handleRemoveFilter(key)}><em><b>{key}</b>: {value}</em></li>;
            } else if (highlight) {
              return <li onClick={() => handleAddFilter(key, value)}><b>{key}</b>:
                <span dangerouslySetInnerHTML={{ __html: highlight}} /></li>;
            } else {
              return <li onClick={() => handleAddFilter(key, value)}><b>{key}</b>: {value}</li>;
            }
          })}
        </ul>
      </div>
    );
  },
});

module.exports = Result;
