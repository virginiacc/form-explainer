const React = require('react');
const cloneElement =  require('react').cloneElement;
const ReactDOM = require('react-dom');
const classNames = require('classnames');

// TODO: ResponsiveExpandable
// TODO: scroll to expandable when triggered
// as a result of image map selection

const COLLAPSED = 0;
const COLLAPSING = 1;
const EXPANDING = 2;
const EXPANDED = 3;

function getTransitionProperties () {
  const elem = document.createElement('div');
  let transition;
  const transitions = {
    WebkitTransition: ['webkitTransitionEnd', '-webkit-transition'],
    MozTransition:    ['transitionend', '-moz-transition'],
    OTransition:      ['oTransitionEnd otransitionend', '-o-transition'],
    transition:       ['transitionend', 'transition']
  }
  
  for ( var t in transitions ) {
    if ( transitions.hasOwnProperty( t ) &&
         typeof elem.style[t] !== 'undefined' ) {
      transition = transitions[t];
      //prefix = t === 'transition' ? '' : '-' + t.split['Transition'][0] + '-';
      break;
    }
  }
  return transition;
}

const transitionProps = getTransitionProperties();
const transitionEnd = transitionProps[0];
const transitionPrefix = transitionProps[1];

class Expandable extends React.Component {

  static propTypes = {
    onSelect: React.PropTypes.func,
    expanded: React.PropTypes.bool,
    onExpand: React.PropTypes.func, 
    onExpanding: React.PropTypes.func, 
    onExpanded: React.PropTypes.func, 
    onCollapse: React.PropTypes.func, 
    onCollapsing: React.PropTypes.func, 
    onCollapsed: React.PropTypes.func
    // itemKey or id
  }

  static defaultProps = {
    expanded: false
  }

  constructor (props)  {
    super(props);
    this.state = {
      status: this.props.expanded ? EXPANDED : COLLAPSED,
      expanded: this.props.expanded
    };
  }

  handleClick = (e) => {
    // decide whether clicks are ignored during animation
    // start with that being the case
    if ( this.state.status === EXPANDED || this.state.status === COLLAPSED ) {
      const expanded = !this.state.expanded;
      this.setState({expanded: expanded});
      this.updateState(expanded)
      typeof this.props.onSelect === 'function' && this.props.onSelect(this.props.id, e);
      
    } 
  }

  updateState = (expanded) => {
    if (expanded) {
      this.expand()
    } else {
      this.collapse()
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({expanded: nextProps.expanded});
      this.updateState(nextProps.expanded)
    }
  }

  getHeight (node) {
    return node.offsetHeight;
  }

  getScrollHeight (node) {
    return node.scrollHeight;
  }

  /**
  * @param {number} height The height of the expandable content area in pixels.
  * @returns {number} The amount of time over which to expand in seconds.
  */
  calculateExpandDuration = ( height ) => {
    return this.constrainValue( 225, 450, height ) / 1000;
  }

  /**
   * @param {number} height The height of the expandable content area in pixels.
   * @returns {number} The amount of time over which to expand in seconds.
   */
  calculateCollapseDuration = ( height ) => {
    return this.constrainValue( 175, 450, height / 2 ) / 1000;
  }

  /**
   * @param {number} min The minimum height in pixels.
   * @param {number} max The maximum height in pixels.
   * @param {number} duration
   *   The amount of time over which to expand in milliseconds.
   * @returns {number} The amount of time over which to expand in milliseconds,
   *   constrained to within the min/max values.
   */
  constrainValue( min, max, duration ) {
    if ( duration > max ) {
      return max;
    } else if ( duration < min ) {
      return min;
    }
    return duration;
  }

  expand = () => {
    const node = ReactDOM.findDOMNode(this.refs.content);
    const height = this.getScrollHeight(node);
    const duration = this.calculateExpandDuration(height);

    this.handleExpand(node);

    this.setState({status: EXPANDING}, () => {
      this.handleExpanding(node);

      this.transitionHeight(node, height + 'px', duration, () => {
        this.setState({status: EXPANDED}, () => {
          this.handleExpanded(node);
        });
      });

    });
  }

  collapse = () => {
    const node = ReactDOM.findDOMNode(this.refs.content);
    const height = this.getHeight(node);

    this.handleCollapse(node, height);

    this.setState({status: COLLAPSING}, () => {
      const duration = this.calculateCollapseDuration(height);
      this.handleCollapsing(node);

      this.transitionHeight(node, '0px', duration, () => {
        this.setState({status: COLLAPSED}, () => {
          this.handleCollapsed(node);
        });
      });

    });
  }

  transitionHeight (node, height, duration, callback) {
    if ( transitionEnd ) {
      node.addEventListener(transitionEnd, callback);
      node.style[transitionPrefix] = 'height ' + duration + 's ease-out';
      node.style.height = height;
    } else {
      callback();
    }
  }

  handleExpand = (node) => {
    node.style.height = '0';
    typeof this.props.onExpand === 'function' && this.props.onExpand(node);
  }

  handleExpanding = (node) => {
    typeof this.props.onExpanding === 'function' && this.props.onExpanding(node);
  }

  handleExpanded = (node) => {
    node.style.height = null;
    node.style[transitionPrefix] = null;
    typeof this.props.onExpanded === 'function' && this.props.onExpanded(node);
  }

  handleCollapse = (node, height) => {
    node.style.height = height + 'px';
    this.getHeight(node); // triggers browser reflow after style.height is set
    typeof this.props.onCollapse === 'function' && this.props.onCollapse(node);
  }

  handleCollapsing = (node) => {    
    typeof this.props.onCollapsing === 'function' && this.props.onCollapsing(node);
  }

  handleCollapsed = (node) => {
    node.style.height = null;
    node.style[transitionPrefix] = null;
    typeof this.props.onCollapsed === 'function' && this.props.onCollapsed(node);
  }

  render () {
    const {
      body,
      title,
      className,
      expanded,
      onExpand, 
      onExpanding, 
      onExpanded, 
      onCollapse, 
      onCollapsing, 
      onCollapsed, 
      ...props,
    } = this.props;

    const isExpanded = this.state.status === EXPANDED;

    const expandableClass = classNames({
      'o-expandable': true,
      'o-expandable__expanded': isExpanded
    }, className);

    return (
      <div className={expandableClass} {...props}>
        <button className="o-expandable_target" 
                tabIndex="0" 
                ref="target" 
                aria-pressed={isExpanded} 
                onClick={this.handleClick}>
          <div className="o-expandable_header">
            <span className="o-expandable_header-left
                             o-expandable_label">
                {title}
            </span>
            <span className="o-expandable_header-right
                             o-expandable_link">
              <span className="o-expandable_cue
                               o-expandable_cue-open">
                <span className="o-expandable_cue-label u-visually-hidden">Show</span>
                <span className="cf-icon cf-icon-plus-round"></span>
              </span>
              <span className="o-expandable_cue
                               o-expandable_cue-close u-hidden">
                <span className="o-expandable_cue-label u-visually-hidden">Hide</span>
                <span className="cf-icon cf-icon-minus-round"></span>
              </span>
            </span>
          </div>
        </button>
        <div className="o-expandable_content" 
             ref="content" 
             aria-expanded={isExpanded}>
           {body}
        </div>
    </div>
    )
  }
}

module.exports = Expandable;
