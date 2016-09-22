const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const TabButton = require('./tab-button.jsx');

class FormExplainerFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTabButtons (selectedCategory) {
    return this.props.categories.map(function (category) {
      return (
        <TabButton isSelected={category.id === selectedCategory} 
                   onChange={this.props.onChange.bind(null, category.id)}
                   id={category.id}
                   key={category.id}>
          <span className={"cf-icon " + category.icon}></span>
          <span className="tab-label">{category.name}</span>
        </TabButton>
      )
    }, this);
  }

  render () {
    return (
      <ul className="tabs explain_tabs">
        {this.renderTabButtons(this.props.category)}
      </ul>
    );
  }

}

module.exports = FormExplainerFilters;