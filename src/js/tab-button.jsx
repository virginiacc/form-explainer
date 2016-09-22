const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

class TabButton extends React.Component {
  static propTypes = {
    isSelected: React.PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {isSelected: this.props.isSelected}
  }

  componentWillReceiveProps = (props) => {
    if (props.hasOwnProperty('isSelected') && props.isSelected != this.state.isSelected) {
      this.setState({isSelected: props.isSelected});
    }
  }

  handleClick = (e) => {
    this.setState({isSelected: !this.state.isSelected})
    typeof this.props.onChange == 'function' && this.props.onChange();
  }

  render = () => {

    const tabClass = classNames({
      'tab-list': true,
      'active-tab': this.state.isSelected
    }, this.props.className);

    return (
      <li className={tabClass}>
        <button className="tab-link"
                tabIndex="0"
                onClick={this.handleClick}>
          {this.props.children}
        </button>
      </li>
    );
  }

}


module.exports = TabButton;