/** @jsx React.DOM */

require('es6-shim');

var InfiniteScroll = require('./InfiniteScroll');
var MessageList = require('./MessageList');
var MessageStore = require('./MessageStore');
var React = require('react');
var StoreToStateMixin = require('./StoreToStateMixin');

var PureRenderMixin = React.addons.PureRenderMixin;

var App = React.createClass({
  mixins: [
    PureRenderMixin,
    StoreToStateMixin({
      messages: {
        method: MessageStore.getMessages,
        getOptions: (props, state) => ({
          query: state.query,
          maxResultCount: state.maxResultCount,
        }),
      },
    })
  ],

  getInitialState() {
    return {
      query: '',
      queryProgress: '',
      maxResultCount: 20,
    };
  },

  _onQueryKeyDown(e) {
    if (e.key === 'Enter') {
      this.setState({query: e.target.value});
    }
  },

  _onQueryChange(e) {
    this.setState({queryProgress: e.target.value});
  },

  _onSearchClick() {
    this.setState({query: this.state.queryProgress});
  },

  _onRequestMoreItems() {
    this.setState({maxResultCount: this.state.maxResultCount + 20});
  },

  render() {
    return (
      <div className="App">
        <div className="App_search">
          <input
            className="App_search_input"
            value={this.state.queryProgress}
            onChange={this._onQueryChange}
            onKeyDown={this._onQueryKeyDown}
            type="text"
          />
          <button
              className="App_search_button"
              onClick={this._onSearchClick}
              type="button">
            Search
          </button>
        </div>
        {this.state.messages.result ? (
          <InfiniteScroll
              hasMore={this.state.messages.result.hasMore}
              onRequestMoreItems={this._onRequestMoreItems}>
            <MessageList messages={this.state.messages.result.items} />
          </InfiniteScroll>
        ) : <div>Loading</div>}
      </div>
    );
  }
});

React.renderComponent(<App />, document.body);
