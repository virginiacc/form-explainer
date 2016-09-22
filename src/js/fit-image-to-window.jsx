const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util');

class FitImageToWindow extends React.Component {
  // TODO: add a way to enforce max or min values on image width:
  // verifySize function or max/minWidth values/functions
  // TODO: allow functions or refs for top & bottom offset

  static propTypes = {
    on: React.PropTypes.bool,
    topOffset: React.PropTypes.number,
    bottomOffset: React.PropTypes.number,
    src: React.PropTypes.string,
    className: React.PropTypes.string,
    onResize: React.PropTypes.func
  }

  static defaultProps = {
    on: true,
    topOffset: 30,
    bottomOffset: 30
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getImageDimensions = () => {
    const elem = ReactDOM.findDOMNode(this);
    return {
      imageWidth: elem.offsetWidth,
      imageHeight: elem.offsetHeight,
      ratio: elem.offsetWidth / elem.offsetHeight || 0
    }
  }

  onLoad = (e) => {
    if (!this.state.hasOwnProperty('imageWidth')) {
      this.setState(this.getImageDimensions(), this.handleResize);
    } else {
      this.handleResize(); 
    }
  }

  calculateOffsets = () => {
    // TODO: allow functions or refs for offset values
    const topOffset = isNaN(this.props.topOffset) ? 0 : this.props.topOffset;
    const bottomOffset = isNaN(this.props.bottomOffset) ? 0 : this.props.bottomOffset;
    return topOffset + bottomOffset;
  }

  getNewImageWidth = () => {
    const windowDimensions = util.getWindowDimensions();
    const height = windowDimensions.height - this.calculateOffsets();
    const ratio = this.state.ratio ? this.state.ratio : this.getImageDimensions().ratio;
    let width = height * ratio;
    width > windowDimensions.width && (width = windowDimensions.width);
    if (this.state.imageWidth && (width > this.state.imageWidth)) {
      width = this.state.imageWidth;
    }
    return width;
  }

  handleResize = () => {
    const width = this.props.on ? this.getNewImageWidth() : 0;
    this.setState({width: width});
    typeof this.props.onResize == 'function' && this.props.onResize(width);
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
  
    return nextProps.src !== this.props.src ||
           //nextProps.width !== this.state.width ||
           nextState.width !== this.state.width
           nextProps.on !== this.props.on;
  }

  render () {
    console.log('fit image is re-rendering')
    const {
      breakpoint, 
      topOffset, 
      bottomOffset, 
      verifySize, 
      onResize, 
      onLoad,
      ...props
    } = this.props;

    const style = this.state.width ? {width: this.state.width} : {};
    
    return (
      <img onLoad={this.onLoad} 
           style={style}
           {...props}/>
    )
  }
};

module.exports = FitImageToWindow;


