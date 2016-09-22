const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const PageButton = require('./page-button.jsx');

class FormExplainerPageButtons extends React.Component {
  static defaultProps = {
    className: "form-explainer_page-buttons"
  }

  static propTypes = {
    page: React.PropTypes.number.isRequired, 
    lastPage: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    buttonClass: React.PropTypes.string,
    disabledButtonClass: React.PropTypes.string
  }

  render() {
    const {className, ...props} = this.props;
    return (
      <div className={this.props.className}>
        <PageButton direction="prev" {...props}>
          <span className="u-visually-hidden">Previous page</span>
          <span className="cf-icon cf-icon-left"></span>
        </PageButton>
        <PageButton direction="next" {...props}>
          <span className="u-visually-hidden">Next page</span>
          <span className="cf-icon cf-icon-right"></span>
        </PageButton>
      </div>
    ) 
  }
}

module.exports = FormExplainerPageButtons;