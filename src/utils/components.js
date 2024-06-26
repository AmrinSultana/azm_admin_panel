import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import LoadableComponent from 'react-loadable'
import { compose, branch, renderComponent, withContext, getContext } from 'recompose'
import LoadingSpinner from 'components/LoadingSpinner'

/**
 * Show a loading spinner when a condition is truthy. Used within
 * spinnerWhileLoading. Accepts a test function and a higher-order component.
 * @param {Function} condition - Condition function for when to show spinner
 * @returns {HigherOrderComponent}
 */
export function spinnerWhile(condition) {
  return branch(condition, renderComponent(LoadingSpinner))
}

/**
 * Show a loading spinner while props are loading . Checks
 * for undefined, null, or a value (as well as handling `auth.isLoaded` and
 * `profile.isLoaded`). **NOTE:** Meant to be used with props which are passed
 * as props from state.firebase using connect (from react-redux), which means
 * it could have unexpected results for other props
 * @param {Array} propNames - List of prop names to check loading for
 * @returns {HigherOrderComponent}
 * @example <caption>Spinner While Data Loading</caption>
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
 *
 * const enhance = compose(
 *   firebaseConnect(() => ['projects']),
 *   connect(({ firebase: { data: { projects } } }) => ({ projects })),
 *   spinnerWhileLoading(['projects'])
 * )
 *
 * export default enhance(SomeComponent)
 */
export function spinnerWhileLoading(propNames) {
  if (!propNames || !Array.isArray(propNames)) {
    const missingPropNamesErrMsg =
      'spinnerWhileLoading requires propNames array'
    console.error(missingPropNamesErrMsg) // eslint-disable-line no-console
    throw new Error(missingPropNamesErrMsg)
  }
  return spinnerWhile(props =>
    propNames.some(name => !isLoaded(get(props, name)))
  )
}

/**
 * HOC that shows a component while condition is true
 * @param {Function} condition - function which returns a boolean indicating
 * whether to render the provided component or not
 * @param {React.Component} component - React component to render if condition
 * is true
 * @returns {HigherOrderComponent}
 */
export function renderWhile(condition, component) {
  return branch(condition, renderComponent(component))
}

/**
 * HOC that shows a component while any of a list of props loaded from Firebase
 * is empty (uses react-redux-firebase's isEmpty).
 * @param {Array} propNames - List of prop names to check loading for
 * @param {React.Component} component - React component to render if prop loaded
 * from Firebase is empty
 * @returns {HigherOrderComponent}
 * @example
 * renderWhileEmpty(['todos'], () => <div>Todos Not Found</div>),
 */
export function renderWhileEmpty(propNames, component) {
  if (!propNames || !Array.isArray(propNames)) {
    const missingPropNamesErrMsg = 'renderWhileEmpty requires propNames array'
    console.error(missingPropNamesErrMsg) // eslint-disable-line no-console
    throw new Error(missingPropNamesErrMsg)
  }
  return renderWhile(
    // Any of the listed prop name correspond to empty props (supporting dot path names)
    props =>
      propNames.some(propNames, name => {
        const propValue = get(props, name)
        return (
          isLoaded(propValue) &&
          (isEmpty(propValue) ||
            (Array.isArray(propValue) && !Object.keys(propValue).length))
        )
      }),
    component
  )
}

/**
 * Create component which is loaded async, showing a loading spinner
 * in the meantime.
 * @param {object} opts - Loading options
 * @param {Function} opts.loader - Loader function (should return import promise)
 * @returns {React.Component}
 */
export function Loadable(opts) {
  return LoadableComponent({
    loading: LoadingSpinner,
    ...opts
  })
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    // TODO: Report error to sentry
    console.log('error:', error, errorInfo) // eslint-disable-line no-console
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

/**
 * HOC that adds store to props
 * @return {HigherOrderComponent}
 */
export const withStore = compose(
  withContext({ store: PropTypes.object }, () => {}),
  getContext({ store: PropTypes.object })
)
