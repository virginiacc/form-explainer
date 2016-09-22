const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const { StickyContainer, Sticky } = require('react-sticky');
const util = require('./util');

const FitImageToWindow = require('./fit-image-to-window.jsx');
const ImageMapOverlay = require('./image-map-overlay.jsx');
const Pagination = require('./pagination.jsx');
const FormExplainerPageButtons = require('./form-explainer-page-buttons.jsx');
const FormExplainerTerms = require('./form-explainer-terms.jsx');
const FormExplainerFilters = require('./form-explainer-filters.jsx');
const ResponsiveComponent = require('./responsive-component.jsx');

class FormExplainer extends React.Component {
  // propTypes: pages --> isRequired
  static defaultProps = {
    categories: [],
    page: 0,
    category: '',
    breakpoint: 600
  }

  constructor (props) {
    super(props);
    this.state = {
      page: this.props.page,
      category: this.props.category || (this.props.categories[0] || {}).id,
      hovered: null,
      active: null,
      on: this.props.breakpoint ? false : true
    }
  }
  
  handleResize = () => {
    const width = util.getWindowDimensions().width;
    const on = width > this.props.breakpoint;
    if (on !== this.state.on) {
      this.setState({on: on});
    }
  }

  filterTerms (terms, category) {
    return terms.filter(function(term){
      console.log(category, term.category)
      return (term.category === category);
    });
  }

  updateState = (prop, value) => {
    if (prop === 'imageWidth') {
      //console.log('update main state', value)
    }
    this.setState({[prop]: value});
  }

  termCollapsed = () => {
    // when an expandable is collapsed, update the sticky components
    // to respond to changes in explain div height
    //this.refs.stickyPagination.getChildComponent().recomputeState();
    //this.refs.stickyImage.getChildComponent().recomputeState();
  }

  componentDidMount = () => {
    this.containerNode = ReactDOM.findDOMNode(this.refs.explain);
    if (this.props.breakpoint) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  render () {       
    const pageData = this.props.pages[this.state.page] || {};
        console.log('current cat:', this.state.category);

    const terms = this.filterTerms(pageData.terms, this.state.category);
    //console.log(terms)
    const pageCount = this.props.pages.length;
    let imageStyle = {};
    let termsStyle = {};
    if (this.state.imageWidth && this.containerNode) {
      imageStyle = {width: this.state.imageWidth};
      termsStyle = {width: this.containerNode.offsetWidth - this.state.imageWidth + 'px'};
    }
    //console.log(this.state.on)
    return(

      <div className="explain" aria-controls="form-explainer" ref="explain">

        {this.props.categories &&
          <FormExplainerFilters 
            categories={this.props.categories} 
            category={this.state.category} 
            onChange={this.updateState.bind(null, 'category')}/>
        }

        <StickyContainer>
          <Sticky ref="stickyPagination" isActive={this.state.on}>
            {pageCount > 1 &&
              <div>
                <Pagination 
                  page={this.state.page} 
                  pages={this.props.pages} 
                  onChange={this.updateState.bind(null, 'page')} 
                  className="u-clearfix"/>
              </div>
            }
          </Sticky>

          <StickyContainer>
            <figure className="explain_page" >

              <div className="image-map explain_image-map" style={imageStyle}>
                <Sticky isActive={this.state.on} ref="stickyImage">

                  <div className="image-map_wrapper" style={imageStyle}>
                    {pageCount > 1 &&
                      <FormExplainerPageButtons 
                        page={this.state.page} 
                        lastPage={pageCount - 1}
                        onChange={this.updateState.bind(null, 'page')}/>
                    }
                    <FitImageToWindow
                      src={pageData.img} 
                      className="image-map_image"
                      onResize={this.updateState.bind(null, 'imageWidth')}
                      on={this.state.on}/>

                    <ImageMapOverlay 
                      terms={terms} 
                      hovered={this.state.hovered} 
                      active={this.state.active}
                      onChange={this.updateState}/>
                  </div>

                </Sticky>
              </div>
              <figcaption className="terms explain_terms" style={termsStyle}>
                <FormExplainerTerms 
                  terms={terms}
                  category={this.state.category}
                  hovered={this.state.hovered} 
                  active={this.state.active}
                  onCollapsed={this.termCollapsed}
                  onChange={this.updateState} />
              </figcaption>

            </figure>
          </StickyContainer>
        </StickyContainer>
      </div>    
    );
  }
};

module.exports = FormExplainer;