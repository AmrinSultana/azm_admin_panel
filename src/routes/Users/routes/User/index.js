import { Loadable } from 'utils/components'

export default {
  path: ':userId',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/UserPage')
  })
}
