const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

class ExpandableGroup extends React.Component {
  static propTypes = {
    accordion: React.PropTypes.bool,
    onSelect: React.PropTypes.func
    //className
    //active
  }

  static defaultProps = {
    accordion: false
  }

  constructor(props, context) {
    super(props, context);
    this.state = {active: this.props.active}
  }

  handleSelect = (id, e) => {
    e.preventDefault();
    this.setState({ active: id === this.state.active ? null : id });
    typeof this.props.onSelect === 'function' && this.props.onSelect(id, e);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.active !== this.state.active) {
      this.setState({active: nextProps.active})
    }
  }

  render () {
    const {
      accordion,
      className,
      children,
      active,
      onSelect,
      ...props
    } = this.props;
    const groupClass = classNames('o-expandable-group', className);

    // TODO: check for valid children
    // TODO: will this get a single child element?
    let childElements;
    if (children.length) {
      childElements = children.map(function (child) {
        let additionalProps = {
          onSelect: this.handleSelect
        }
        if (accordion) {
          additionalProps.expanded = (child.props.id === this.state.active)
        }
        //TODO: handle an onSelect on the child?
        return React.cloneElement(child, additionalProps);
      }, this); 
    } else {
      childElements = children;
    }

    return (
        <div className={groupClass} {...props}>
          {childElements}
        </div>
    )
  }
}

module.exports = ExpandableGroup;
