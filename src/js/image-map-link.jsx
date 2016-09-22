const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util.js');

class ImageMapLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: this.props.hovered,
      active: this.props.active
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({active: !this.state.active});
    util.isFunction(this.props.onChange) && this.props.onChange('active', this.props.id);
  }

  handleHover = (hovered, e) => {
    if (hovered !== this.state.hovered) {
      this.setState({hovered: hovered});
      typeof this.props.onChange == 'function' && this.props.onChange('hovered', this.props.id);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let state = {};
    if (nextProps.hovered !== this.state.hovered || nextProps.active !== this.state.active) {
      this.setState({
        hovered: nextProps.hovered,
        active: nextProps.active
      });
    } 
  }

  shouldComponentUpdate = (nextProps, nextState) => {        
    return  nextProps.active !== this.state.active || nextProps.hovered !== this.state.hovered;
  }

  render () {
    const {
      category, 
      id, 
      top,
      left,
      width,
      height,
      ...other
    } = this.props;
    
    const style = {top, left, width, height};
    const className = classNames('image-map_overlay', {
        'has-attention': this.state.active,
        'hover-has-attention': this.state.hovered,
        ['image-map_overlay__' + category]: category // MOVE CATEGORY?
    }, this.props.className);
    //TODO: need to generate tab index
    return (
      <a className={className}
          style={style}
          href={id}
          tabIndex="-1"
          onClick={this.handleClick}
          onMouseEnter={this.handleHover.bind(null, true)}
          onMouseLeave={this.handleHover.bind(null, false)}
          {...other}>
          <span className="u-visually-hidden">{this.props.text}</span>
      </a>
    );
  }
}

module.exports = ImageMapLink;