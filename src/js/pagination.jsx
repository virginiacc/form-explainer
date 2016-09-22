const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');

class Pagination extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick = (page, e) => {
    typeof this.props.onChange == 'function' && this.props.onChange(page);
  }

  generatePageLinks (pages, page) {
    return pages.map(function (item, ind) {
        const linkClass = classNames({
          'current-page': page === ind
        }, 'page-link form-explainer_page-link');
        
        return (
          <li key={ind}>
             <a className={linkClass} 
                onClick={this.handleClick.bind(null, ind)}>
              {ind + 1}
            </a>
          </li>
        );
    }, this);
  }

  render () {
      const {className, onChange, pages, page, ...props} = this.props;
      const navClass = classNames('pagination explain_pagination', className);

      return (
        <nav className={navClass} {...props}>
          <span className="form-explainer_nav-label">Viewing page:</span>
          <ul className="form-explainer_page-links page-links">
              {this.generatePageLinks(pages, page)}
          </ul>
        </nav>
      );
  }
}

module.exports = Pagination;
