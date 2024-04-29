import { deepPurple } from '@material-ui/core/colors';

export default theme => ({
  root: {
    padding: theme.spacing(2),
    height: 840
  },
  chartContainer: {
    height: 700,
    position: "relative"
  },
  progress: {
    ...theme.flexRowCenter,
    alignItems: 'center',
    paddingTop: theme.spacing(8)
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  media: {
    height: 0,
    paddingTop: '76.25%',
  },
})
