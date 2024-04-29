import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
// import Navbar from 'containers/Navbar'
// import { Notifications } from 'modules/notification'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import styles from './CoreLayout.styles'
import { useMediaQuery } from '@material-ui/core'
import { Sidebar, Topbar, Footer } from './components'

const useStyles = makeStyles(styles)

function CoreLayout({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })

  const [openSidebar, setOpenSidebar] = useState(false)

  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }

  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  );

  // return (
  //   <div className={classes.container}>
  //     <Navbar />
  //     <div className={classes.children}>{children}</div>
  //     <Notifications />
  //   </div>
  // )
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
