export default theme => ({
  root: {
    padding: theme.spacing(2)
  },
  chartContainer: {
    height: 700,
    position: "relative"
  },
  progress: {
    ...theme.flexRowCenter,
    alignItems: 'center',
    paddingTop: theme.spacing(8)
  }
})
