const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util.js');
const ImageMapLink = require('./image-map-link.jsx');

class ImageMapOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTerms = () => {
    return this.props.terms.map(function (item) {
      const {term, category, id, ...other} = item;
      return (
        <ImageMapLink active={id === this.props.active}
                      hovered={id === this.props.hovered}
                      onChange={this.props.onChange}
                      text={term}
                      key={id + '_' + category}
                      id={id}
                      category={category}
                      {...other} />
        )
    }, this);
  }

  render () {
    const content = this.renderTerms();
    return <div>{content}</div>;
  }
}

module.exports = ImageMapOverlay;