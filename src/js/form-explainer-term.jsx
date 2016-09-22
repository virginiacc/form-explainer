const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const Expandable = require('./expandable.jsx');

class FormExplainerTerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      hovered: this.props.hovered
    }
  }

  handleSelect = (e, active) => {
  	//const active = !this.state.active;
    //this.setState({active: active});
    //typeof this.props.onChange === 'function' && this.props.onChange('active', active);
  }

  handleHover = (hovered, e) => {
    if (hovered !== this.props.hovered) {
    	//this.setState({hovered: hovered});
      //typeof this.props.onChange == 'function' && this.props.onChange('hovered', hovered);
    }
  }

  render () {
    const {
      active,
      hovered,
      category,
      onCollapsed,
      onSelect,
      term,
      definition,
      id,
      ...props,
    } = this.props;
    

	const title = <span><span className="u-visually-hidden">{category}</span>{term}</span>;
    const body = <div dangerouslySetInnerHTML={{__html:definition}}></div>;
    const className = classNames({
        'o-expandable__padded o-expandable__form-explainer': true,
        ['o-expandable__form-explainer-' + category]: true,
        'hover-has-attention': hovered,
        'has-attention': active
    });
    
    return (
        <Expandable className={className} 
            key={id} 
            id={id} 
            title={title}
            body={body}
            onMouseEnter={this.handleHover.bind(null, true)}
            onMouseLeave={this.handleHover.bind(null, false)}
            onSelect={this.handleSelect}
            onCollapsed={this.props.onCollapsed}
            {...props}/>
    )
  }
};

module.exports = FormExplainerTerm;

