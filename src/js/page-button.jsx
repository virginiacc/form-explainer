const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

class PageButton extends React.Component {
  static defaultProps = {
    buttonClass: 'btn',
    disabledButtonClass: 'btn__disabled'
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  isDisabled = () => {
    const direction = this.props.direction;
    const page = this.props.page;
    return (page === 0 && direction === 'prev') || (page === this.props.lastPage && direction === 'next');
  }

  handleClick = () => {
    if (!this.isDisabled()) {
      const newPage = (this.props.direction === 'next') ? this.props.page + 1 : this.props.page - 1;
      typeof this.props.onChange == 'function' && this.props.onChange(newPage);
    }
  }
  
  render () {
    const buttonClass = classNames({
      [this.props.buttonClass]: true,
      [this.props.disabledButtonClass]: this.isDisabled()
    }, this.props.direction);

    return (
      <button className={buttonClass} onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}


module.exports = PageButton;