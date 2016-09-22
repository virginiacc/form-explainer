const React = require('react');
const ReactDOM = require('react-dom');
const FormExplainer = require('./form-explainer.jsx');

module.exports = function (elem, pages, categories) {
	ReactDOM.render(<FormExplainer categories={categories || {}} pages={pages || []}/>, elem);
}
