const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const Expandable = require('./expandable.jsx');
const ExpandableGroup = require('./expandable-group.jsx');

class FormExplainerTerms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      hovered: this.props.hovered
    }
  }

  handleSelect = (id, e) => {
    const active = id === this.props.active ? null : id;
    typeof this.props.onChange === 'function' && this.props.onChange('active', active);
  }

  handleHover = (id, on, e) => {
    const hovered = on ? id : null;
    if (hovered !== this.props.hovered) {
      typeof this.props.onChange == 'function' && this.props.onChange('hovered', hovered);
    }
  }

  generateTerms = (terms) => {
    return terms.map(function (term) {
      const title = <span><span className="u-visually-hidden">{term.category}</span>{term.term}</span>;
      const body = <div dangerouslySetInnerHTML={{__html:term.definition}}></div>;
      const id = term.id;
      const active = id === this.props.active;
      const hovered = id === this.props.hovered;
      // padded should be an option on Expandable?
      const className = classNames({
          'o-expandable__padded o-expandable__form-explainer': true,
          ['o-expandable__form-explainer-' + term.category]: true,
          'hover-has-attention': hovered,
          'has-attention': active
      });
    
      return (
        <Expandable className={className} 
                    key={id} 
                    id={id} 
                    title={title}
                    body={body}
                    onMouseEnter={this.handleHover.bind(null, id, true)}
                    onMouseLeave={this.handleHover.bind(null, id, false)}
                    onSelect={this.handleSelect}
                    onCollapsed={this.props.onCollapsed}/>
      )
    }, this);
  }

  generatePlaceholder = () => {
    return (
      <div className="o-expandable o-expandable__padded o-expandable__placeholder">
          <span className="o-expandable_header">
              {"No " + this.props.category + " on this page. Filter by another category above or page ahead to continue exploring " + this.props.category + "."}
          </span>
      </div>
    )
  }

  render () {
    const {
      active,
      hovered,
      terms,
      category,
      onCollapsed,
      onSelect,
      ...props,
    } = this.props;

    let content;

    if (terms.length) {
      content = this.generateTerms(terms);
    } else {
      content = this.generatePlaceholder();
    }

    return (
      <ExpandableGroup accordion={true} active={this.props.active} onSelect={this.handleSelect} {...props}>
        {content}
      </ExpandableGroup>
    );
  }
};

module.exports = FormExplainerTerms;